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

    // Consulta para traer todos los productos
    $sql = "SELECT id_producto, nombre, descripcion, precio, stock, imagen_url FROM productos";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $productos = [];
    while($row = $result->fetch_assoc()) {
        // REGLA DE NEGOCIO: Asegurarse de que la ruta de la imagen sea correcta
        // para que el frontend la pueda encontrar desde la carpeta /html.
        if (!empty($row['imagen_url']) && strpos($row['imagen_url'], '../') !== 0) {
            $row['imagen_url'] = '../' . $row['imagen_url'];
        }
        $productos[] = $row;
    }

    $conn->close();
    
    ob_end_clean();
    echo json_encode($productos, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
