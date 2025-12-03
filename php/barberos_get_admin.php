<?php
// php/barberos_get_admin.php - Obtener barberos para el admin
header('Content-Type: application/json');
include 'conexion.php';

// Obtener solo usuarios con rol de barbero (rol = 2)
$sql = "SELECT id_usuario, nombre, email, telefono FROM usuarios WHERE rol = 2";
$result = $conn->query($sql);

$barberos = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $barberos[] = $row;
    }
}

echo json_encode($barberos);
$conn->close();
?>
