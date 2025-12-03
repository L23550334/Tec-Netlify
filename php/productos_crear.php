<?php
// php/productos_crear.php - Crear un nuevo producto
header('Content-Type: application/json');
include 'conexion.php';
session_start();

// Leer datos del request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nombre']) || !isset($data['precio']) || !isset($data['stock'])) {
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

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

// Insertar producto
$sql = "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdi", $nombre, $descripcion, $precio, $stock);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Producto creado correctamente', 'id_producto' => $conn->insert_id]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al crear: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
