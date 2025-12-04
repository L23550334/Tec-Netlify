<?php
// php/reporte_ingresos_get.php

ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    // Definimos los precios de los servicios aquí porque no están en una tabla separada.
    // Esto es una regla de negocio en el backend.
    $precios_servicios = [
        'Corte de Cabello' => 200,
        'Corte y Barba' => 350,
        'Afeitado Clásico' => 150,
        'Diseño de Barba' => 180,
        'Tratamiento Capilar' => 400
    ];

    // Construimos la parte CASE del SQL dinámicamente
    $case_sql = "";
    foreach ($precios_servicios as $nombre => $precio) {
        $case_sql .= " WHEN servicio = '" . $conn->real_escape_string($nombre) . "' THEN " . $precio;
    }

    // Consulta SQL para generar el reporte
    $sql = "SELECT 
                servicio,
                COUNT(id_cita) as citas_realizadas,
                SUM(CASE {$case_sql} ELSE 0 END) as ingresos_generados
            FROM citas
            WHERE estado = 'completada'
            GROUP BY servicio
            ORDER BY ingresos_generados DESC";

    $result = $conn->query($sql);

    $reporte = [];
    while($row = $result->fetch_assoc()) {
        $reporte[] = $row;
    }

    $conn->close();
    ob_end_clean();
    echo json_encode(['reporte' => $reporte]);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>