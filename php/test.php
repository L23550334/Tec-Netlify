<?php
// test.php
include 'php/conexion.php';

if ($conn) {
    echo "<h1>¡ÉXITO TOTAL! 🎉</h1>";
    echo "<p>La página se conectó correctamente a la base de datos en Aiven.</p>";
    echo "<p>Host: " . getenv('DB_HOST') . "</p>";
} else {
    echo "<h1>Error ☠️</h1>";
}
?>