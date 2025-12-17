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

// Prepare SQL query to get cases sorted by date
$sql = "SELECT * FROM active_cases ORDER BY posted_time ASC";
$result = $conn->query($sql);

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
catch (Throwable $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),   // 👈 REAL ERROR
        "file" => $e->getFile(),
        "line" => $e->getLine(),
        "data" => []
    ]);
}

?>
