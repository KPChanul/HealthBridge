<?php
// Strict CORS: allow only whitelisted origins (dev host(s)).
$allowedOrigins = [
   
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Respond to preflight and stop further processing
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
} else {
    // Origin not allowed: for preflight requests, explicitly deny.
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(403);
        exit();
    }
    // For non-OPTIONS requests, do not set CORS headers so the browser will block cross-origin access.
}
?>