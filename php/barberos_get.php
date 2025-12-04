<?php
// php/barberos_get.php - Obtener lista de barberos para el formulario de citas

ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    include 'conexion.php';
    
    if (!$conn || $conn->connect_error) {
        throw new Exception("Error de conexión a la base de datos. Verifica que MySQL esté corriendo y las credenciales sean correctas. Host: " . (getenv('DB_HOST') ?: 'localhost'));
    }

    // Obtener solo usuarios con rol de barbero (rol = 2)
    $sql = "SELECT id_usuario, nombre, email, telefono FROM usuarios WHERE rol = 2 ORDER BY nombre ASC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error . ". Verifica que la tabla 'usuarios' exista.");
    }

    $barberos = [];
    while($row = $result->fetch_assoc()) {
        $barberos[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'barberos' => $barberos
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
