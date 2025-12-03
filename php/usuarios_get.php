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

    // Consulta SQL: Obtener todos los usuarios
    $sql = "SELECT id_usuario, nombre, email, telefono, rol FROM usuarios ORDER BY id_usuario DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $usuarios = [];
    while($row = $result->fetch_assoc()) {
        // Convertir rol a texto
        $rol_texto = '';
        switch($row['rol']) {
            case 1: $rol_texto = 'Admin'; break;
            case 2: $rol_texto = 'Barbero'; break;
            case 3: $rol_texto = 'Cliente'; break;
            default: $rol_texto = 'Desconocido';
        }
        $row['rol_texto'] = $rol_texto;
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

