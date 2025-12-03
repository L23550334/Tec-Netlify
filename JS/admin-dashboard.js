// JS/admin-dashboard.js - Funcionalidad completa para el dashboard del admin

// Declare variables before using them
const productosData = [] // This should be populated with actual product data
function cargarCitas() {
  // Function to load appointments data
  console.log("Cargando citas...")
}

function cargarProductos() {
  // Function to load products data
  console.log("Cargando productos...")
}

function actualizarEstado(idCita, nuevoEstado) {
  if (!confirm(`¿Confirmar cambio de estado a "${nuevoEstado}"?`)) {
    return
  }

  fetch("../php/citas_actualizar.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_cita: idCita,
      estado: nuevoEstado,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Estado actualizado correctamente")
        // Recargar la tabla de citas
        cargarCitas()
      } else {
        alert("❌ Error: " + data.mensaje)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error de conexión")
    })
}

function eliminarCitaDirecto(idCita) {
  if (!confirm("¿Estás seguro de eliminar esta cita? Esta acción no se puede deshacer.")) {
    return
  }

  fetch("../php/citas_eliminar.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_cita: idCita,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("🗑️ Cita eliminada correctamente")
        cargarCitas()
      } else {
        alert("❌ Error: " + data.mensaje)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error de conexión")
    })
}

function editarProductoDirecto(id) {
  const producto = productosData.find((p) => p.id_producto == id)
  if (!producto) {
    alert("Producto no encontrado")
    return
  }

  const nuevoNombre = prompt("Nuevo nombre:", producto.nombre)
  if (!nuevoNombre) return

  const nuevoPrecio = prompt("Nuevo precio:", producto.precio)
  if (!nuevoPrecio) return

  const nuevoStock = prompt("Nuevo stock:", producto.stock)
  if (!nuevoStock) return

  const nuevaDescripcion = prompt("Nueva descripción:", producto.descripcion || "")

  // Validaciones del lado del cliente
  if (Number.parseFloat(nuevoPrecio) <= 0) {
    alert("❌ El precio debe ser mayor a 0")
    return
  }

  if (Number.parseInt(nuevoStock) < 0) {
    alert("❌ El stock no puede ser negativo")
    return
  }

  fetch("../php/productos_actualizar.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_producto: id,
      nombre: nuevoNombre,
      precio: Number.parseFloat(nuevoPrecio),
      stock: Number.parseInt(nuevoStock),
      descripcion: nuevaDescripcion,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Producto actualizado correctamente")
        cargarProductos()
      } else {
        alert("❌ Error: " + data.mensaje)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error de conexión")
    })
}

function eliminarProductoDirecto(id) {
  if (!confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
    return
  }

  fetch("../php/productos_eliminar.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_producto: id,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("🗑️ Producto eliminado correctamente")
        cargarProductos()
      } else {
        alert("❌ Error: " + data.mensaje)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error de conexión")
    })
}

function mostrarFormularioNuevoProducto() {
  const nombre = prompt("Nombre del producto:")
  if (!nombre) return

  const precio = prompt("Precio:")
  if (!precio) return

  const stock = prompt("Stock inicial:")
  if (!stock) return

  const descripcion = prompt("Descripción (opcional):") || ""

  // Validaciones
  if (Number.parseFloat(precio) <= 0) {
    alert("❌ El precio debe ser mayor a 0")
    return
  }

  if (Number.parseInt(stock) < 0) {
    alert("❌ El stock no puede ser negativo")
    return
  }

  fetch("../php/productos_crear.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      precio: Number.parseFloat(precio),
      stock: Number.parseInt(stock),
      descripcion: descripcion,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("✅ Producto creado correctamente")
        cargarProductos()
      } else {
        alert("❌ Error: " + data.mensaje)
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error de conexión")
    })
}

function cerrarSesion() {
  if (confirm("¿Cerrar sesión?")) {
    // Limpiar sesión local
    localStorage.removeItem("usuario")
    window.location.href = "../index.html"
  }
}
