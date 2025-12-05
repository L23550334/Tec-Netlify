<?php
// php/citas_crear.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'conexion.php';

if (!$conn) {
    echo json_encode(['success' => false, 'mensaje' => 'Error de conexión a la base de datos.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// --- 1. Recibir y Validar Datos ---
$id_cliente = $input['id_cliente'] ?? null;
$id_barbero = $input['id_barbero'] ?? null;
$servicio = $input['servicio'] ?? null;
$fecha = $input['fecha'] ?? null;
$hora = $input['hora'] ?? null;

if (!$id_cliente || !$id_barbero || !$servicio || !$fecha || !$hora) {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos para crear la cita.']);
    exit;
}

if (strlen($hora) === 5) {
    $hora = $hora . ':00';
}
$fecha_hora = $fecha . ' ' . $hora;

// --- 2. REGLA DE NEGOCIO: Definir duración según el servicio ---
$duraciones = [
    'Corte de Cabello' => 30,
    'Corte y Barba' => 45,
    'Afeitado Clásico' => 20,
    'Diseño de Barba' => 25,
    'Tratamiento Capilar' => 40
];

$duracion_minutos = $duraciones[$servicio] ?? 30;

// --- 3. REGLA DE NEGOCIO: Verificar que no haya citas que se solapen ---
$nueva_cita_inicio = new DateTime($fecha_hora);
$nueva_cita_fin = (clone $nueva_cita_inicio)->add(new DateInterval("PT{$duracion_minutos}M"));

$sql_check = "SELECT fecha_hora, servicio FROM citas WHERE id_barbero = ? AND estado != 'cancelada' AND DATE(fecha_hora) = ?";
$stmt_check = $conn->prepare($sql_check);

if (!$stmt_check) {
    echo json_encode(['success' => false, 'mensaje' => 'Error en la consulta: ' . $conn->error]);
    exit;
}

$stmt_check->bind_param("is", $id_barbero, $fecha);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

while ($cita_existente = $result_check->fetch_assoc()) {
    $existente_inicio = new DateTime($cita_existente['fecha_hora']);
    $existente_servicio = $cita_existente['servicio'];
    $existente_duracion = $duraciones[$existente_servicio] ?? 30;
    $existente_fin = (clone $existente_inicio)->add(new DateInterval("PT{$existente_duracion}M"));

    // Lógica de solapamiento
    if ($nueva_cita_inicio < $existente_fin && $nueva_cita_fin > $existente_inicio) {
        echo json_encode(['success' => false, 'mensaje' => 'Lo sentimos, ese horario ya no está disponible. Por favor, selecciona otro.']);
        $stmt_check->close();
        $conn->close();
        exit;
    }
}
$stmt_check->close();

// --- 4. Si no hay conflictos, insertar la nueva cita ---
$estado_inicial = 'pendiente';
$sql_insert = "INSERT INTO citas (id_cliente, id_barbero, servicio, fecha_hora, estado) VALUES (?, ?, ?, ?, ?)";
$stmt_insert = $conn->prepare($sql_insert);

if (!$stmt_insert) {
    echo json_encode(['success' => false, 'mensaje' => 'Error preparando la consulta: ' . $conn->error]);
    exit;
}

$stmt_insert->bind_param("iisss", $id_cliente, $id_barbero, $servicio, $fecha_hora, $estado_inicial);

if ($stmt_insert->execute()) {
    echo json_encode(['success' => true, 'mensaje' => '¡Tu cita ha sido agendada con éxito!']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al guardar: ' . $stmt_insert->error]);
}

$stmt_insert->close();
$conn->close();

?>
