<?php
// php/conexion.php

// En producción, usa variables de entorno. Para desarrollo local, puedes hardcodear aquí.
$host = getenv('DB_HOST') ?: 'mysql-354ac1c6-2';  // Tu host de MySQL
$port = getenv('DB_PORT') ?: '13275';              // Tu puerto de MySQL
$user = getenv('DB_USER') ?: 'avnadmin';              
$pass = getenv('DB_PASS') ?: 'AVNS_famV8Ji4b3lZtBcT66u';                 
$db   = getenv('DB_NAME') ?: 'defaultdb';

// Crear conexión con manejo de errores mejorado
try {
    $conn = new mysqli($host, $user, $pass, $db, (int)$port);

    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    // Configurar caracteres a UTF-8 (para ñ y tildes)
    $conn->set_charset("utf8");
} catch (Exception $e) {
    // Log del error para debugging
    error_log("Database connection error: " . $e->getMessage());
    $conn = null;
}
?>
