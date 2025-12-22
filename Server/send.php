<?php
require "./cors.php";

?>

<?php
// this file is used to send feedback to HealthBridge Email

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

    $msg = "Something went wrong. Please try again later.";

    $errorText = (string)$e;

    // Group 1: SMTP connection problems (covers many variations)
    if (
        strpos($errorText, 'SMTP connect() failed') !== false ||
        strpos($errorText, 'Could not connect to SMTP host') !== false ||
        strpos($errorText, 'Failed to connect to server') !== false ||
        strpos($errorText, 'Connection failed') !== false
    ) {
        $msg = "We cannot reach our email server. Please check your connection and try again.";
    }

    // Group 2: DNS / Internet issues
    elseif (strpos($errorText, 'getaddrinfo') !== false) {
        $msg = "We are unable to connect to the email server. Please try again later.";
    }

    
    echo json_encode([
        "status" => "error",
        "message" => $msg
    ]);
}

?>
