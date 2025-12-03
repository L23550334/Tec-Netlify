<?php
// php/citas_eliminar.php - Eliminar una cita
header('Content-Type: application/json');
include 'conexion.php';
session_start();

// Leer datos del request
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_cita'])) {
    echo json_encode(['success' => false, 'mensaje' => 'ID de cita no proporcionado']);
    exit;
}

$id_cita = $data['id_cita'];

// Eliminar la cita
$sql = "DELETE FROM citas WHERE id_cita = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_cita);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Cita eliminada correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
