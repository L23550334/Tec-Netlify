// JS/login.js

<<<<<<< HEAD
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
=======
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
>>>>>>> 4556148552fe05caf7d416858403540cf03ca712

function validarTelefono(telefono) {
  const regex = /^[0-9]{10}$/
  return regex.test(telefono)
}

function validarNombre(nombre) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/
  return regex.test(nombre)
}

function validarPassword(password) {
  return password.length >= 6
}

function mostrarError(errorDiv, mensaje) {
  errorDiv.textContent = mensaje
  errorDiv.style.display = "block"
}

<<<<<<< HEAD
            const email = sanitizeHTML(emailInput.value);
            const password = sanitizeHTML(passwordInput.value);
=======
function ocultarError(errorDiv) {
  errorDiv.style.display = "none"
}
>>>>>>> 4556148552fe05caf7d416858403540cf03ca712

function guardarUsuarioLocal(data) {
  const usuario = {
    id_usuario: data.id_usuario,
    username: data.nombre, // Usamos "username" para compatibilidad con script.js
    nombre: data.nombre,
    email: data.email,
    rol: data.rol,
    role: data.rol == 1 ? "admin" : data.rol == 2 ? "barbero" : "cliente", // Agregamos role como string
  }
  localStorage.setItem("loggedInUser", JSON.stringify(usuario))
}

// 1. ESPERAR A QUE EL HTML CARGUE COMPLETO
document.addEventListener("DOMContentLoaded", () => {
  // ===========================
  // LÓGICA DE LOGIN
  // ===========================
  const loginForm = document.getElementById("form-login")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const emailInput = document.getElementById("email")
      const passwordInput = document.getElementById("password")
      const errorDiv = document.getElementById("login-error")

      if (!emailInput || !passwordInput) return

      const email = emailInput.value.trim()
      const password = passwordInput.value

      if (email === "" || password === "") {
        mostrarError(errorDiv, "Por favor, completa todos los campos.")
        return
      }

      if (!validarEmail(email)) {
        mostrarError(errorDiv, "Por favor, ingresa un correo electrónico válido.")
        return
      }

      if (!validarPassword(password)) {
        mostrarError(errorDiv, "La contraseña debe tener al menos 6 caracteres.")
        return
      }

      ocultarError(errorDiv)

      const datos = { email: email, password: password }

      fetch("php/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            guardarUsuarioLocal(data)

            const modal = document.getElementById("login-modal")
            if (modal) {
              modal.style.display = "none"
            }

            alert("¡Bienvenido " + (data.nombre || "") + "!")

<<<<<<< HEAD
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
=======
            if (data.rol == 1) {
              window.location.href = "html/admin-dashboard.html"
            } else if (data.rol == 2) {
              window.location.href = "html/barbero-dashboard.html"
            } else {
              const urlAnterior = document.referrer
              if (urlAnterior.includes("citas.html")) {
                window.location.href = "html/citas.html"
              } else {
                window.location.reload()
              }
>>>>>>> 4556148552fe05caf7d416858403540cf03ca712
            }
          } else {
            mostrarError(errorDiv, data.message)
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          mostrarError(errorDiv, "Error de conexión con el servidor.")
        })
    })
  }

  // ===========================
  // LÓGICA DE REGISTRO
  // ===========================
  const registerForm = document.getElementById("form-register")

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const nombre = document.getElementById("reg-nombre").value.trim()
      const email = document.getElementById("reg-email").value.trim()
      const telefono = document.getElementById("reg-telefono").value.trim()
      const password = document.getElementById("reg-password").value
      const errorDiv = document.getElementById("register-error")

      if (nombre === "" || email === "" || telefono === "" || password === "") {
        mostrarError(errorDiv, "Por favor, completa todos los campos.")
        return
      }

      if (!validarNombre(nombre)) {
        mostrarError(errorDiv, "El nombre solo debe contener letras (mínimo 3 caracteres).")
        return
      }

      if (!validarEmail(email)) {
        mostrarError(errorDiv, "Por favor, ingresa un correo electrónico válido.")
        return
      }

      if (!validarTelefono(telefono)) {
        mostrarError(errorDiv, "El teléfono debe tener exactamente 10 dígitos.")
        return
      }

      if (!validarPassword(password)) {
        mostrarError(errorDiv, "La contraseña debe tener al menos 6 caracteres.")
        return
      }

      ocultarError(errorDiv)

      const datos = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        password: password,
      }

      fetch("php/registro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.")
            registerForm.reset()
            document.getElementById("show-login-view").click()
            ocultarError(errorDiv)
          } else {
            mostrarError(errorDiv, data.message)
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          mostrarError(errorDiv, "Error al intentar registrarse.")
        })
    })
  }
})
