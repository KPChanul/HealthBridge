<?php
require "./cors.php";
require "./database.php";

header('Content-Type: application/json; charset=utf-8');

try {
    if ($conn->connect_error) {
        echo json_encode([
            "success" => false,
            "message" => "Database connection failed."
        ]);
        exit;
    }

    // Read JSON body
    $data = json_decode(file_get_contents("php://input"), true);

    $admin_id   = $data['admin_id']   ?? null;
    $session_id = $data['session_id'] ?? null;

    if (!$admin_id || !$session_id) {
        echo json_encode([
            "success" => false,
            "message" => "Admin ID and Session ID are required."
        ]);
        exit;
    }

    // DIRECTLY UPDATE end_time
    $stmt = $conn->prepare(
        "UPDATE sessions 
         SET end_time = NOW()
         WHERE session_id = ? 
           AND admin_id = ? 
           AND end_time IS NULL"
    );

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to prepare logout query."
        ]);
        exit;
    }

    $stmt->bind_param("si", $session_id, $admin_id);
    $stmt->execute();

    // No rows updated = invalid session or already logged out
    if ($stmt->affected_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid session or session already closed."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Logged out successfully."
    ]);
    exit;

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error. Please try again."
    ]);
    exit;
}
?>
