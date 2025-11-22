<?php
// cors.php - include this at top of send.php before any output
header("Access-Control-Allow-Origin: http://localhost:5175"); // or "*" for dev
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // cache preflight for a day

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // respond to preflight and stop further processing
}
?>