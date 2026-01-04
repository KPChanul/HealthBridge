<?php

require "./cors.php";    
require "./database.php";

//Load the mail robot

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

try{
    //1.Find the unpublished stories
    //we look for cases where email_sent is 0.

    $sql = "SELECT * FROM active_cases WHERE email_sent = 0";
    $result = $conn->query($sql);

    // If the basket is empty, stop here.
    if ($result->num_rows == 0) {
        echo json_encode(["success" => false, "message" => "No new pending cases found today."]);
        exit;}


    //2.Write the Email

    //start the email with a nice header

    $emailBody = "
        <div style='font-family: Arial, sans-serif; color: #333;'>
            <h2 style='color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;'>
                HealthBridge Daily Digest
            </h2>
            <p>Hello! Here are the new funding requests that need your support today.</p>
    ";
    $caseIdsToSend = []; // We will keep a list of IDs we find (e.g., [5, 8, 9])

    // Loop through every new case and stack them into the email
    while ($row = $result->fetch_assoc()) {
        $caseIdsToSend[] = $row['id']; // Save ID to mark as 'sent' later
        // Append this story to the email body
        $emailBody .= "
            <div style='background-color: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ddd;'>
                <h3 style='margin-top: 0; color: #d9534f;'>{$row['patient_name']}</h3>
                <p><strong>Health Issue:</strong> {$row['health_issue']}</p>
                <p><strong>Amount Needed:</strong> Rs. " . number_format($row['goal']) . "</p>
                <p><i>{$row['description']}</i></p>
            </div>
        ";
    }
    // Finish the email with a footer and a link
    $emailBody .= "
            <hr>
            <p>Please log in to <a href='http://localhost:5173'>HealthBridge</a> to donate.</p>
            <p style='font-size: 12px; color: #777;'>Thank you for supporting the UoM community.</p>
        </div>
    ";

    //3.Deliver to subscribes

    //Get everyone who subscribed

    $sub_sql = "SELECT email FROM subscribers";
    $sub_result = $conn->query($sub_sql);

    if ($sub_result->num_rows > 0) {
        $mail = new PHPMailer(true);

        // --- SMTP CONFIGURATION  ---
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        
        // !!! IMPORTANT: CHANGE THESE TWO LINES !!!
        $mail->Username   = 'healthbridgenotify@gmail.com'; 
        $mail->Password   = 'arioehaojzljtbpi';   
        
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Email Headers
        $mail->setFrom($mail->Username, 'HealthBridge UoM');
        $mail->isHTML(true);
        $mail->Subject = "HealthBridge Update: New Requests Today";
        $mail->Body    = $emailBody; // The big string we built in Phase 2

        // Send to each person
        while ($sub = $sub_result->fetch_assoc()) {
            $mail->addAddress($sub['email']);
            try {
                $mail->send();
            } catch (Exception $e) {
                // If one email fails, we ignore it and keep going
            }
            $mail->clearAddresses(); // Clear the name for the next loop
        }
    }

// ---------------------------------------------------------
    //4.UPDATE THE DATABASE
    // ---------------------------------------------------------
    // Turn the array [1, 5, 8] into string "1,5,8"
    $ids_string = implode(',', $caseIdsToSend);

    // Mark these specific cases as Sent (1)
    $updateSql = "UPDATE active_cases SET email_sent = 1 WHERE id IN ($ids_string)";
    
    if ($conn->query($updateSql)) {
        echo json_encode([
            "success" => true, 
            "message" => "Success! Sent emails for " . count($caseIdsToSend) . " new cases."
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Emails sent, but database update failed."
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "System Error: " . $e->getMessage()
    ]);
}
?>

