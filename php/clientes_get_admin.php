<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include 'conexion.php';

// Obtener solo usuarios con rol de cliente (rol = 3)
$sql = "SELECT id_usuario, nombre, email, telefono FROM usuarios WHERE rol = 3";
$result = $conn->query($sql);

$clientes = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }
}

echo json_encode($clientes);
$conn->close();
?>
