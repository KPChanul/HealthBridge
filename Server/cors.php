<?php
//this is to prevent cors error
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
?>