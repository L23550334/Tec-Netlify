<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido. Use PUT']);
    exit;
}

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id_cita']) || !isset($data['estado'])) {
        throw new Exception('Datos incompletos: se requiere id_cita y estado');
    }

    $id_cita = intval($data['id_cita']);
    $estado = $data['estado'];

    $estados_validos = ['pendiente', 'confirmada', 'completada', 'cancelada'];
    if (!in_array($estado, $estados_validos)) {
        throw new Exception('Estado invalido. Debe ser: pendiente, confirmada, completada o cancelada');
    }

    $sql = "UPDATE citas SET estado = ? WHERE id_cita = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param("si", $estado, $id_cita);

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar: " . $conn->error);
    }
    
    if ($stmt->affected_rows === 0) {
        throw new Exception("No se encontró la cita o no hubo cambios");
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

