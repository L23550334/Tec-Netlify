// JS/login.js

// ----- FUNCIÓN DE SANITIZACIÓN -----
/**
 * Sanitiza una cadena de texto para prevenir ataques XSS (Cross-Site Scripting).
 * Reemplaza los caracteres especiales de HTML con sus entidades correspondientes.
 * @param {string} str La cadena a sanitizar.
 * @returns {string} La cadena sanitizada.
 */
function sanitizeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({'&': '&amp;', '<': '&gt;', '"': '&quot;', "'": '&#039;'})[m]);
}

// 1. ESPERAR A QUE EL HTML CARGUE COMPLETO (Todo debe ir aquí adentro)
document.addEventListener('DOMContentLoaded', function() {

    // ===========================
    // 🟢 LÓGICA DE LOGIN
    // ===========================
    const loginForm = document.getElementById('form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorDiv = document.getElementById('login-error');

            if (!emailInput || !passwordInput) return;

            const email = sanitizeHTML(emailInput.value);
            const password = sanitizeHTML(passwordInput.value);

            if (email.trim() === '' || password.trim() === '') {
                errorDiv.textContent = "Por favor, completa todos los campos.";
                errorDiv.style.display = 'block';
                return;
            }

            const datos = { email: email, password: password };

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
                errorDiv.textContent = "Error de conexión.";
                errorDiv.style.display = 'block';
            });
        });
    }

    // ===========================
    // 🔵 LÓGICA DE REGISTRO 
    // ===========================
    const registerForm = document.getElementById('form-register');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = sanitizeHTML(document.getElementById('reg-nombre').value);
            const email = sanitizeHTML(document.getElementById('reg-email').value);
            const telefono = sanitizeHTML(document.getElementById('reg-telefono').value);
            const password = sanitizeHTML(document.getElementById('reg-password').value);
            const errorDiv = document.getElementById('register-error');

            if (password.length < 6) {
                errorDiv.textContent = "La contraseña debe tener al menos 6 caracteres.";
                errorDiv.style.display = 'block';
                return;
            }

            const datos = {
                nombre: nombre,
                email: email,
                telefono: telefono,
                password: password
            };

            fetch('php/registro.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                    registerForm.reset();
                    // Cambiar vista a Login
                    document.getElementById('show-login-view').click(); 
                    errorDiv.style.display = 'none';
                } else {
                    errorDiv.textContent = data.message;
                    errorDiv.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorDiv.textContent = "Error al intentar registrarse.";
                errorDiv.style.display = 'block';
            });
        });
    }

}); // <--- AQUÍ TERMINA EL DOMContentLoaded
