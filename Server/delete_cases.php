<?php
require "./cors.php";
require "./database.php";
header('Content-Type: application/json; charset=utf-8');
try{
// Check database connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Sorry, we are unable to connect to the database right now. Please try again later.",
    ]);
    exit;
}
// If POST contains a post_id -> delete case by paientID and adminID
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['post_id'])) {
        $admin_id   = $_POST['admin_id'] ?? 0;
        $session_id = $_POST['session_id'] ?? '';
        $post_id = $_POST['post_id'] ?? 0;
    
    //verify admin and session ids
    require "verifySession.php";
    // fetch patient_name before deletion so we can save it in history
    
    $patient_name = '';
                $p_stmt = $conn->prepare("SELECT patient_name FROM active_cases WHERE id = ? LIMIT 1");
                if ($p_stmt) {
                    $p_stmt->bind_param("i", $post_id);
                    $p_stmt->execute();
                    $p_stmt->bind_result($patient_name);
                    $p_stmt->fetch();
                    $p_stmt->close();
                }

    $stmt = $conn->prepare(
            "DELETE FROM active_cases WHERE id = ? AND admin_id = ?"
        );
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Something went wrong when deleting data."]);
            exit;
        }

        
        $stmt->bind_param("ii", $post_id, $admin_id);
       

        $exec = $stmt->execute();
        if (!$exec) {
            echo json_encode(["success" => false, "message" => "Delete failed"]);
            exit;
        }
        else{
            // Prepare SQL for inserting into cases_history with patient_name and admin_name
            
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id,patient_name , admin_id, action) VALUES (?,?, ?, ?)"
            );
            if ($history_stmt) {
                $action = 'Delete';
                $history_stmt->bind_param("isis", $post_id, $patient_name ,$admin_id, $action);
                $history_stmt->execute();
                $history_stmt->close();
            }

            echo json_encode(["success" => true, "message" => "Case deleted successfully."]);
            exit;
        }}
    else{
        exit;
    }

}
catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong on our end. Please try again in a moment. ",
        
    ]);
    exit;
}