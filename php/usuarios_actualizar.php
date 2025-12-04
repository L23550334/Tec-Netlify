<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id_usuario'])) {
        throw new Exception("ID de usuario requerido");
    }

    $id = intval($data['id_usuario']);
    $nombre = $data['nombre'] ?? null;
    $email = $data['email'] ?? null;
    $telefono = $data['telefono'] ?? null;
    $rol = $data['rol'] ?? null;

    $updates = [];
    $params = [];
    $types = '';

    if ($nombre) {
        $updates[] = "nombre = ?";
        $params[] = $nombre;
        $types .= 's';
    }
    if ($email) {
        $updates[] = "email = ?";
        $params[] = $email;
        $types .= 's';
    }
    if ($telefono) {
        $updates[] = "telefono = ?";
        $params[] = $telefono;
        $types .= 's';
    }
    if ($rol) {
        $updates[] = "rol = ?";
        $params[] = intval($rol);
        $types .= 'i';
    }

    if (empty($updates)) {
        throw new Exception("No hay campos para actualizar");
    }

    $params[] = $id;
    $types .= 'i';

    $sql = "UPDATE usuarios SET " . implode(", ", $updates) . " WHERE id_usuario = ?";
    
    if ($conn->prepare($sql)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            ob_end_clean();
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
        } else {
            throw new Exception("Error al actualizar: " . $stmt->error);
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
