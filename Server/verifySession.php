<?php
require "cors.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$sessionID = $data["sessionID"];

// Check session
$stmt = $conn->prepare("SELECT admin_id FROM sessions WHERE session_id = ?");
$stmt->bind_param("s", $sessionID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["valid" => false]);
    exit;
}

$user = $result->fetch_assoc();
echo json_encode(["valid" => true, "admin_id" => $user["admin_id"]]);
?>