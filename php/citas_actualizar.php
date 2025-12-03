<?php
// php/citas_actualizar.php - Actualizar estado de citas
header('Content-Type: application/json');
include 'conexion.php';
session_start();

// Leer datos del request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_cita']) || !isset($data['estado'])) {
    echo json_encode(['success' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

$id_cita = $data['id_cita'];
$estado = $data['estado'];

// Validar que el estado sea válido
$estados_validos = ['pendiente', 'completada', 'cancelada'];
if (!in_array($estado, $estados_validos)) {
    echo json_encode(['success' => false, 'mensaje' => 'Estado inválido']);
    exit;
}

// Actualizar estado
$sql = "UPDATE citas SET estado = ? WHERE id_cita = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $estado, $id_cita);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Cita actualizada correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
