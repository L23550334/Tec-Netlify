// auth-guard.js - Protección de rutas para admin y barbero dashboards

/**
 * Verifica si hay una sesión válida y si el usuario tiene el rol requerido
 * @param {string|array} rolesPermitidos - 'admin', 'barbero', o array de roles
 */
function verificarAcceso(rolesPermitidos) {
  // Obtener datos del usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("loggedInUser") || "{}")

  // Si no hay usuario autenticado, redirigir al login
  if (!usuario.id_usuario) {
    alert("Debes iniciar sesión para acceder a esta página.")
    window.location.href = "../index.html"
    return false
  }

  // Convertir a array si es string
  const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos]

  // Verificar el rol del usuario
  let tieneAcceso = false

  roles.forEach((rol) => {
    if (rol === "admin" && (usuario.rol == 1 || usuario.role === "admin")) {
      tieneAcceso = true
    } else if (rol === "barbero" && (usuario.rol == 2 || usuario.role === "barbero")) {
      tieneAcceso = true
    } else if (rol === "cliente" && (usuario.rol == 3 || usuario.role === "cliente")) {
      tieneAcceso = true
    }
  })

  // Si no tiene el rol correcto, denegar acceso
  if (!tieneAcceso) {
    alert("No tienes permisos para acceder a esta página.")
    window.location.href = "../index.html"
    return false
  }

  return true
}

/**
 * Función para obtener los datos del usuario actual
 * @returns {object} Datos del usuario autenticado
 */
function obtenerUsuarioActual() {
  return JSON.parse(localStorage.getItem("loggedInUser") || "{}")
}

/**
 * Función para cerrar sesión
 */
function cerrarSesion() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("loggedInUser")
    window.location.href = "../index.html"
  }
}

// Exportar funciones para uso global
window.verificarAcceso = verificarAcceso
window.obtenerUsuarioActual = obtenerUsuarioActual
window.cerrarSesion = cerrarSesion
