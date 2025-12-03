<?php
// php/productos_eliminar.php - Eliminar un producto
header('Content-Type: application/json');
include 'conexion.php';
session_start();

// Leer datos del request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_producto'])) {
    echo json_encode(['success' => false, 'mensaje' => 'ID de producto no proporcionado']);
    exit;
}

$id_producto = $data['id_producto'];

// Eliminar el producto
$sql = "DELETE FROM productos WHERE id_producto = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_producto);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Producto eliminado correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
