<?php
// php/reporte_citas_get.php - Reportes generales de citas

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

include 'conexion.php';

if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Estadísticas generales de citas
    $estadisticas = [];
    
    // Total de citas por estado
    $sql_estados = "SELECT estado, COUNT(*) as cantidad 
                    FROM citas 
                    GROUP BY estado 
                    ORDER BY cantidad DESC";
    $result_estados = $conn->query($sql_estados);
    
    if (!$result_estados) {
        throw new Exception("Error al consultar estados: " . $conn->error);
    }
    
    $por_estado = [];
    while($row = $result_estados->fetch_assoc()) {
        $por_estado[] = $row;
    }
    $estadisticas['por_estado'] = $por_estado;
    
    // Citas por barbero
    $sql_barberos = "SELECT u.nombre as barbero, COUNT(c.id_cita) as total_citas,
                     SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) as completadas
                     FROM citas c
                     JOIN usuarios u ON c.id_barbero = u.id_usuario
                     GROUP BY c.id_barbero, u.nombre
                     ORDER BY total_citas DESC";
    $result_barberos = $conn->query($sql_barberos);
    
    if (!$result_barberos) {
        throw new Exception("Error al consultar barberos: " . $conn->error);
    }
    
    $por_barbero = [];
    while($row = $result_barberos->fetch_assoc()) {
        $por_barbero[] = $row;
    }
    $estadisticas['por_barbero'] = $por_barbero;
    
    // Citas por mes (últimos 6 meses)
    $sql_meses = "SELECT 
                    DATE_FORMAT(fecha_hora, '%Y-%m') as mes,
                    COUNT(*) as total_citas,
                    SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas
                  FROM citas
                  WHERE fecha_hora >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                  GROUP BY mes
                  ORDER BY mes DESC";
    $result_meses = $conn->query($sql_meses);
    
    if (!$result_meses) {
        throw new Exception("Error al consultar meses: " . $conn->error);
    }
    
    $por_mes = [];
    while($row = $result_meses->fetch_assoc()) {
        $por_mes[] = $row;
    }
    $estadisticas['por_mes'] = $por_mes;
    
    // Total general
    $sql_total = "SELECT COUNT(*) as total FROM citas";
    $result_total = $conn->query($sql_total);
    
    if (!$result_total) {
        throw new Exception("Error al consultar total: " . $conn->error);
    }
    
    $total_general = $result_total->fetch_assoc();
    $estadisticas['total_general'] = $total_general['total'];

    $conn->close();
    echo json_encode(['estadisticas' => $estadisticas], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    $conn->close();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
