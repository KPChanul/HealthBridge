<?php
// this file is used to send feedback to HealthBridge Email


$frontendOrigin = 'http://localhost:5173'; //host
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $frontendOrigin) {
    header("Access-Control-Allow-Origin: $frontendOrigin");
} else {
    // For strictness use the specific origin above. During development you can use '*'.
    header("Access-Control-Allow-Origin: $frontendOrigin");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

// Reply to preflight and stop further processing
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Tell the browser that we are returning JSON
header("Content-Type: application/json");

// Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include PHPMailer files (these are required for sending emails)
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Get POST data sent from React frontend
// The data comes as JSON, so we decode it into a PHP associative array
$data = json_decode(file_get_contents("php://input"), true);

// Extract individual fields safely
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$message = $data['message'] ?? '';
$role = $data['role'] ?? '';
$type = $data['type'] ?? '';

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
    // ===== SMTP CONFIGURATION =====
    $mail->isSMTP();                       // Use SMTP to send emails
    $mail->Host = 'smtp.gmail.com';        // Gmail SMTP server
    $mail->SMTPAuth = true;                // Enable SMTP authentication
    $mail->Username = 'noreply.feedback.hb@gmail.com'; // Your Gmail address
    $mail->Password = 'vbtievjvvaodvenu';    // Your Gmail App Password
    $mail->SMTPSecure = 'tls';             // Encryption method
    $mail->Port = 587;                     // SMTP port for TLS

    // ===== EMAIL CONTENT =====
    $mail->setFrom('noreply.feedback.hb@gmail.com', 'Feedback Form'); // Sender info
    $mail->addAddress('healthbridge.uom@gmail.com');               // Recipient (your inbox)
    $mail->isHTML(true);                                     // Send HTML email
    $mail->Subject = "New Feedback Submission by $name ";             // Email subject
    $mail->Body = "
        <h3>New Feedback</h3>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Role:</strong> $role</p>
        <p><strong>Feedback Type:</strong> $type</p>
        <p><strong>Message:</strong> $message</p>
    "; // Email body with submitted data

    // Send the email
    $mail->send();
    // Return JSON success message to frontend
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your feedback has been sent successfully.'
    ]);

    
    
} catch (Exception $e) {
    // Default friendly message
    

    // Map some common errors to simpler, user-friendly messages
    $msg = $e->getMessage();

    if (strpos($msg, 'getaddrinfo') !== false) {
        $friendly = "We are having trouble connecting to our email server. Please try again later.";
    } elseif (strpos($msg, 'SMTP connect() failed') !== false) {
        $friendly = "We cannot send emails right now. Please check your internet connection or try again later.";
    } elseif (strpos($msg, 'Invalid address') !== false) {
        $friendly = "It looks like you entered an invalid email address. Please check and try again.";
    }
    else{
        $friendly = "Oops! We couldn't send your feedback at the moment. Please try again later.";
    }

    echo json_encode([
        'status' => 'error',
        'message' => $friendly
    ]);
}
?>
