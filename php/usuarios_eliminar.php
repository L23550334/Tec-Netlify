<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    $method = $_SERVER['REQUEST_METHOD'];
    if ($method !== 'POST' && $method !== 'DELETE') {
        throw new Exception("Método no permitido. Use POST o DELETE");
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id_usuario'])) {
        throw new Exception("ID de usuario requerido");
    }

    $id = intval($data['id_usuario']);

    $sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    
    if ($conn->prepare($sql)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                ob_end_clean();
                echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente']);
            } else {
                throw new Exception("Usuario no encontrado");
            }
        } else {
            throw new Exception("Error al eliminar: " . $stmt->error);
        }
        $stmt->close();
    } else {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $conn->close();
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>

