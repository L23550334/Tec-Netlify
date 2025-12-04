<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    // Log datos recibidos para debugging
    error_log("Datos recibidos: " . json_encode($data));
    
    if (!$data || !isset($data['id_usuario'])) {
        throw new Exception("ID de usuario requerido");
    }

    $id = intval($data['id_usuario']);
    $nombre = isset($data['nombre']) ? trim($data['nombre']) : null;
    $email = isset($data['email']) ? trim($data['email']) : null;
    $telefono = isset($data['telefono']) ? trim($data['telefono']) : null;
    $rol = isset($data['id_rol']) ? intval($data['id_rol']) : null;

    // Construir query dinámicamente
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
    if ($rol !== null && in_array($rol, [1, 2, 3])) {
        $updates[] = "id_rol = ?";
        $params[] = $rol;
        $types .= 'i';
    }

    if (empty($updates)) {
        throw new Exception("No hay campos válidos para actualizar");
    }

    // Agregar ID al final
    $params[] = $id;
    $types .= 'i';

    $sql = "UPDATE usuarios SET " . implode(", ", $updates) . " WHERE id_usuario = ?";
    
    error_log("SQL: $sql");
    error_log("Params: " . json_encode($params));
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
        } else {
            echo json_encode(['success' => true, 'message' => 'No se realizaron cambios']);
        }
    } else {
        throw new Exception("Error al ejecutar: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    error_log("Error en usuarios_actualizar.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
