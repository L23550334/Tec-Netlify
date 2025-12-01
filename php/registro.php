<?php
// php/registro.php

// 1. Cabecera JSON (Requisito API REST)
header('Content-Type: application/json');
include 'conexion.php';

// 2. Recibir los datos crudos (JSON) desde JavaScript
$input = json_decode(file_get_contents('php://input'), true);

$nombre = $input['nombre'] ?? '';
$email = $input['email'] ?? '';
$telefono = $input['telefono'] ?? '';
$password = $input['password'] ?? '';

$response = [];

// Validación básica en Backend
if (empty($nombre) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// 3. Verificar si el correo ya existe
$checkEmail = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Este correo ya está registrado']);
    exit;
}
$checkEmail->close();

// 4. Encriptar contraseña y asignar Rol 3 (Cliente)
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$rol_cliente = 3; 

// 5. Insertar en la Base de Datos
$sql = "INSERT INTO usuarios (nombre, email, password, telefono, id_rol) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $nombre, $email, $password_hash, $telefono, $rol_cliente);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Usuario registrado correctamente';
} else {
    $response['success'] = false;
    $response['message'] = 'Error en la base de datos: ' . $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>