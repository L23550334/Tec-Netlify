// JS/login.js

// ----- FUNCIÓN DE SANITIZACIÓN -----
/**
 * Sanitiza una cadena de texto para prevenir ataques XSS (Cross-Site Scripting).
 * Reemplaza los caracteres especiales de HTML con sus entidades correspondientes.
 * @param {string} str La cadena a sanitizar.
 * @returns {string} La cadena sanitizada.
 */
function sanitizeHTML(str) {
  if (!str) return ""
  return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m])
}

// ----- FUNCIONES DE VALIDACIÓN -----
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

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

// ----- FUNCIONES AUXILIARES PARA ERRORES -----
function mostrarError(errorDiv, mensaje) {
  errorDiv.textContent = mensaje
  errorDiv.style.display = "block"
}

function ocultarError(errorDiv) {
  errorDiv.style.display = "none"
}

// ----- FUNCIÓN PARA GUARDAR USUARIO EN LOCALSTORAGE -----
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

      // Sanitizamos y luego validamos
      const email = sanitizeHTML(emailInput.value.trim())
      const password = sanitizeHTML(passwordInput.value)

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

      // Sanitizamos los valores antes de validarlos y usarlos
      const nombre = sanitizeHTML(document.getElementById("reg-nombre").value.trim())
      const email = sanitizeHTML(document.getElementById("reg-email").value.trim())
      const telefono = sanitizeHTML(document.getElementById("reg-telefono").value.trim())
      const password = sanitizeHTML(document.getElementById("reg-password").value)
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
