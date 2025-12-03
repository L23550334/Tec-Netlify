<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include 'conexion.php';
session_start();

// Validar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    // Para pruebas, devolver todas las citas
    // En producción, deberías devolver un array vacío o un error
    $sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, u.nombre as cliente_nombre, u.telefono
            FROM citas c
            JOIN usuarios u ON c.id_cliente = u.id_usuario
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
    exit;
}

$id_barbero = $_SESSION['usuario_id'];

// Consulta SQL Real: Une tabla citas con usuarios para sacar el nombre y teléfono del cliente
$sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, u.nombre as cliente_nombre, u.telefono
        FROM citas c
        JOIN usuarios u ON c.id_cliente = u.id_usuario
        WHERE c.id_barbero = ? 
        ORDER BY c.fecha_hora ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_barbero);
$stmt->execute();
$result = $stmt->get_result();

$citas = [];
while($row = $result->fetch_assoc()) {
    $citas[] = $row;
}

echo json_encode($citas);

$stmt->close();
$conn->close();
?>
