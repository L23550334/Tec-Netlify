<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
include 'conexion.php';

// Consulta SQL: Obtener todos los usuarios
$sql = "SELECT id_usuario, nombre, email, telefono, rol FROM usuarios ORDER BY id_usuario DESC";
$result = $conn->query($sql);

$usuarios = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        // Convertir rol a texto
        $rol_texto = '';
        switch($row['rol']) {
            case 1: $rol_texto = 'Admin'; break;
            case 2: $rol_texto = 'Barbero'; break;
            case 3: $rol_texto = 'Cliente'; break;
            default: $rol_texto = 'Desconocido';
        }
        $row['rol_texto'] = $rol_texto;
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);
$conn->close();
?>
