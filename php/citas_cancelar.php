<?php
// php/citas_cancelar.php - Cancelar una cita
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
    if (!isset($datos['id_cita'])) {
        echo json_encode([
            'success' => false,
            'mensaje' => 'id_cita es requerido'
        ]);
        exit;
    }

    $id_cita = intval($datos['id_cita']);

    // Actualizar estado de la cita a 'cancelada'
    $stmt = $conn->prepare("UPDATE citas SET estado = 'cancelada' WHERE id_cita = ?");
    $stmt->bind_param("i", $id_cita);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'mensaje' => 'Cita cancelada exitosamente'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'mensaje' => 'No se encontró la cita o ya fue cancelada'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Error al cancelar la cita: ' . $stmt->error
        ]);
    }

    $stmt->close();

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'mensaje' => 'Error del servidor: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
