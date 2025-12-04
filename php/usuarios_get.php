<?php
ob_start();
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    require_once 'conexion.php';
    
    if (!isset($conn) || !$conn) {
        throw new Exception("No se pudo establecer conexión con la base de datos");
    }
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }

    $sql = "SELECT id_usuario, nombre, email, telefono, id_rol FROM usuarios ORDER BY id_usuario DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $usuarios = [];
    while($row = $result->fetch_assoc()) {
        $rol_map = [1 => 'Admin', 2 => 'Barbero', 3 => 'Cliente'];
        $row['rol_texto'] = isset($rol_map[$row['id_rol']]) ? $rol_map[$row['id_rol']] : 'N/A';
        $usuarios[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode($usuarios, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
