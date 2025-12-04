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

    if (!isset($_GET['id_rol']) || empty($_GET['id_rol'])) {
        throw new Exception("id_rol no proporcionado");
    }

    $id_rol = intval($_GET['id_rol']);
    
    $sql = "SELECT id_usuario, nombre, email, telefono, id_rol FROM usuarios WHERE id_rol = ? ORDER BY id_usuario DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_rol);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $usuarios = [];
    while($row = $result->fetch_assoc()) {
        $rol_map = [1 => 'Admin', 2 => 'Barbero', 3 => 'Cliente'];
        $row['rol_texto'] = $rol_map[$row['id_rol']] ?? 'N/A';
        $usuarios[] = $row;
    }

    $stmt->close();
    $conn->close();
    
    ob_end_clean();
    echo json_encode($usuarios, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
