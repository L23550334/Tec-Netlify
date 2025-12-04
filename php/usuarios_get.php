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

    $sql = "SELECT id_usuario, nombre, email, telefono, rol FROM usuarios ORDER BY id_usuario DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $usuarios = [];
    while($row = $result->fetch_assoc()) {
        $rol_map = [1 => 'Admin', 2 => 'Barbero', 3 => 'Cliente'];
        $row['rol_texto'] = $rol_map[$row['rol']] ?? 'N/A';
        $usuarios[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode($usuarios, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
