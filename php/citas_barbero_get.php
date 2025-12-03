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
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id_barbero);
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
