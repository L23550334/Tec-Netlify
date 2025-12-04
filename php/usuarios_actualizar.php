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
    
    error_log("[v0] Datos recibidos: " . print_r($data, true));
    
    if (!$data || !isset($data['id_usuario'])) {
        throw new Exception("ID de usuario requerido");
    }

    $id = intval($data['id_usuario']);
    $nombre = $data['nombre'] ?? null;
    $email = $data['email'] ?? null;
    $telefono = $data['telefono'] ?? null;
    $rol = isset($data['id_rol']) ? intval($data['id_rol']) : null;

    $updates = [];
    $params = [];
    $types = '';

    if ($nombre !== null && $nombre !== '') {
        $updates[] = "nombre = ?";
        $params[] = $nombre;
        $types .= 's';
    }
    if ($email !== null && $email !== '') {
        $updates[] = "email = ?";
        $params[] = $email;
        $types .= 's';
    }
    if ($telefono !== null && $telefono !== '') {
        $updates[] = "telefono = ?";
        $params[] = $telefono;
        $types .= 's';
    }
    if ($rol !== null) {
        $updates[] = "id_rol = ?";
        $params[] = $rol;
        $types .= 'i';
    }

    if (empty($updates)) {
        throw new Exception("No hay campos para actualizar");
    }

    $params[] = $id;
    $types .= 'i';

    $sql = "UPDATE usuarios SET " . implode(", ", $updates) . " WHERE id_usuario = ?";
    
    error_log("[v0] SQL: $sql");
    error_log("[v0] Params: " . print_r($params, true));
    error_log("[v0] Types: $types");
    
    if ($conn->prepare($sql)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                ob_end_clean();
                echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
            } else {
                ob_end_clean();
                echo json_encode(['success' => true, 'message' => 'No se realizaron cambios (datos idénticos)']);
            }
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
    error_log("[v0] Error en usuarios_actualizar.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
