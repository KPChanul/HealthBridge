<?php
// verifySession.php
// -----------------
// Validates that a provided session token maps to a session and that the
// session belongs to the provided admin_id. Minimal, clear JSON responses
// are returned on failure so callers can pass them through unchanged.

header('Content-Type: application/json; charset=utf-8');
if (!isset($conn)){
    require "./database.php";

}
// Ensure a session token was provided
if (!isset($session_id) || $session_id === null || $session_id === '') {
    echo json_encode([
        "success" => false,
        "message" => "Session ID is required. Please login again.",
        "data" => []
    ]);
    exit;
}

// Prepare statement to check session
$stmt = $conn->prepare("SELECT admin_id, end_time FROM sessions WHERE session_id = ?");
if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare session check.",
        "data" => []
    ]);
    exit;
}

$stmt->bind_param("s", $session_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if session exists
if (!$result || $result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid session.",
        "data" => []
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify admin_id was provided by the caller
if (!isset($admin_id) || $admin_id === null || $admin_id === '') {
    echo json_encode([
        "success" => false,
        "message" => "Admin ID is required.",
        "data" => []
    ]);
    exit;
}



// Compare admin IDs strictly (as integers)
if ((int)$admin_id !== (int)$user['admin_id']) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid adminID.",
        "data" => []
    ]);
    exit;
}

// Check if session expired
if ($user['end_time'] !== null ) {
    echo json_encode([
        "success" => false,
        "message" => "Your session has expired.",
        "data" => []
    ]);
    exit;
}

// Update last_activity only for active sessions
$stmt = $conn->prepare(
    "UPDATE sessions 
     SET last_activity = NOW() 
     WHERE admin_id = ? AND session_id = ? AND end_time IS NULL"
);
$stmt->bind_param("is", $admin_id, $session_id);
$stmt->execute();

// If we reach here the session is valid and belongs to the provided admin.
?>
