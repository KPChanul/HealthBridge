<?php
// Enable error reporting temporarily for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow cross-origin requests
require "./cors.php";

// Include database connection
require "./database.php";

// Ensure all responses are JSON
header("Content-Type: application/json; charset=utf-8");

// --- Helper function to send JSON response and exit ---
function send_json($success, $message, $extra = []) {
    echo json_encode(array_merge(["success" => $success, "message" => $message], $extra));
    exit;
}

try {
    // Read raw POST data
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    // Validate input
    if (!is_array($data) || empty($data['username']) || !isset($data['password'])) {
        send_json(false, "Invalid request payload");
    }

    $username = $data["username"];
    $password = $data["password"];

    // --- Fetch admin user ---
    $stmt = $conn->prepare("SELECT admin_id, name, password FROM admins WHERE name = ?");
    if (!$stmt) send_json(false, "Prepare failed: " . $conn->error);

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if user exists
    if ($result->num_rows === 0) {
        send_json(false, "User not found");
    }

    $user = $result->fetch_assoc();

    // Verify password
    if (!password_verify($password, $user["password"])) {
        send_json(false, "Invalid password");
    }

    // --- Update last login time ---
    $update = $conn->prepare("UPDATE admins SET last_logged_in = NOW() WHERE admin_id = ?");
    if (!$update) send_json(false, "Update last login prepare failed: " . $conn->error);
    $update->bind_param("i", $user["admin_id"]);
    $update->execute();

    // --- Generate secure session ID ---
    $sessionID = "";
    do {
        $sessionID = bin2hex(random_bytes(32)); // 64-character secure token


        $insert = $conn->prepare(
             "INSERT INTO sessions (admin_id, session_id, start_time, last_activity) VALUES (?, ?, NOW(), NOW())"
            );
            $insert->bind_param("is", $user["admin_id"], $sessionID);
                    $insert->bind_param("is", $user["admin_id"], $sessionID);
                    $inserted = $insert->execute();

        // If insert fails due to duplicate session_id, regenerate
        } while (!$inserted);

    // --- Determine user role ---
    $role = (strtolower($username) === "sysadmin") ? "sysadmin" : "admin";

    // --- Send success response ---
    send_json(true, "Login successful", [
        "role" => $role,
        "sessionID" => $sessionID,
        "adminId" => intval($user["admin_id"])
    ]);

} catch (Exception $e) {
    // Catch any unexpected errors and respond with JSON
    send_json(false, "Server error ");
}
?>
