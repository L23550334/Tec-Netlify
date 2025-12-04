<?php
// php/citas_crear.php - Crear una nueva cita
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'conexion.php';

try {
    // Obtener datos JSON del body
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);

    // Validar datos requeridos
    if (!isset($datos['id_cliente']) || !isset($datos['id_barbero']) || 
        !isset($datos['fecha']) || !isset($datos['hora']) || !isset($datos['servicio'])) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Faltan datos requeridos'
        ]);
        exit;
    }

    $id_cliente = intval($datos['id_cliente']);
    $id_barbero = intval($datos['id_barbero']);
    $fecha = $datos['fecha'];
    $hora = $datos['hora'];
    $servicio = $datos['servicio'];

    // Crear fecha_hora combinando fecha y hora
    $fecha_hora = $fecha . ' ' . $hora . ':00';

    // Verificar que el horario no esté ocupado
    $stmt_check = $conn->prepare("SELECT id_cita FROM citas WHERE id_barbero = ? AND fecha_hora = ? AND estado != 'cancelada'");
    $stmt_check->bind_param("is", $id_barbero, $fecha_hora);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Este horario ya no está disponible. Por favor selecciona otro.'
        ]);
        exit;
    }

    // Insertar la cita
    $stmt = $conn->prepare("INSERT INTO citas (id_cliente, id_barbero, fecha_hora, servicio, estado) VALUES (?, ?, ?, ?, 'pendiente')");
    $stmt->bind_param("iiss", $id_cliente, $id_barbero, $fecha_hora, $servicio);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'mensaje' => 'Cita agendada exitosamente',
            'id_cita' => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Error al guardar la cita: ' . $stmt->error
        ]);
    }

    $stmt->close();
    $stmt_check->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error del servidor: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
