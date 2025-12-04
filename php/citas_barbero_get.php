<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit(0);
}

try {
    include 'conexion.php';
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos");
    }

    session_start();

    $id_barbero = null;
    
    // 1. Primero intentar desde la sesión PHP
    if (isset($_SESSION['usuario_id'])) {
        $id_barbero = $_SESSION['usuario_id'];
    }
    
    // 2. Si no hay sesión, intentar desde GET parameter
    if (!$id_barbero && isset($_GET['id_barbero'])) {
        $id_barbero = intval($_GET['id_barbero']);
    }
    
    // 3. Si no hay sesión, intentar desde POST body
    if (!$id_barbero) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['id_barbero'])) {
            $id_barbero = intval($input['id_barbero']);
        }
    }

    // Si aún no hay id_barbero, devolver todas las citas (para pruebas)
    if (!$id_barbero) {
        $sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, 
                       u.nombre as cliente_nombre, u.telefono,
                       b.nombre as barbero_nombre
                FROM citas c
                JOIN usuarios u ON c.id_cliente = u.id_usuario
                JOIN usuarios b ON c.id_barbero = b.id_usuario
                ORDER BY c.fecha_hora DESC";
        
        $result = $conn->query($sql);
        
        if (!$result) {
            throw new Exception("Error en la consulta: " . $conn->error);
        }
        
        $citas = [];
        while($row = $result->fetch_assoc()) {
            $citas[] = $row;
        }
        
        $conn->close();
        ob_end_clean();
        echo json_encode($citas, JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Consulta para el barbero específico
    $sql = "SELECT c.id_cita, c.fecha_hora, c.servicio, c.estado, 
                   u.nombre as cliente_nombre, u.telefono
            FROM citas c
            JOIN usuarios u ON c.id_cliente = u.id_usuario
            WHERE c.id_barbero = ? 
            ORDER BY c.fecha_hora DESC";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id_barbero);
    $stmt->execute();
    $result = $stmt->get_result();

    $citas = [];
    while($row = $result->fetch_assoc()) {
        $citas[] = $row;
    }

    $stmt->close();
    $conn->close();
    
    ob_end_clean();
    echo json_encode($citas, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
