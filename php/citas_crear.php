<?php
// php/citas_crear.php

header('Content-Type: application/json');
include 'conexion.php';
session_start();

$input = json_decode(file_get_contents('php://input'), true);

// --- 1. Recibir y Validar Datos ---
$id_cliente = $_SESSION['usuario_id'] ?? null;
$id_barbero = $input['id_barbero'] ?? null;
$servicio = $input['servicio'] ?? null;
$fecha_hora = $input['fecha_hora'] ?? null;

if (!$id_cliente || !$id_barbero || !$servicio || !$fecha_hora) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos para crear la cita.']);
    exit;
}

// --- 2. REGLA DE NEGOCIO: Definir duración según el servicio ---
$duraciones = [
    'Corte de Cabello' => 30,
    'Corte y Barba' => 45,
    'Afeitado Clásico' => 20,
    'Diseño de Barba' => 25,
    'Tratamiento Capilar' => 40
];

$duracion_minutos = $duraciones[$servicio] ?? 30; // 30 min por defecto si el servicio no se encuentra

// --- 3. REGLA DE NEGOCIO: Verificar que no haya citas que se solapen ---
// Calculamos la hora de inicio y fin de la nueva cita
$nueva_cita_inicio = new DateTime($fecha_hora);
$nueva_cita_fin = (new DateTime($fecha_hora))->add(new DateInterval("PT{$duracion_minutos}M"));

// Preparamos la consulta para buscar conflictos
$sql_check = "SELECT fecha_hora, duracion_minutos FROM citas WHERE id_barbero = ? AND estado != 'cancelada'";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("i", $id_barbero);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

while ($cita_existente = $result_check->fetch_assoc()) {
    $existente_inicio = new DateTime($cita_existente['fecha_hora']);
    $existente_duracion = $cita_existente['duracion_minutos'] ?? 30; // Usar 30 si es nulo
    $existente_fin = (new DateTime($cita_existente['fecha_hora']))->add(new DateInterval("PT{$existente_duracion}M"));

    // Lógica de solapamiento: (Inicio1 < Fin2) y (Fin1 > Inicio2)
    if ($nueva_cita_inicio < $existente_fin && $nueva_cita_fin > $existente_inicio) {
        // ¡Conflicto encontrado!
        echo json_encode(['success' => false, 'message' => 'Lo sentimos, ese horario ya no está disponible. Por favor, selecciona otro.']);
        $stmt_check->close();
        $conn->close();
        exit;
    }
}
$stmt_check->close();

// --- 4. Si no hay conflictos, insertar la nueva cita ---
$estado_inicial = 'pendiente';
$sql_insert = "INSERT INTO citas (id_cliente, id_barbero, servicio, fecha_hora, estado, duracion_minutos) VALUES (?, ?, ?, ?, ?, ?)";
$stmt_insert = $conn->prepare($sql_insert);
$stmt_insert->bind_param("iisssi", $id_cliente, $id_barbero, $servicio, $fecha_hora, $estado_inicial, $duracion_minutos);

if ($stmt_insert->execute()) {
    echo json_encode(['success' => true, 'message' => '¡Tu cita ha sido agendada con éxito!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar la cita en la base de datos.']);
}

$stmt_insert->close();
$conn->close();

?>