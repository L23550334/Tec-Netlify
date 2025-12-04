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

    // Obtener el id_cliente del parámetro GET
    if (!isset($_GET['id_cliente'])) {
        throw new Exception("id_cliente es requerido");
    }

    $id_cliente = intval($_GET['id_cliente']);

    // Consulta SQL: Obtener todas las citas del cliente
    $sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, 
                   u.nombre as nombre_barbero, u.telefono
            FROM citas c
            JOIN usuarios u ON c.id_barbero = u.id_usuario
            WHERE c.id_cliente = ? 
            ORDER BY c.fecha_hora ASC";

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
    
    ob_end_clean();
    echo json_encode($citas, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
