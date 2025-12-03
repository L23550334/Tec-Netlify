<?php
// php/productos_actualizar.php - Actualizar un producto
header('Content-Type: application/json');
include 'conexion.php';
session_start();

// Leer datos del request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_producto']) || !isset($data['nombre']) || !isset($data['precio']) || !isset($data['stock'])) {
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

$id_producto = $data['id_producto'];
$nombre = $data['nombre'];
$precio = $data['precio'];
$stock = $data['stock'];
$descripcion = isset($data['descripcion']) ? $data['descripcion'] : '';

// Validaciones
if ($precio <= 0) {
    echo json_encode(['success' => false, 'mensaje' => 'El precio debe ser mayor a 0']);
    exit;
}

if ($stock < 0) {
    echo json_encode(['success' => false, 'mensaje' => 'El stock no puede ser negativo']);
    exit;
}

// Actualizar producto
$sql = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id_producto = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdii", $nombre, $descripcion, $precio, $stock, $id_producto);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Producto actualizado correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
