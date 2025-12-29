<?php
require 'cors.php';        // Enable CORS headers for cross-origin requests
require 'database.php';    // Include database connection

// Ensure the response is always JSON
header('Content-Type: application/json; charset=utf-8');

try {
    // --- Database Connection Check ---
    if (isset($conn) && $conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
        exit;
    }

    // --- Request Method Validation ---
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["success" => false, "message" => "Invalid request method"]);
        exit;
    }

    // --- Read JSON Payload ---
    $input = json_decode(file_get_contents('php://input'), true); // decode as associative array
    if (!is_array($input)) {
        echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
        exit;
    }

    // --- Extract Input Variables ---
    $admin_id = isset($input['admin_id']) ? intval($input['admin_id']) : 0;
    $post_id = isset($input['post_id']) ? intval($input['post_id']) : 0;
    $changed_data = isset($input['changed_data']) ? $input['changed_data'] : [];
    // session IDs are tokens (strings) — do not cast to int
    $session_id = isset($input['session_id']) ? $input['session_id'] : '';

    // verify admin and session ids
    require "verifySession.php";


    // --- Validate Required IDs ---
    if ($admin_id <= 0 || $post_id <= 0) {
        echo json_encode(["success" => false, "message" => "Missing or invalid admin_id or post_id"]);
        exit;
    }

    // --- Validate Changed Data ---
    if (!is_array($changed_data) || count($changed_data) === 0) {
        echo json_encode(["success" => false, "message" => "No fields to update"]);
        exit;
    }

    // --- Whitelist Columns to Prevent SQL Injection ---
    $allowedColumns = [
        'patient_name', 'health_issue', 'description', 'raised', 'goal',
        'address', 'contact_phone', 'contact_email', 'bank_name', 'bank_branch',
        'account_holder', 'account_number', 'is_urgent'
    ];

    $columns = []; // Columns to update in SQL
    $values = [];  // Values for prepared statement

    // --- Prepare Columns and Values for SQL ---
    foreach ($changed_data as $key => $value) {
        if (in_array($key, $allowedColumns, true)) {
            $columns[] = "`" . $key . "` = ?"; // use backticks for column names
            $values[] = $value;               // store corresponding value
        }
    }

    // --- Check if there are valid fields to update ---
    if (count($columns) === 0) {
        echo json_encode(["success" => false, "message" => "No valid fields to update"]);
        exit;
    }

    // --- Append admin_id and post_id for WHERE clause ---
    $values[] = $admin_id;
    $values[] = $post_id;

    // --- Build SQL Query ---
    $sql = "UPDATE active_cases SET " . implode(", ", $columns) . " WHERE admin_id = ? AND id = ?";

    // --- Prepare Statement ---
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Failed to prepare statement: " ]);
        exit;
    }

    // --- Bind Parameters Dynamically ---
    // Use 's' for all parameters for simplicity (string type)
    $types = str_repeat('s', count($values));
    $bind_params = array_merge([$types], $values);

    // mysqli bind_param requires references
    $refs = [];
    foreach ($bind_params as $key => $val) {
        $refs[$key] = &$bind_params[$key];
    }

    // Bind parameters to prepared statement
    call_user_func_array([$stmt, 'bind_param'], $refs);

    // --- Execute Statement ---
        if ($stmt->execute()) {

        // --- Log Case History ---
        // Only log if there were actual changes
        if (count($changed_data) > 0) {
            // Prepare SQL for inserting into cases_history
            $history_stmt = $conn->prepare(
                "INSERT INTO cases_history (case_id, admin_id, action, changed_fields) VALUES (?, ?, ?, ?)"
            );

            if ($history_stmt) {
                $action = 'Edit';
                $changed_json = json_encode($changed_data); // convert changed fields to JSON

                
                // insert history with patient_name and admin_name
                $history_insert = $conn->prepare(
                    "INSERT INTO cases_history (case_id,  admin_id,  action, changed_fields) VALUES (?, ?, ?, ?)"
                );
                if ($history_insert) {
                    $history_insert->bind_param("iiss", $post_id, $admin_id, $action, $changed_json);
                    $history_insert->execute();
                    $history_insert->close();
                }
            }
        }

        echo json_encode(["success" => true, "message" => "Case updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Update failed: " ]);
    }

    exit;

} catch (Exception $e) {
    // --- Catch any unexpected errors ---
    echo json_encode(["success" => false, "message" =>  "Something went wrong on our end. Please try again in a moment."]);
    exit;
}
?>
