<?php
// php/citas_admin_get.php - Obtener todas las citas para el admin
header('Content-Type: application/json');
include 'conexion.php';
session_start();

// Validar que el usuario sea admin
if (!isset($_SESSION['usuario_id']) || $_SESSION['rol'] != 1) {
    echo json_encode([]);
    exit;
}

// Consulta SQL: Une tabla citas con usuarios para sacar nombres de cliente y barbero
$sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, 
        cliente.nombre as cliente_nombre, 
        barbero.nombre as barbero_nombre,
        cliente.telefono
        FROM citas c
        JOIN usuarios cliente ON c.id_cliente = cliente.id_usuario
        JOIN usuarios barbero ON c.id_barbero = barbero.id_usuario
        ORDER BY c.fecha_hora ASC";

$result = $conn->query($sql);

$citas = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $citas[] = $row;
    }
}

echo json_encode($citas);
$conn->close();
?>
