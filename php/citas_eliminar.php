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

    if (!isset($data['id_cita'])) {
        throw new Exception('ID de cita no proporcionado');
    }

    $id_cita = $data['id_cita'];

    // Eliminar la cita
    $sql = "DELETE FROM citas WHERE id_cita = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id_cita);

    if (!$stmt->execute()) {
        throw new Exception("Error al eliminar: " . $conn->error);
    }

    $stmt->close();
    $conn->close();
    
    ob_end_clean();
    echo json_encode([
        'success' => true, 
        'mensaje' => 'Cita eliminada correctamente'
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

