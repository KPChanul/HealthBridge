<?php
require "database.php"; // your DB connection

// Example admins to add
$admins = [
    ["name" => "sysAdmin", "password" => "admin123"],
    ["name" => "JohnDoe", "password" => "johnpass"],
    ["name" => "JaneSmith", "password" => "janepass"]
];

foreach ($admins as $admin) {
    $hashed = password_hash($admin["password"], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO admins (name, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $admin["name"], $hashed);
    $stmt->execute();
}

echo "Test admins added!";
?>
