<?php

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); 
}

// Database connection class
class DbConnect {
    private $server = 'localhost';
    private $dbname = 'health_bridge';
    private $user = 'root';
    private $pass = '';

    public function connect() {
        try {
            $conn = new PDO('mysql:host=' .$this->server .';dbname=' . $this->dbname, $this->user, $this->pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (\Exception $e) {
            // Changed to "success" => false
            echo json_encode(["success" => false, "message" => "Database connection error."]);
            exit();
        }
    }
}
$admin_id = $_POST['sysadmin-id'] ?? $_GET['sysadmin-id'] ?? null;

// Obtain session id from cookie or request so verifySession can validate it.
$session_id = $_COOKIE['HB_SESSION'] ?? $_POST['HB_SESSION'] ?? $_GET['HB_SESSION'] ?? '';

// verifySession expects a mysqli $conn. It will include database.php if $conn isn't set.
require "./verifySession.php";

// Create a PDO connection for data operations and keep mysqli $conn available
// for the session verification that already ran.
$objDb = new DbConnect;
$pdo = $objDb->connect();
    
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {

    case "GET":
        if (isset($_GET['type']) && $_GET['type'] === 'sessions') {
            $sql = "SELECT admin_id, start_time, end_time FROM sessions ORDER BY start_time DESC";
        } else {
            $sql = "SELECT admin_id, name, last_logged_in FROM admins";
        }
            
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            // Returning the data directly (Standard for GET)
            echo json_encode($data);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to fetch records."]);
        }
        break; 

    case "POST":
        $data = json_decode(file_get_contents('php://input'));
            
        if (!isset($data->name) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Missing name or password."]);
            break;
        }

        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        $Last_logged_in = date('Y-m-d H:i:s');
            
        $sql = "INSERT INTO admins (admin_id, name, password, last_logged_in) 
                VALUES (NULL, :name, :password, :last_logged_in)";
            
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':password', $hashed_password); 
            $stmt->bindParam(':last_logged_in', $Last_logged_in);

            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["success" => true, "message" => "Record created successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to create record."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error."]);
        }
        break;
        
    case "PUT":
        $data = json_decode(file_get_contents('php://input'));
            
        if (!isset($data->admin_id) || !isset($data->name) || !isset($data->password)) {
            http_response_code(400); 
            echo json_encode(["success" => false, "message" => "Missing required fields."]);
            break;
        }

        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        $sql = "UPDATE admins SET name = :name, password = :password WHERE admin_id = :id";
            
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':id', $data->admin_id);
                $stmt->bindParam(':name', $data->name);
                $stmt->bindParam(':password', $hashed_password); 

            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Record updated successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to update record."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error."]);
        }
        break;

    case "DELETE":
        $data = json_decode(file_get_contents('php://input'));

        if (!isset($data->admin_id)) {
            http_response_code(400); 
            echo json_encode(["success" => false, "message" => "Missing admin ID."]);
            break;
        }

        $sql = "DELETE FROM admins WHERE admin_id = :id";
            
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':id', $data->admin_id);

                if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Record deleted successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to delete record."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Database error."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed."]);
        break;
}
?>