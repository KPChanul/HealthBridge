<?php
require 'cors.php';
require 'database.php';
try{
// Check database connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Sorry, we are unable to connect to the database right now. Please try again later.",
        "data"  => []
    ]);
    exit;
}
//get IDs
$input = json_decode(file_get_contents("php://input"), true);
$admin_id   = $input['admin_id'] ?? '';
$session_id = $input['session_id'] ?? '';



//verify admin and session ids
require "verifySession.php";


// Prepare SQL query to get cases sorted by date
$stmt = $conn->prepare("SELECT * FROM active_cases WHERE admin_id = ? ORDER BY posted_time ASC");
$stmt->bind_param("i", $admin_id); // "ii" = two integers
$stmt->execute();
$result = $stmt->get_result();


if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Oops! Something went wrong while fetching the data. Please refresh the page or try again later.",
        "data"  => []
    ]);
    exit;
}

// Check if there are any cases
if ($result->num_rows === 0) {
    echo json_encode([
        "success" => true,
        "message" => "No patient cases found at the moment.",
        "data" => []
    ]);
    exit;
}

// Fetch all cases
$cases = [];
while ($row = $result->fetch_assoc()) {
    $cases[] = $row;
}

// Return sorted cases
echo json_encode([
    "success" => true,
    "message" => "",
    "data" => $cases
]);}
catch (Exception $e){
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong on our end. Please try again in a moment.",
        "data"  => []
    ]);
    exit;
}
?>
