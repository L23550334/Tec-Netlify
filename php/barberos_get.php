<?php
// php/barberos_get.php - Obtener lista de barberos para el formulario de citas

ini_set('display_errors', 1);
error_reporting(E_ALL);

ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    include 'conexion.php';
    
    // Debug: Verificar si la conexión existe
    if ($conn === null) {
        throw new Exception("Conexión es NULL - Verifica usuario/contraseña en conexion.php");
    }
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    $sql = "SELECT id_usuario, nombre, email, telefono FROM usuarios WHERE id_rol = 2 ORDER BY nombre ASC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $barberos = [];
    while($row = $result->fetch_assoc()) {
        $barberos[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'barberos' => $barberos,
        'count' => count($barberos)
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'mensaje' => $e->getMessage(),
        'debug' => [
            'host' => getenv('DB_HOST') ?: 'mysql-354ac1c6-2',
            'port' => getenv('DB_PORT') ?: '13275',
            'user' => getenv('DB_USER') ?: 'root',
            'db' => getenv('DB_NAME') ?: 'defaultdb'
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
