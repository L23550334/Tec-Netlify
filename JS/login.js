// JS/login.js

// 1. ESPERAR A QUE EL HTML CARGUE COMPLETO 
document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('form-login');

    // Verificamos si el formulario existe antes de usarlo
    if (loginForm) {
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita recarga

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorDiv = document.getElementById('login-error');

            // Verificamos que los inputs existan (por seguridad)
            if (!emailInput || !passwordInput) {
                console.error("No se encontraron los campos de email o password");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            // Validación simple
            if (email.trim() === '' || password.trim() === '') {
                errorDiv.textContent = "Por favor, completa todos los campos.";
                errorDiv.style.display = 'block';
                return;
            }

            const datos = {
                email: email,
                password: password
            };

            // Petición Fetch
            fetch('php/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("¡Bienvenido " + (data.nombre || '') + "!");
                    
                    if (data.rol == 1) {
                        window.location.href = 'html/admin-dashboard.html';
                    } else if (data.rol == 2) {
                        window.location.href = 'html/barbero-dashboard.html';
                    } else {
                        window.location.reload();
                    }
                } else {
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

    } else {
        console.error("El formulario 'form-login' no se encontró en el HTML. Revisa el ID.");
    }
});
