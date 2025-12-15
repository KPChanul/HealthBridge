<?php
    
    $db_server = "localhost";
    $db_user = "root";
    $db_pass = "";
    $db_name = "health_bridge";

    // Use object-oriented mysqli so other scripts can use $conn->prepare and $conn->connect_error
    $conn = new mysqli($db_server, $db_user, $db_pass, $db_name);
    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
        exit();
    }
?>