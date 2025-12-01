<?php
// php/productos_get.php
header('Content-Type: application/json');
include 'conexion.php';

// Consulta para traer todos los productos
$sql = "SELECT id_producto, nombre, descripcion, precio, stock FROM productos";
$result = $conn->query($sql);

$productos = [];

while($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

// Devolvemos el JSON
echo json_encode($productos);
$conn->close();
?>