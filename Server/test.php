<?php
require "database.php"; // your DB connection

// Example admins to add

$hashed = password_hash("admin@123", PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO admins (admin_id,name, password) VALUES (?,?, ?)");
    $admin_id = 130000;
    $name = "sysAdmin";
    $stmt->bind_param("iss", $admin_id, $name, $hashed);

    $stmt->execute();

$admins = [
    

    ["name" => "KasunPerera",   "password" => "kasunpass"],
    ["name" => "NimalFernando", "password" => "nimalpass"],
    ["name" => "SamanSilva",    "password" => "samanpass"],
    ["name" => "ChathuraJay",   "password" => "chathurapass"],
    ["name" => "TharinduGun",   "password" => "tharindupass"],
    ["name" => "DilshanKumar",  "password" => "dilshanpass"],
    ["name" => "IsuruBandara",  "password" => "isurupass"],
    ["name" => "LakshanDevi",   "password" => "lakshanpass"],
    ["name" => "AmilaRuwan",    "password" => "amilapass"]
];

foreach ($admins as $admin) {
    $hashed = password_hash($admin["password"], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO admins (name, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $admin["name"], $hashed);
    $stmt->execute();
}

echo "Test admins added!";
?>
