<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include 'conexion.php';

// Consulta SQL: Une tabla citas con usuarios para sacar nombres de cliente y barbero
$sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, 
        c.id_cliente, c.id_barbero,
        cliente.nombre as cliente_nombre, 
        cliente.email as cliente_email,
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

