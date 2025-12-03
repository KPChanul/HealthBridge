<?php
require "./cors.php";
require "./database.php";
header("Content-Type: application/json");

// Read JSON from React
$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"];
$password = $data["password"];

// Fetch user
$stmt = $conn->prepare("SELECT admin_id, password FROM admins WHERE name = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();


// find is there a user with that name
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password securely
if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
    exit;
}

// Update last login
$update = $conn->prepare("UPDATE admins SET last_logged_in = NOW() WHERE admin_id = ?");
$update->bind_param("i", $user["admin_id"]);
$update->execute();


do {
    //Generate secure session ID
    $sessionID = bin2hex(random_bytes(32)); // 64-character secure token

    $insert = $conn->prepare("INSERT INTO sessions (admin_id, session_id) VALUES (?, ?)");
    $insert->bind_param("is", $user["admin_id"], $sessionID);

    // Try inserting; if successful, exit loop
    $inserted = $insert->execute();

    // If $inserted is false, it means UNIQUE constraint violated, regenerate sessionID
} while (!$inserted);

//Determine user role.
$role = (strtolower($username) === "sysadmin" ) ? "sysadmin" : "admin";

// Send response to React
echo json_encode([
    "success" => true,
    "role" => $role,
    "sessionID" => $sessionID,
    "admin_id" => $user["admin_id"]
]);

?>