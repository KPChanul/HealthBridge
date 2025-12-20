<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "database.php";

// Get JSON data from React
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || empty($data['email'])) {
    echo json_encode([
        "success" => false,
        "message" => "Email is required"
    ]);
    exit;
}

$email = trim($data['email']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email format"
    ]);
    exit;
}

// Insert email into database
$stmt = $conn->prepare("INSERT INTO subscribers (email) VALUES (?)");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Subscribed successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "This email is already subscribed"
    ]);
}

$stmt->close();
$conn->close();
?>
