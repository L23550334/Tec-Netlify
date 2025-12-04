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
        // REGLA DE NEGOCIO: Asegurarse de que la ruta de la imagen sea absoluta desde la raíz del sitio.
        if (!empty($row['imagen_url'])) {
            // Limpiar cualquier prefijo relativo o absoluto incorrecto
            $cleaned_path = ltrim($row['imagen_url'], './'); // Eliminar './'
            $cleaned_path = str_replace('../', '', $cleaned_path); // Eliminar '../'
            // Asegurarse de que la ruta comience con '/img/'
            if (strpos($cleaned_path, 'img/') !== 0) {
                $cleaned_path = 'img/' . $cleaned_path;
            }
            $row['imagen_url'] = '/' . $cleaned_path; // Hacerla absoluta desde la raíz
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
