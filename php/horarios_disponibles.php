<?php
// php/horarios_disponibles.php - Obtiene horarios disponibles para un barbero en una fecha

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'conexion.php';

// Verificar conexión
if (!$conn) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error de conexión a la base de datos'
    ]);
    exit;
}

// Obtener parámetros
$barbero_id = isset($_GET['barbero']) ? intval($_GET['barbero']) : 0;
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';

// Validar parámetros
if (!$barbero_id || !$fecha) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Parámetros inválidos: barbero y fecha son requeridos'
    ]);
    exit;
}

// Validar formato de fecha
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Formato de fecha inválido'
    ]);
    exit;
}

// Definir horarios de trabajo (9:00 AM a 7:00 PM, cada 30 minutos)
$horarios_base = [];
$hora_inicio = 9; // 9:00 AM
$hora_fin = 19;   // 7:00 PM

for ($h = $hora_inicio; $h < $hora_fin; $h++) {
    $horarios_base[] = sprintf('%02d:00', $h);
    $horarios_base[] = sprintf('%02d:30', $h);
}

// Obtener citas ya agendadas para ese barbero en esa fecha
$sql = "SELECT TIME_FORMAT(fecha_hora, '%H:%i') as hora_ocupada 
        FROM citas 
        WHERE id_barbero = ? 
        AND DATE(fecha_hora) = ? 
        AND estado != 'cancelada'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $barbero_id, $fecha);
$stmt->execute();
$result = $stmt->get_result();

$horas_ocupadas = [];
while ($row = $result->fetch_assoc()) {
    $horas_ocupadas[] = $row['hora_ocupada'];
}
$stmt->close();

// Filtrar horarios disponibles (quitar los ocupados)
$horarios_disponibles = array_filter($horarios_base, function($horario) use ($horas_ocupadas) {
    return !in_array($horario, $horas_ocupadas);
});

// Si es hoy, filtrar horarios que ya pasaron
$hoy = date('Y-m-d');
if ($fecha === $hoy) {
    $hora_actual = date('H:i');
    $horarios_disponibles = array_filter($horarios_disponibles, function($horario) use ($hora_actual) {
        return $horario > $hora_actual;
    });
}

// Reindexar array
$horarios_disponibles = array_values($horarios_disponibles);

echo json_encode([
    'success' => true,
    'horarios' => $horarios_disponibles
]);

$conn->close();
?>
