// JS/edit-modals.js - Funcionalidad de modales para editar usuarios, citas y productos

// Variables declaration
const productosData = []
const cargarProductos = () => {}
const citasData = []
const cargarCitas = () => {}
const usuariosData = []
const cargarUsuarios = () => {}

/**
 * Abre un modal
 * @param {string} modalId - ID del modal a abrir
 */
function abrirModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "flex"
    // Evitar scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden"
  }
}

/**
 * Cierra un modal
 * @param {string} modalId - ID del modal a cerrar
 */
function cerrarModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    // Restaurar scroll del body
    document.body.style.overflow = "auto"
  }
}

/**
 * Cierra el modal al hacer clic en el overlay
 */
document.addEventListener("DOMContentLoaded", () => {
  // Cerrar modales al hacer clic en el overlay
  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  })

  // Cerrar modales con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay").forEach((modal) => {
        if (modal.style.display === "flex") {
          modal.style.display = "none"
          document.body.style.overflow = "auto"
        }
      })
    }
  })
})

// ===== FUNCIONES PARA EDITAR PRODUCTO =====

/**
 * Abre el modal para editar un producto
 * @param {number} id - ID del producto
 */
function editarProductoModal(id) {
  const producto = productosData.find((p) => p.id_producto == id)
  if (!producto) {
    alert("Producto no encontrado")
    return
  }

  document.getElementById("productId").value = id
  document.getElementById("productNombre").value = producto.nombre
  document.getElementById("productPrecio").value = producto.precio
  document.getElementById("productStock").value = producto.stock
  document.getElementById("productDescripcion").value = producto.descripcion || ""

  abrirModal("modalEditarProducto")
}

/**
 * Guarda los cambios del producto
 */
function guardarProductoEdicion(event) {
  event.preventDefault()

  const id = document.getElementById("productId").value
  const nombre = document.getElementById("productNombre").value
  const precio = Number.parseFloat(document.getElementById("productPrecio").value)
  const stock = Number.parseInt(document.getElementById("productStock").value)
  const descripcion = document.getElementById("productDescripcion").value

  // Validaciones
  if (!nombre.trim()) {
    alert("El nombre del producto es obligatorio")
    return
  }

  if (precio <= 0) {
    alert("El precio debe ser mayor a 0")
    return
  }

  if (stock < 0) {
    alert("El stock no puede ser negativo")
    return
  }

  console.log("[v0] Actualizando producto:", id)
  fetch("../php/productos_actualizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_producto: id,
      nombre: nombre,
      precio: precio,
      stock: stock,
      descripcion: descripcion,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error HTTP: " + res.status)
      return res.json()
    })
    .then((data) => {
      console.log("[v0] Respuesta de actualización:", data)
      if (data.success) {
        alert("✅ Producto actualizado correctamente")
        cerrarModal("modalEditarProducto")
        cargarProductos()
      } else {
        alert("❌ Error: " + (data.mensaje || "Error desconocido"))
      }
    })
    .catch((err) => {
      console.error("[v0] Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

// ===== FUNCIONES PARA EDITAR CITA =====

/**
 * Abre el modal para editar una cita
 * @param {number} id - ID de la cita
 */
function editarCitaModal(id) {
  const cita = citasData.find((c) => c.id_cita == id)
  if (!cita) {
    alert("Cita no encontrada")
    return
  }

  document.getElementById("citaId").value = id
  document.getElementById("citaEstado").value = cita.estado || ""
  document.getElementById("citaCliente").value = cita.cliente_nombre || "N/A"
  document.getElementById("citaBarbero").value = cita.barbero_nombre || "N/A"
  document.getElementById("citaFecha").value = cita.fecha || ""
  document.getElementById("citaHora").value = cita.hora || ""

  abrirModal("modalEditarCita")
}

/**
 * Guarda los cambios de la cita
 */
function guardarCitaEdicion(event) {
  event.preventDefault()

  const id = document.getElementById("citaId").value
  const estado = document.getElementById("citaEstado").value

  if (!estado) {
    alert("Debe seleccionar un estado")
    return
  }

  if (!["pendiente", "completada", "cancelada"].includes(estado.toLowerCase())) {
    alert("Estado inválido")
    return
  }

  console.log("[v0] Actualizando cita:", id)
  fetch("../php/citas_actualizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_cita: id,
      estado: estado.toLowerCase(),
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error HTTP: " + res.status)
      return res.json()
    })
    .then((data) => {
      console.log("[v0] Respuesta de actualización:", data)
      if (data.success) {
        alert("✅ Cita actualizada correctamente")
        cerrarModal("modalEditarCita")
        cargarCitas()
      } else {
        alert("❌ Error: " + (data.mensaje || "Error desconocido"))
      }
    })
    .catch((err) => {
      console.error("[v0] Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

// ===== FUNCIONES PARA EDITAR USUARIO =====

/**
 * Abre el modal para editar un usuario
 * @param {number} id - ID del usuario
 */
function editarUsuarioModal(id) {
  const usuario = usuariosData.find((u) => u.id_usuario == id)
  if (!usuario) {
    alert("Usuario no encontrado")
    return
  }

  document.getElementById("usuarioId").value = id
  document.getElementById("usuarioNombre").value = usuario.nombre
  document.getElementById("usuarioEmail").value = usuario.email
  document.getElementById("usuarioTelefono").value = usuario.telefono || ""
  document.getElementById("usuarioRol").value = usuario.id_rol || ""

  abrirModal("modalEditarUsuario")
}

/**
 * Guarda los cambios del usuario
 */
function guardarUsuarioEdicion(event) {
  event.preventDefault()

  const id = document.getElementById("usuarioId").value
  const nombre = document.getElementById("usuarioNombre").value
  const email = document.getElementById("usuarioEmail").value
  const telefono = document.getElementById("usuarioTelefono").value
  const rol = Number.parseInt(document.getElementById("usuarioRol").value)

  // Validaciones
  if (!nombre.trim()) {
    alert("El nombre es obligatorio")
    return
  }

  if (!email.trim()) {
    alert("El email es obligatorio")
    return
  }

  if (![1, 2, 3].includes(rol)) {
    alert("Debe seleccionar un rol válido")
    return
  }

  console.log("[v0] Actualizando usuario:", id)
  fetch("../php/usuarios_actualizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_usuario: id,
      nombre: nombre,
      email: email,
      telefono: telefono,
      id_rol: rol,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error HTTP: " + res.status)
      return res.json()
    })
    .then((data) => {
      console.log("[v0] Respuesta de actualización:", data)
      if (data.success) {
        alert("✅ Usuario actualizado correctamente")
        cerrarModal("modalEditarUsuario")
        cargarUsuarios()
      } else {
        alert("❌ Error: " + (data.mensaje || "Error desconocido"))
      }
    })
    .catch((err) => {
      console.error("[v0] Error:", err)
      alert("Error de conexión: " + err.message)
    })
}
