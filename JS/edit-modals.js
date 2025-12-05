// Edit Modal Functions for Admin Dashboard

let productosData = [] // Declare productosData variable
let citasData = [] // Declare citasData variable
let usuariosData = [] // Declare usuariosData variable

function cargarProductos() {
  // Function to load products data
  fetch("../php/productos_cargar.php")
    .then((res) => res.json())
    .then((data) => {
      productosData = data
      // Update the UI with products data
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

function cargarCitas() {
  // Function to load citas data
  fetch("../php/citas_cargar.php")
    .then((res) => res.json())
    .then((data) => {
      citasData = data
      // Update the UI with citas data
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

function cargarUsuarios() {
  // Function to load usuarios data
  fetch("../php/usuarios_cargar.php")
    .then((res) => res.json())
    .then((data) => {
      usuariosData = data
      // Update the UI with usuarios data
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

// PRODUCTOS MODAL
function abrirModalEditarProducto(id) {
  const producto = productosData.find((p) => p.id_producto == id)
  if (!producto) {
    alert("Producto no encontrado")
    return
  }

  document.getElementById("modal-edit-producto-id").value = producto.id_producto
  document.getElementById("modal-edit-producto-nombre").value = producto.nombre
  document.getElementById("modal-edit-producto-precio").value = producto.precio
  document.getElementById("modal-edit-producto-stock").value = producto.stock

  document.getElementById("modal-edit-producto").classList.add("visible")
  document.getElementById("modal-backdrop-producto").classList.add("visible")
}

function cerrarModalEditarProducto() {
  document.getElementById("modal-edit-producto").classList.remove("visible")
  document.getElementById("modal-backdrop-producto").classList.remove("visible")
}

function guardarProductoModal() {
  const id = document.getElementById("modal-edit-producto-id").value
  const nombre = document.getElementById("modal-edit-producto-nombre").value
  const precio = document.getElementById("modal-edit-producto-precio").value
  const stock = document.getElementById("modal-edit-producto-stock").value

  if (!nombre || !precio || stock === "") {
    alert("Por favor completa todos los campos")
    return
  }

  fetch("../php/productos_actualizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_producto: id,
      nombre: nombre,
      precio: Number.parseFloat(precio),
      stock: Number.parseInt(stock),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Producto actualizado correctamente")
        cerrarModalEditarProducto()
        cargarProductos()
      } else {
        alert("❌ Error: " + (data.mensaje || data.message || "No se pudo actualizar"))
      }
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

// CITAS MODAL
function abrirModalEditarCita(id) {
  const cita = citasData.find((c) => c.id_cita == id)
  if (!cita) {
    alert("Cita no encontrada")
    return
  }

  document.getElementById("modal-edit-cita-id").value = cita.id_cita
  document.getElementById("modal-edit-cita-cliente").value = cita.nombre_cliente || ""
  document.getElementById("modal-edit-cita-barbero").value = cita.id_barbero || ""
  document.getElementById("modal-edit-cita-fecha").value = cita.fecha || ""
  document.getElementById("modal-edit-cita-servicio").value = cita.servicio || ""
  document.getElementById("modal-edit-cita-estado").value = cita.estado || "pendiente"

  document.getElementById("modal-edit-cita").classList.add("visible")
  document.getElementById("modal-backdrop-cita").classList.add("visible")
}

function cerrarModalEditarCita() {
  document.getElementById("modal-edit-cita").classList.remove("visible")
  document.getElementById("modal-backdrop-cita").classList.remove("visible")
}

function guardarCitaModal() {
  const id = document.getElementById("modal-edit-cita-id").value
  const fecha = document.getElementById("modal-edit-cita-fecha").value
  const servicio = document.getElementById("modal-edit-cita-servicio").value
  const estado = document.getElementById("modal-edit-cita-estado").value
  const id_barbero = document.getElementById("modal-edit-cita-barbero").value

  if (!fecha || !servicio || !estado || !id_barbero) {
    alert("Por favor completa todos los campos")
    return
  }

  fetch("../php/citas_actualizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_cita: id,
      fecha: fecha,
      servicio: servicio,
      estado: estado,
      id_barbero: id_barbero,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Cita actualizada correctamente")
        cerrarModalEditarCita()
        cargarCitas()
      } else {
        alert("❌ Error: " + (data.mensaje || data.message || "No se pudo actualizar"))
      }
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

// USUARIOS MODAL
function abrirModalEditarUsuario(id) {
  const usuario = usuariosData.find((u) => u.id_usuario == id)
  if (!usuario) {
    alert("Usuario no encontrado")
    return
  }

  document.getElementById("modal-edit-usuario-id").value = usuario.id_usuario
  document.getElementById("modal-edit-usuario-nombre").value = usuario.nombre
  document.getElementById("modal-edit-usuario-email").value = usuario.email
  document.getElementById("modal-edit-usuario-telefono").value = usuario.telefono || ""
  document.getElementById("modal-edit-usuario-rol").value = usuario.id_rol || ""

  document.getElementById("modal-edit-usuario").classList.add("visible")
  document.getElementById("modal-backdrop-usuario").classList.add("visible")
}

function cerrarModalEditarUsuario() {
  document.getElementById("modal-edit-usuario").classList.remove("visible")
  document.getElementById("modal-backdrop-usuario").classList.remove("visible")
}

function guardarUsuarioModal() {
  const id = document.getElementById("modal-edit-usuario-id").value
  const nombre = document.getElementById("modal-edit-usuario-nombre").value
  const email = document.getElementById("modal-edit-usuario-email").value
  const telefono = document.getElementById("modal-edit-usuario-telefono").value
  const id_rol = document.getElementById("modal-edit-usuario-rol").value

  if (!nombre || !email || !id_rol) {
    alert("Por favor completa los campos requeridos")
    return
  }

  fetch("../php/usuarios_actualizar.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_usuario: id,
      nombre: nombre,
      email: email,
      telefono: telefono,
      id_rol: id_rol,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Usuario actualizado correctamente")
        cerrarModalEditarUsuario()
        cargarUsuarios()
      } else {
        alert("❌ Error: " + (data.mensaje || data.message || "No se pudo actualizar"))
      }
    })
    .catch((err) => {
      console.error("Error:", err)
      alert("Error de conexión: " + err.message)
    })
}

// Event listeners para cerrar modales al hacer clic fuera
document.addEventListener("click", (event) => {
  // Cerrar modal de producto
  const backdropProducto = document.getElementById("modal-backdrop-producto")
  if (event.target === backdropProducto) {
    cerrarModalEditarProducto()
  }

  // Cerrar modal de cita
  const backdropCita = document.getElementById("modal-backdrop-cita")
  if (event.target === backdropCita) {
    cerrarModalEditarCita()
  }

  // Cerrar modal de usuario
  const backdropUsuario = document.getElementById("modal-backdrop-usuario")
  if (event.target === backdropUsuario) {
    cerrarModalEditarUsuario()
  }
})

// Cerrar con tecla ESC
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cerrarModalEditarProducto()
    cerrarModalEditarCita()
    cerrarModalEditarUsuario()
  }
})

