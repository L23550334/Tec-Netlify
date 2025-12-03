<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

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

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $citas = [];
    while($row = $result->fetch_assoc()) {
        $citas[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode($citas, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
