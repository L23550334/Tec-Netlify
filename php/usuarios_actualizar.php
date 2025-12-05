<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido. Use PUT']);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    require_once 'conexion.php';
    
    if (!$conn) {
        throw new Exception("No hay conexión a la base de datos");
    }

    // Leer datos del request
    $input = file_get_contents('php://input');
    error_log("=== ACTUALIZAR USUARIO ===");
    error_log("Input recibido: " . $input);
    
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception("No se pudo decodificar el JSON");
    }

    // Validar ID
    if (!isset($data['id_usuario']) || empty($data['id_usuario'])) {
        throw new Exception("ID de usuario es requerido");
    }

    $id_usuario = intval($data['id_usuario']);
    $nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $telefono = isset($data['telefono']) ? trim($data['telefono']) : '';
    $id_rol = isset($data['id_rol']) ? intval($data['id_rol']) : 0;

    error_log("ID: $id_usuario, Nombre: $nombre, Email: $email, Telefono: $telefono, Rol: $id_rol");

    // Validaciones básicas
    if (empty($nombre)) {
        throw new Exception("El nombre es requerido");
    }
    
    if (empty($email)) {
        throw new Exception("El email es requerido");
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("El email no es válido");
    }
    
    if (!in_array($id_rol, [1, 2, 3])) {
        throw new Exception("El rol debe ser 1, 2 o 3");
    }

    // Preparar consulta SQL
    $sql = "UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, id_rol = ? WHERE id_usuario = ?";
    
    error_log("SQL: $sql");
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error al preparar consulta: " . $conn->error);
    }
    
    $stmt->bind_param("sssii", $nombre, $email, $telefono, $id_rol, $id_usuario);
    
    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar consulta: " . $stmt->error);
    }
    
    $affected_rows = $stmt->affected_rows;
    error_log("Filas afectadas: $affected_rows");
    
    $stmt->close();
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Usuario actualizado correctamente',
        'affected_rows' => $affected_rows
    ]);
    
} catch (Exception $e) {
    error_log("ERROR: " . $e->getMessage());
    error_log("Trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

