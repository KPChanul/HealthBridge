<?php
// ============================================
// Refresh session activity
// Updates last_activity = NOW() for a given session
// ============================================
require "./cors.php";
require "./database.php";

// Read raw POST data (JSON)
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$admin_id = $data['admin_id'] ?? null;
$session_id = $_COOKIE['HB_SESSION'] ?? null

// Validate input
if (!$admin_id || !$session_id) {
    http_response_code(400); // Bad request
    echo json_encode(["success" => false, "message" => "Missing admin_id or session_id"]);
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

// Check if session was updated
if ($stmt->affected_rows === 0) {
    http_response_code(401); // session expired or invalid
    echo json_encode(["success" => false, "message" => "Session not active"]);
    exit;
}

// Success response
echo json_encode(["success" => true, "message" => "Session refreshed"]);
?>
