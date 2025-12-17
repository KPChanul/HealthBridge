
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

    // If POST contains a patient_name -> create new case
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['patient_name'])) {
        
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

        $stmt = $conn->prepare(
            "INSERT INTO active_cases ( patient_name, health_issue, description, raised, goal, address,  contact_phone, contact_email, bank_name, bank_branch, account_holder, account_number, is_urgent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
        );
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error, "data" => []]);
            exit;
        }

        // types: i (admin_id), s*12, d,d, i
        $types = 'sssddsssssssi';
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
            $is_urgent
        );

        $exec = $stmt->execute();
        if (!$exec) {
            echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error, "data" => []]);
            exit;
        }

        $inserted_id = $stmt->insert_id ?: $conn->insert_id;

        // Return the newly created row (if possible)
        $res = $conn->query("SELECT * FROM active_cases WHERE id = " . intval($inserted_id));
        $row = $res ? $res->fetch_assoc() : [];

        echo json_encode(["success" => true, "message" => "Case created successfully.", "data" => $row]);
        exit;
    }

    // Fallback: If not creating, return cases list for admin (GET or POST admin_id)
    $admin_id = $_GET['admin_id'] ?? $_POST['admin_id'] ?? '';
    if ($admin_id === '') {
        echo json_encode([
            "success" => true,
            "message" => "No admin_id provided.",
            "data" => []
        ]);
        exit;
    }

    // Prepare SQL query to get cases sorted by date/time (descending)
    $stmt = $conn->prepare("SELECT * FROM active_cases WHERE admin_id = ? ORDER BY posted_time DESC");
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

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong on our end. Please try again in a moment.",
        "data"  => []
    ]);
    exit;
}
?>
