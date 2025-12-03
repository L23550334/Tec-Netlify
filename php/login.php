<?php
// php/login.php

// 1. Configuramos para que sea una API JSON
header('Content-Type: application/json');

include 'conexion.php';

// Iniciamos sesión para guardar datos si el login es correcto
session_start();

// Leemos los datos que nos manda el Fetch (JavaScript)
$input = json_decode(file_get_contents('php://input'), true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$response = [];

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit;
}

// 2. Buscamos al usuario en la BD
$sql = "SELECT id_usuario, nombre, email, password, id_rol FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // 3. Verificamos la contraseña encriptada
    if (password_verify($password, $row['password'])) {
        
        // ¡LOGIN EXITOSO!
        $_SESSION['usuario_id'] = $row['id_usuario'];
        $_SESSION['nombre'] = $row['nombre'];
        $_SESSION['rol'] = $row['id_rol'];

        $response['success'] = true;
        $response['message'] = 'Login correcto';
        
        $response['id_usuario'] = $row['id_usuario'];
        $response['nombre'] = $row['nombre'];
        $response['email'] = $row['email'];
        $response['rol'] = $row['id_rol'];
        
    } else {
        // Contraseña incorrecta
        $response['success'] = false;
        $response['message'] = 'Contraseña incorrecta';
    }
} else {
    // Usuario no existe
    $response['success'] = false;
    $response['message'] = 'Usuario no encontrado';
}

$stmt->close();
$conn->close();

// Devolvemos la respuesta en formato JSON
echo json_encode($response);
?>
