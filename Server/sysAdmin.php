<?php

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Crucial for POST requests: includes Content-Type
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// The browser sends an OPTIONS request before POST/PUT/DELETE
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // Stop script execution after sending headers
}
    

//data base connection (i do not use database.php)
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
            // For security, avoid displaying detailed database errors in production
            echo json_encode(["status" => 0, "message" => "Database connection error."]);
            // Log the actual error: $e->getMessage()
            exit();
        }
    }
}

$objDb = new DbConnect;
$conn = $objDb->connect();
    
// Determine the HTTP method
$method = $_SERVER['REQUEST_METHOD'];
$response = [];


switch($method) {

    case "GET":
        // Check if the request is for sessions or admins
        if (isset($_GET['type']) && $_GET['type'] === 'sessions') {
            $sql = "SELECT admin_id, start_time, end_time FROM sessions ORDER BY start_time DESC";
        } else {
            $sql = "SELECT admin_id, name, last_logged_in FROM admins";
        }
            
        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode($data);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => 0, "message" => "Failed to fetch records.", "error" => $e->getMessage()]);
        }
        break; 

    case "POST":

        //(get from inputed data and put into databse simpler meaning bellow code)
        
        // Get and decode the JSON data from the request body
        $data = json_decode(file_get_contents('php://input'));
            
        // Check for required fields
        if (!isset($data->name) || !isset($data->password)) {
            http_response_code(400); // Bad Request
            echo json_encode(["status" => 0, "message" => "Missing name or password."]);
            break;
        }

        // --- SECURITY FIX: HASH THE PASSWORD ---
        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        $Last_logged_in = date('Y-m-d H:i:s'); // Include time for more detail
            
        $sql = "INSERT INTO admins (admin_id, name, password, last_logged_in) 
                VALUES (NULL, :name, :password, :last_logged_in)";
            
        try {
            $stmt = $conn->prepare($sql);
                
            // Bind the HASHED password
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':password', $hashed_password); 
            $stmt->bindParam(':last_logged_in', $Last_logged_in);

            if($stmt->execute()) {
                http_response_code(201); // Created
                $response = ['status' => 1, 'message' => 'Record created successfully.'];
            } else {
                http_response_code(500); // Internal Server Error
                $response = ['status' => 0, 'message' => 'Failed to create record.']; 
            }
        } catch (PDOException $e) {
            http_response_code(500); // Internal Server Error
            $response = ['status' => 0, 'message' => 'Database execution error.', 'error' => $e->getMessage()];
        }
            
        echo json_encode($response);
        break;
        
        
    case "PUT":

        //(simply meaning edit data part manage in here)

        // PUT data comes from php://input, same as POST
        $data = json_decode(file_get_contents('php://input'));
            
        // Check for required fields including the ID
        if (!isset($data->admin_id) || !isset($data->name) || !isset($data->password)) {
            http_response_code(400); 
            echo json_encode(["status" => 0, "message" => "Missing required fields for update."]);
            break;
        }

        // Always hash the password before updating!
        $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
        $sql = "UPDATE admins SET name = :name, password = :password WHERE admin_id = :id";
            
        try {
            $stmt = $conn->prepare($sql);
                
            $stmt->bindParam(':id', $data->admin_id);
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':password', $hashed_password); 

            if($stmt->execute()) {
                http_response_code(200); // OK
                $response = ['status' => 1, 'message' => 'Record updated successfully.'];
            } else {
                http_response_code(500); 
                $response = ['status' => 0, 'message' => 'Failed to update record.']; 
            }
        } catch (PDOException $e) {
            http_response_code(500);
            $response = ['status' => 0, 'message' => 'Database execution error.', 'error' => $e->getMessage()];
        }
            
        echo json_encode($response);
        break;

    case "DELETE":

        // simply meanng delete data in frontend same as database

        // (DELETE data usually contains the ID in the URL, but here we assume it's in the body for simplicity with Axios)

        $data = json_decode(file_get_contents('php://input'));

        if (!isset($data->admin_id)) {
            http_response_code(400); 
            echo json_encode(["status" => 0, "message" => "Missing admin ID for deletion."]);
            break;
        }

        $sql = "DELETE FROM admins WHERE admin_id = :id";
            
        try {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $data->admin_id);

            if($stmt->execute()) {
                http_response_code(200); // OK
                $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
            } else {
                http_response_code(500); 
                $response = ['status' => 0, 'message' => 'Failed to delete record.']; 
            }
        } catch (PDOException $e) {
            http_response_code(500);
            $response = ['status' => 0, 'message' => 'Database execution error.', 'error' => $e->getMessage()];
        }
            
        echo json_encode($response);
        break;


        
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(["status" => 0, "message" => "Method not allowed."]);
        break;
    }


?>