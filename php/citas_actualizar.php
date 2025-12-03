<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Leer datos del request
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id_cita']) || !isset($data['estado'])) {
        throw new Exception('Datos incompletos: se requiere id_cita y estado');
    }

    $id_cita = $data['id_cita'];
    $estado = $data['estado'];

    // Validar que el estado sea válido
    $estados_validos = ['pendiente', 'completada', 'cancelada'];
    if (!in_array($estado, $estados_validos)) {
        throw new Exception('Estado inválido. Debe ser: pendiente, completada o cancelada');
    }

    // Actualizar estado
    $sql = "UPDATE citas SET estado = ? WHERE id_cita = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param("si", $estado, $id_cita);

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar: " . $conn->error);
    }

    $stmt->close();
    $conn->close();
    
    ob_end_clean();
    echo json_encode([
        'success' => true, 
        'mensaje' => 'Cita actualizada correctamente'
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
