<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    $estado = isset($_GET['estado']) ? $_GET['estado'] : '';

    if ($estado) {
        $estado = $conn->real_escape_string($estado);
        $sql = "SELECT 
                    c.id_cita, 
                    c.id_cliente, 
                    c.id_barbero, 
                    c.fecha_hora, 
                    c.servicio, 
                    c.estado,
                    u1.nombre as cliente_nombre,
                    u2.nombre as barbero_nombre
                FROM citas c
                LEFT JOIN usuarios u1 ON c.id_cliente = u1.id_usuario
                LEFT JOIN usuarios u2 ON c.id_barbero = u2.id_usuario
                WHERE c.estado = '$estado'
                ORDER BY c.fecha_hora DESC";
    } else {
        $sql = "SELECT 
                    c.id_cita, 
                    c.id_cliente, 
                    c.id_barbero, 
                    c.fecha_hora, 
                    c.servicio, 
                    c.estado,
                    u1.nombre as cliente_nombre,
                    u2.nombre as barbero_nombre
                FROM citas c
                LEFT JOIN usuarios u1 ON c.id_cliente = u1.id_usuario
                LEFT JOIN usuarios u2 ON c.id_barbero = u2.id_usuario
                ORDER BY c.fecha_hora DESC";
    }

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
