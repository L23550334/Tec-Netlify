// JS/login.js

document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtenemos los valores de TU formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    // Validación simple
    if (email.trim() === '' || password.trim() === '') {
        errorDiv.textContent = "Por favor, completa todos los campos.";
        errorDiv.style.display = 'block';
        return;
    }

    // Preparamos los datos
    const datos = {
        email: email,
        password: password
    };

    // Petición Fetch a la API
    // CORRECCIÓN 1: Como estás en index.html, la ruta es directa a 'php/', sin los dos puntos '..'
    fetch('php/login.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Si el login es correcto
            alert("¡Bienvenido " + (data.nombre || '') + "!");
            
            // Redirección según rol
            if (data.rol == 1) {
                // Admin -> Va a la carpeta html
                window.location.href = 'html/admin-dashboard.html'; 
            } else if (data.rol == 2) {
                // Barbero -> Va a la carpeta html
                window.location.href = 'html/barbero-dashboard.html'; 
            } else {
                // Cliente -> Recarga la página actual (Index)
                window.location.reload(); 
            }
        } else {
            // Si hubo error
            errorDiv.textContent = data.message;
            errorDiv.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorDiv.textContent = "Error de conexión con el servidor.";
        errorDiv.style.display = 'block';
    });
});
