<?php
// php/citas_cliente_get.php - Obtener citas de un cliente
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    require_once 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Obtener el id_cliente del parámetro GET
    if (!isset($_GET['id_cliente'])) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'id_cliente es requerido'
        ]);
        exit;
    }

    $id_cliente = intval($_GET['id_cliente']);

    $sql = "SELECT c.id_cita, 
                   DATE(c.fecha_hora) as fecha,
                   TIME_FORMAT(c.fecha_hora, '%H:%i') as hora,
                   c.servicio, 
                   c.estado, 
                   u.nombre as nombre_barbero
            FROM citas c
            JOIN usuarios u ON c.id_barbero = u.id_usuario
            WHERE c.id_cliente = ? 
            ORDER BY c.fecha_hora DESC";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id_cliente);
    $stmt->execute();
    $result = $stmt->get_result();

    $citas = [];
    while($row = $result->fetch_assoc()) {
        $citas[] = $row;
    }

    $stmt->close();
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'citas' => $citas
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
