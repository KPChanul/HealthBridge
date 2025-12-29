<?php
require 'cors.php';
require 'database.php';
try{
header('Content-Type: application/json; charset=utf-8');
// Check database connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Sorry, we are unable to connect to the database right now. Please try again later.",
    ]);
    exit;
}


// If POST contains a patient_name -> create new case
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['patient_name'])) {
        $admin_id=$_POST['admin_id'] ?? 0;
        $session_id=$_POST['session_id'] ?? '';
        $patient_name = $_POST['patient_name'] ?? '';
        $health_issue = $_POST['health_issue'] ?? '';
        $description = $_POST['description'] ?? '';
        $raised = isset($_POST['raised']) ? floatval($_POST['raised']) : (isset($_POST['raisedAmount']) ? floatval($_POST['raisedAmount']) : 0);
        $goal = isset($_POST['goal']) ? floatval($_POST['goal']) : (isset($_POST['goalAmount']) ? floatval($_POST['goalAmount']) : 0);
        $address = $_POST['address'] ?? '';
        $contact_phone = $_POST['contact_phone'] ?? '';
        $contact_email = $_POST['contact_email'] ?? '';
        $bank_name = $_POST['bank_name'] ?? '';
        $bank_branch = $_POST['bank_branch'] ?? ($_POST['branch'] ?? '');
        $account_holder = $_POST['account_holder'] ?? '';
        $account_number = $_POST['account_number'] ?? '';
        $is_urgent = $_POST['status'] ?? 0;
//creating the new record 

        //verify admin and session ids
        require "verifySession.php";

        $stmt = $conn->prepare(
            "INSERT INTO active_cases ( patient_name, health_issue, description, raised, goal, address,  contact_phone, contact_email, bank_name, bank_branch, account_holder, account_number, is_urgent,admin_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        );
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Something went wrong when inserting data."]);
            exit;
        }

    
        $types = 'sssddsssssssii';
        $stmt->bind_param($types,
            
            $patient_name,
            $health_issue,
            $description,
            $raised,
            $goal,
            $address,
            $contact_phone,
            $contact_email,
            $bank_name,
            $bank_branch,
            $account_holder,
            $account_number,
            $is_urgent,
            $admin_id
        );

        $exec = $stmt->execute();
        if (!$exec) {
            echo json_encode(["success" => false, "message" => "Insert failed"]);
            exit;
        }
        else{
            // get the inserted case id
            $case_id = $conn->insert_id;
            // Prepare SQL for inserting into cases_history
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action) VALUES (?, ?, ?)"
            );
            if ($history_stmt) {
                $action = 'Create';
                // get admin name
                
                // insert history with patient_name and admin_name to avoid relying on trigger
                $history_stmt = $conn->prepare(
                    "INSERT INTO cases_history (case_id, admin_id,  action) VALUES (?, ?, ?)"
                );
                if ($history_stmt) {
                    $history_stmt->bind_param("iis", $case_id, $admin_id,  $action);
                    $history_stmt->execute();
                    $history_stmt->close();
                }
            }
            $stmt->close();
            echo json_encode(["success" => true, "message" => "Case created successfully."]);
            exit;
        }
    } else{
        exit;
    }}
     catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong on our end. Please try again in a moment.",
        
    ]);
    exit;
}
?>
