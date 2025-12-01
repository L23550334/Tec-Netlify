<?php
// php/crear_personal.php
include 'conexion.php';

// 1. Definimos la lista de personal que queremos crear
$personal = [
    // El ADMINISTRADOR (Rol 1)
    [
        'nombre' => 'El Patrón (Admin)',
        'email' => 'admin@barber.com',
        'telefono' => '555-000-0001',
        'rol' => 1
    ],
    // Los 5 BARBEROS (Rol 2)
    [ 'nombre' => 'Barbero Christian', 'email' => 'chris@barber.com', 'telefono' => '555-111-1111', 'rol' => 2 ],
    [ 'nombre' => 'Barbero Moroni', 'email' => 'moroni@barber.com', 'telefono' => '555-222-2222', 'rol' => 2 ],
    [ 'nombre' => 'Barbero Luis', 'email' => 'luis@barber.com', 'telefono' => '555-333-3333', 'rol' => 2 ],
    [ 'nombre' => 'Barbero Angel', 'email' => 'angel@barber.com', 'telefono' => '555-444-4444', 'rol' => 2 ],
    [ 'nombre' => 'Barbero Sergio', 'email' => 'sergio@barber.com', 'telefono' => '555-555-5555', 'rol' => 2 ]
];

// Contraseña genérica para todos
$password_plana = "123456";
$password_encriptada = password_hash($password_plana, PASSWORD_DEFAULT);

echo "<h1>Generando Personal...</h1>";

// 2. Recorremos la lista e insertamos en la BD
$sql = "INSERT INTO usuarios (nombre, email, password, telefono, id_rol) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

foreach ($personal as $persona) {
    // Verificamos si ya existe el correo para no duplicar
    $check = $conn->query("SELECT id_usuario FROM usuarios WHERE email = '" . $persona['email'] . "'");
    
    if ($check->num_rows == 0) {
        $stmt->bind_param("ssssi", 
            $persona['nombre'], 
            $persona['email'], 
            $password_encriptada, 
            $persona['telefono'], 
            $persona['rol']
        );
        
        if ($stmt->execute()) {
            echo "<p style='color: green;'>✅ Creado: " . $persona['nombre'] . " (" . $persona['email'] . ")</p>";
        } else {
            echo "<p style='color: red;'>❌ Error creando " . $persona['nombre'] . ": " . $stmt->error . "</p>";
        }
    } else {
        echo "<p style='color: orange;'>⚠️ Ya existe: " . $persona['nombre'] . "</p>";
    }
}

$stmt->close();
$conn->close();

echo "<br><hr><h3>¡Listo! Ahora puedes probar el Login.</h3>";
echo "<p>Contraseña para todos: <strong>123456</strong></p>";
?>