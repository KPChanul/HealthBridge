<?php
require 'cors.php';
require 'database.php';

// Enable development error reporting (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', '1');

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
$admin_id=$_GET["admin_id"]?? '';
$session_id=$_GET["session_id"]?? '';




// Prepare SQL query to get cases sorted by date
$stmt = $conn->prepare("SELECT * FROM active_cases WHERE admin_id = ? ORDER BY posted_date ASC");

$stmt->bind_param("i", $admin_id); 
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
]);

} catch (Throwable $e) {
    // Return detailed error for debugging
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine(),
        "data" => []
    ]);
    exit;
}
?>
