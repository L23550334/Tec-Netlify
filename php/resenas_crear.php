<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'conexion.php';

if (!$conn) {
    echo json_encode(['success' => false, 'mensaje' => 'Error de conexión a la base de datos']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Validar datos requeridos
$id_usuario = isset($input['id_usuario']) ? intval($input['id_usuario']) : null;
$nombre_usuario = isset($input['nombre_usuario']) ? trim($input['nombre_usuario']) : null;
$comentario = isset($input['comentario']) ? trim($input['comentario']) : null;
$calificacion = isset($input['calificacion']) ? intval($input['calificacion']) : null;

if (!$id_usuario || !$nombre_usuario || !$comentario || !$calificacion) {
    echo json_encode(['success' => false, 'mensaje' => 'Todos los campos son requeridos']);
    exit;
}

// Validar calificación entre 1 y 5
if ($calificacion < 1 || $calificacion > 5) {
    echo json_encode(['success' => false, 'mensaje' => 'La calificación debe ser entre 1 y 5']);
    exit;
}

// Sanitizar datos
$nombre_usuario = htmlspecialchars($nombre_usuario, ENT_QUOTES, 'UTF-8');
$comentario = htmlspecialchars($comentario, ENT_QUOTES, 'UTF-8');

$stmt_user = $conn->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = ?");
$stmt_user->bind_param("i", $id_usuario);
$stmt_user->execute();
$result_user = $stmt_user->get_result();

if ($result_user->num_rows === 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Usuario no encontrado']);
    exit;
}
$stmt_user->close();

$stmt = $conn->prepare("INSERT INTO resenas (id_usuario, nombre_usuario, comentario, calificacion) VALUES (?, ?, ?, ?)");
$stmt->bind_param("issi", $id_usuario, $nombre_usuario, $comentario, $calificacion);

if ($stmt->execute()) {
    $id_resena = $stmt->insert_id;
    echo json_encode([
        'success' => true, 
        'mensaje' => 'Reseña publicada exitosamente',
        'resena' => [
            'id_resena' => $id_resena,
            'nombre_usuario' => $nombre_usuario,
            'comentario' => $comentario,
            'calificacion' => $calificacion,
            'fecha_creacion' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al guardar la reseña: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
