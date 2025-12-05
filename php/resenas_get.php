<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

// Solo obtener reseñas aprobadas, ordenadas por fecha (más recientes primero)
$sql = "SELECT id_resena, id_usuario, nombre_usuario, comentario, calificacion, fecha_creacion 
        FROM resenas 
        WHERE estado = 'aprobada' 
        ORDER BY fecha_creacion DESC 
        LIMIT 20";

$result = $conexion->query($sql);

if ($result) {
    $resenas = [];
    while ($row = $result->fetch_assoc()) {
        $resenas[] = [
            'id_resena' => $row['id_resena'],
            'id_usuario' => $row['id_usuario'],
            'nombre_usuario' => $row['nombre_usuario'],
            'comentario' => $row['comentario'],
            'calificacion' => intval($row['calificacion']),
            'fecha_creacion' => $row['fecha_creacion']
        ];
    }
    echo json_encode(['success' => true, 'resenas' => $resenas]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al obtener las reseñas']);
}

$conexion->close();
?>
