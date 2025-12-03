<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Obtener solo usuarios con rol de cliente (rol = 3)
    $sql = "SELECT id_usuario, nombre, email, telefono FROM usuarios WHERE rol = 3 ORDER BY nombre ASC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $clientes = [];
    while($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
