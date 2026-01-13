<?php
require "./cors.php";        // Enable CORS headers
require "./database.php";    // Database connection

// Always return JSON
header('Content-Type: application/json; charset=utf-8');

try {

    // ---------------- DATABASE CONNECTION CHECK ----------------
    if ($conn->connect_error) {
        echo json_encode([
            "success" => false,
            "message" => "Sorry, we are unable to connect to the database right now. Please try again later."
        ]);
        exit;
    }

    // ---------------- READ JSON REQUEST BODY ----------------
    $input = json_decode(file_get_contents("php://input"), true)??[];
    if (!is_array($input)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid request payload."
        ]);
        exit;
    }

    // ---------------- COMMON INPUT VALUES ----------------
    //$action     = $input['action'] ?? '';      // create | delete | get | update
    //$admin_id   = intval($input['admin_id'] ?? 0);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Handle requests from SysAdmin Table (axios.get)
        $action   = $_GET['type'] ?? 'get'; 
        $admin_id = intval($_GET['sysadmin-id'] ?? 0);
    } else {
        // Handle standard Form requests (axios.post/fetch)
        $action   = $input['action'] ?? '';
        $admin_id = intval($input['admin_id'] ?? 0);
        
        // HIGHLIGHT: Only throw "Invalid payload" if it's a POST request with no data
        if (empty($input) && $_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode(["success" => false, "message" => "Invalid request payload."]);
            exit;
        }
    }


    $session_id =  $_COOKIE['HB_SESSION'] ?? '';

    // ---------------- VERIFY ADMIN SESSION ----------------
    // This file should:
    // 1. Validate session_id
    // 2. Match admin_id with session
    // 3. Exit if invalid
    require "verifySession.php";

    // ---------------- ACTION ROUTER ----------------
    switch ($action) {

        // =====================================================
        // CASE for System Admin to see everything
        // =====================================================
        
        case "all_cases":
            $stmt = $conn->prepare("SELECT * FROM active_cases ORDER BY posted_time DESC");
            $stmt->execute();
            $result = $stmt->get_result();
            $cases = [];
            while ($row = $result->fetch_assoc()) {
                $cases[] = $row;
            }
            // HIGHLIGHT: Returns raw array so "Array.isArray(res.data)" in React works
            echo json_encode($cases);
            exit;
            break;


        // =====================================================
        // CREATE NEW CASE
        // =====================================================
        case "create":

            // Insert new patient case
            $stmt = $conn->prepare(
                "INSERT INTO active_cases 
                (patient_name, health_issue, description, raised, goal, address,
                 contact_phone, contact_email, bank_name, bank_branch,
                 account_holder, account_number, is_urgent, admin_id)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            );

            if (!$stmt) {
                echo json_encode(["success" => false, "message" => "Insert preparation failed"]);
                exit;
            }

            $stmt->bind_param(
                "sssddsssssssii",
                $input['patient_name'],
                $input['health_issue'],
                $input['description'],
                $input['raised'],
                $input['goal'],
                $input['address'],
                $input['contact_phone'],
                $input['contact_email'],
                $input['bank_name'],
                $input['bank_branch'],
                $input['account_holder'],
                $input['account_number'],
                $input['is_urgent'],
                $admin_id
            );

            $stmt->execute();

            // Get newly created case ID
            $case_id = $conn->insert_id;
            $stmt->close();

            // Insert case creation history
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action)
                 VALUES (?, ?, 'Create')"
            );
            $history_stmt->bind_param("ii", $case_id, $admin_id);
            $history_stmt->execute();
            $history_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Case created successfully."
            ]);
            break;

        /* // =====================================================
        // DELETE CASE
        // =====================================================
        case "delete":

            $post_id = intval($input['post_id'] ?? 0);

            // Delete case only if it belongs to this admin
            $stmt = $conn->prepare(
                "DELETE FROM active_cases WHERE id = ? AND admin_id = ?"
            );

            if (!$stmt) {
                echo json_encode(["success" => false, "message" => "Delete preparation failed"]);
                exit;
            }

            $stmt->bind_param("ii", $post_id, $admin_id);
            $stmt->execute();
            $stmt->close();

            // Log delete action in history
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action)
                 VALUES (?, ?, 'Delete')"
            );
            $history_stmt->bind_param("ii", $post_id, $admin_id);
            $history_stmt->execute();
            $history_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Case deleted successfully."
            ]);
            break;

 */

        // =====================================================
        // DELETE CASE
        // =====================================================
        case "delete":
            $post_id = intval($input['post_id'] ?? 0);

            // --- 1. PREPARE THE DELETE QUERY ---
            // Check if the current user is the System Admin (130000)
            if ($admin_id === 130000) {
                // System Admin can delete ANY case by its ID
                $stmt = $conn->prepare("DELETE FROM active_cases WHERE id = ?");
                $stmt->bind_param("i", $post_id);
            } else {
                // Regular admins can only delete cases they created
                $stmt = $conn->prepare("DELETE FROM active_cases WHERE id = ? AND admin_id = ?");
                $stmt->bind_param("ii", $post_id, $admin_id);
            }

            if (!$stmt) {
                echo json_encode(["success" => false, "message" => "Delete preparation failed"]);
                exit;
            }

            $stmt->execute();
            $stmt->close();

            // --- 2. LOG THE ACTION IN HISTORY ---
            // We log the action even if it was done by the System Admin
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action) 
                VALUES (?, ?, 'Delete')"
            );
            
            // The admin_id logged here will be 130000 if the SysAdmin did it
            $history_stmt->bind_param("ii", $post_id, $admin_id);
            $history_stmt->execute();
            $history_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Case deleted successfully."
            ]);
            break;    






        // =====================================================
        // GET CASES FOR ADMIN
        // =====================================================
        case "get":

            // Fetch all cases created by this admin
            $stmt = $conn->prepare(
                "SELECT * FROM active_cases WHERE admin_id = ? ORDER BY posted_time ASC"
            );
            $stmt->bind_param("i", $admin_id);
            $stmt->execute();
            $result = $stmt->get_result();

            $cases = [];
            while ($row = $result->fetch_assoc()) {
                $cases[] = $row;
            }

            echo json_encode([
                "success" => true,
                "message" => "",
                "data" => $cases
            ]);
            break;

        /*  // =====================================================
        // UPDATE / CHANGE CASE
        // =====================================================
        case "update":

            $post_id      = intval($input['post_id'] ?? 0);
            $changed_data = $input['changed_data'] ?? [];

            // Allowed columns to prevent SQL injection
            $allowedColumns = [
                'patient_name', 'health_issue', 'description', 'raised', 'goal',
                'address', 'contact_phone', 'contact_email', 'bank_name',
                'bank_branch', 'account_holder', 'account_number', 'is_urgent'
            ];

            $columns = [];
            $values  = [];

            // Build dynamic update fields
            foreach ($changed_data as $key => $value) {
                if (in_array($key, $allowedColumns, true)) {
                    $columns[] = "`$key` = ?";
                    $values[]  = $value;
                }
            }

            if (count($columns) === 0) {
                echo json_encode(["success" => false, "message" => "No valid fields to update"]);
                exit;
            }

            // Add admin_id and post_id to WHERE clause
            $values[] = $admin_id;
            $values[] = $post_id;

            $sql = "UPDATE active_cases SET " . implode(", ", $columns) .
                   " WHERE admin_id = ? AND id = ?";

            $stmt = $conn->prepare($sql);
            $types = str_repeat("s", count($values));
            $stmt->bind_param($types, ...$values);
            $stmt->execute();
            $stmt->close();

            // Log update history with changed fields
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action, changed_fields)
                 VALUES (?, ?, 'Edit', ?)"
            );

            $changed_json = json_encode($changed_data);
            $history_stmt->bind_param("iis", $post_id, $admin_id, $changed_json);
            $history_stmt->execute();
            $history_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Case updated successfully."
            ]);
            break;
 */     

        // =====================================================
        // UPDATE / CHANGE CASE
        // =====================================================
        case "update":

            $post_id      = intval($input['post_id'] ?? 0);
            $changed_data = $input['changed_data'] ?? [];

            // Allowed columns to prevent SQL injection
            $allowedColumns = [
                'patient_name', 'health_issue', 'description', 'raised', 'goal',
                'address', 'contact_phone', 'contact_email', 'bank_name',
                'bank_branch', 'account_holder', 'account_number', 'is_urgent'
            ];

            $columns = [];
            $values  = [];

            // Build dynamic update fields
            foreach ($changed_data as $key => $value) {
                if (in_array($key, $allowedColumns, true)) {
                    $columns[] = "`$key` = ?";
                    $values[]  = $value;
                }
            }

            if (count($columns) === 0) {
                echo json_encode(["success" => false, "message" => "No valid fields to update"]);
                exit;
            }

            // --- 1. DYNAMIC WHERE CLAUSE ---
            // HIGHLIGHT: If SysAdmin, remove the admin_id restriction from the query
            $sql = "UPDATE active_cases SET " . implode(", ", $columns);
            
            if ($admin_id === 130000) {
                $sql .= " WHERE id = ?";
                $values[] = $post_id;
            } else {
                $sql .= " WHERE admin_id = ? AND id = ?";
                $values[] = $admin_id;
                $values[] = $post_id;
            }

            $stmt = $conn->prepare($sql);
            $types = str_repeat("s", count($values));
            $stmt->bind_param($types, ...$values);
            $stmt->execute();
            $stmt->close();

            // --- 2. LOG UPDATE HISTORY ---
            // HIGHLIGHT: History is logged using the $admin_id of the person who made the change
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action, changed_fields)
                VALUES (?, ?, 'Edit', ?)"
            );

            $changed_json = json_encode($changed_data);
            $history_stmt->bind_param("iis", $post_id, $admin_id, $changed_json);
            $history_stmt->execute();
            $history_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Case updated successfully."
            ]);
            break;     




        // =====================================================
        // INVALID ACTION
        // =====================================================
        default:
            echo json_encode([
                "success" => false,
                "message" => "Invalid action."
            ]);
    }

} catch (Exception $e) {

    // ---------------- GLOBAL ERROR HANDLER ----------------
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong on our end. Please try again in a moment."
    ]);
    exit;
}
