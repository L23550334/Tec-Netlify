// ----- FUNCIÓN DE SANITIZACIÓN -----
/**
 * Sanitiza una cadena de texto para prevenir ataques XSS (Cross-Site Scripting).
 * Reemplaza los caracteres especiales de HTML con sus entidades correspondientes.
 * @param {string} str La cadena a sanitizar.
 * @returns {string} La cadena sanitizada.
 */
function sanitizeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'})[m]);
}

// ----- LÓGICA DE AUTENTICACIÓN (SIMULADA) -----
const DUMMY_USERS = [
  // Cambiado a let para poder añadir nuevos usuarios
  { username: "cliente", password: "123", role: "cliente" },
  { username: "barbero", password: "123", role: "barbero" },
  { username: "admin", password: "123", role: "admin" },
]

let slideIndex = 1
showSlides(slideIndex)

function plusSlides(n) {
  showSlides((slideIndex += n))
}

function currentSlide(n) {
  showSlides((slideIndex = n))
}

function showSlides(n) {
  let i
  const slides = document.getElementsByClassName("slide")
  const dots = document.getElementsByClassName("dot")

  if (slides.length === 0 || dots.length === 0) {
    console.error("Error: No se encontraron los elementos 'slide' o 'dot'.")
    return
  }

  if (n > slides.length) {
    slideIndex = 1
  }
  if (n < 1) {
    slideIndex = slides.length
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "")
  }

  slides[slideIndex - 1].style.display = "block"
  dots[slideIndex - 1].className += " active"
}

// Espera a que todo el contenido del DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  handleAuth()
  setupLoginRequiredElements()
  handleLoginModalAndRedirect()
  handleReseñasForm()
  handleAdminDashboard()
  handleBarberDashboard()
  handleProductCardParticles() // Nueva función para las partículas
  handleShoppingCart() // Nueva función para el carrito
  handleSideMenu() // Nueva función para el menú lateral
})

function handleAuth() {
  const authContainer = document.getElementById("auth-container")
  if (!authContainer) return

  const user = JSON.parse(localStorage.getItem("loggedInUser"))
  const isProductsPage = window.location.pathname.includes("productos.html")

  // Lógica especial para el botón de la derecha en la página de productos
  if (isProductsPage) {
    // Busca el botón del carrito que ya existe en el HTML y le añade la funcionalidad
    const cartBtn = document.getElementById("cart-btn")
    if (cartBtn) cartBtn.addEventListener("click", toggleCartModal)
  }

  if (user) {
    let dashboardLink = ""
    const userRole = user.role || (user.rol == 1 ? "admin" : user.rol == 2 ? "barbero" : "cliente")

    if (userRole === "admin") {
      dashboardLink = `<a href="/html/admin-dashboard.html" class="nav-dashboard">Panel Admin</a>`
    } else if (userRole === "barbero") {
      dashboardLink = `<a href="/html/barbero-dashboard.html" class="nav-dashboard">Mis Citas</a>`
    }

    const displayName = user.username || user.nombre || "Usuario"

    // Si el usuario ha iniciado sesión, muestra su nombre y un botón para salir.
    authContainer.innerHTML = `
            <div class="auth-user">
                <span class="welcome-text">Hola, <span class="username">${displayName}</span></span>
                ${dashboardLink}
                <a href="#" id="logout-btn" class="btn-logout">Cerrar Sesión</a>
            </div>
        `
    document.getElementById("logout-btn").addEventListener("click", logout)
  } else {
    // Si no ha iniciado sesión, el contenedor de auth tendrá el botón de Iniciar Sesión
    authContainer.innerHTML = `<a href="#" class="btn-cita requires-login">Iniciar Sesión</a>`
    // Asegurarse de que el listener se aplique a este nuevo botón
    setupLoginRequiredElements()
  }
}

function logout(event) {
  event.preventDefault()
  localStorage.removeItem("loggedInUser")

  // Comprueba si la página actual está dentro de la carpeta /html/
  const onSubPage = window.location.pathname.includes("/html/")

  // Si está en una subpágina, necesita subir un nivel (../) para encontrar Index.html
  // Si está en la página principal, solo necesita ir a Index.html
  const indexPath = onSubPage ? "/index.html" : "index.html"
  window.location.href = indexPath
}

function setupLoginRequiredElements() {
  const loginRequiredLinks = document.querySelectorAll(".requires-login")
  loginRequiredLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"))
      if (!user) {
        event.preventDefault() // Detiene la navegación a la página de citas
        const loginModal = document.getElementById("login-modal")
        if (loginModal) {
          loginModal.style.display = "flex" // Muestra el modal
        }
      }
    })
  })
}
function handleLoginModalAndRedirect() {
  const loginForm = document.getElementById("form-login")
  const modal = document.getElementById("login-modal")
  const closeModalBtn = document.querySelector(".close-modal")
  const registerForm = document.getElementById("form-register")

  const loginView = document.getElementById("login-view")
  const registerView = document.getElementById("register-view")
  const showRegisterBtn = document.getElementById("show-register-view")
  const showLoginBtn = document.getElementById("show-login-view")

  if (loginForm && modal && closeModalBtn) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault()
      const username = document.getElementById("username").value
      const password = document.getElementById("password").value
      const errorDiv = document.getElementById("login-error")

      const foundUser = DUMMY_USERS.find((u) => u.username === username && u.password === password)

      if (foundUser) {
        localStorage.setItem("loggedInUser", JSON.stringify({ username: foundUser.username, role: foundUser.role }))

        const loginForReview = localStorage.getItem("loginForReview")
        localStorage.removeItem("loginForReview") // Limpiar la bandera inmediatamente

        // Redirigir según el rol
        if (foundUser.role === "admin") {
          window.location.href = "/html/admin-dashboard.html"
        } else if (foundUser.role === "barbero") {
          window.location.href = "/html/barbero-dashboard.html"
        } else {
          // Para clientes: si venía de reseña, se queda en index.html; si no, va a citas.html
          if (loginForReview === "true") {
            window.location.href = "index.html"
          } else {
            window.location.href = "ht"
          }
        }
      } else {
        errorDiv.textContent = "Usuario o contraseña incorrectos."
        errorDiv.style.display = "block"
      }
    })

    // Lógica para el formulario de registro
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault()
      const username = document.getElementById("register-username").value
      const password = document.getElementById("register-password").value
      const errorDiv = document.getElementById("register-error")

      // Simulación de validación: el usuario no debe existir
      const userExists = DUMMY_USERS.some((u) => u.username === username)
      if (userExists) {
        errorDiv.textContent = "Este nombre de usuario ya está en uso."
        errorDiv.style.display = "block"
        return
      }

      // Añadir nuevo usuario (siempre como cliente)
      const newUser = { username, password, role: "cliente" }
      DUMMY_USERS.push(newUser)

      // Iniciar sesión automáticamente y recargar
      localStorage.setItem("loggedInUser", JSON.stringify(newUser))
      window.location.reload()
    })

    // Cierra el modal al hacer clic en la 'X'
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none"
      localStorage.removeItem("loginForReview") // Limpiar la bandera si el modal se cierra sin login
    })

    // Lógica para cambiar entre vistas
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault()
      loginView.style.display = "none"
      registerView.style.display = "block"
    })

    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      registerView.style.display = "none"
      loginView.style.display = "block"
    })
  }
}

// ----- LÓGICA PARA EL MENÚ LATERAL -----
function handleSideMenu() {
  const hamburgerBtn = document.getElementById("hamburger-btn")
  const sideMenu = document.getElementById("side-menu")
  const closeBtn = document.querySelector(".close-side-menu")

  if (hamburgerBtn && sideMenu && closeBtn) {
    hamburgerBtn.addEventListener("click", () => {
      sideMenu.classList.add("open")
      hamburgerBtn.classList.add("open")
    })

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault()
      sideMenu.classList.remove("open")
      hamburgerBtn.classList.remove("open")
    })
  }
}

// ----- LÓGICA DEL CARRITO DE COMPRAS -----

function handleShoppingCart() {
  if (!window.location.pathname.includes("productos.html")) return

  // Añadir evento a los botones "Agregar al carrito"
  document.querySelectorAll(".btn-comprar").forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card")
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: Number.parseFloat(card.dataset.price),
        img: card.dataset.img,
      }
      openQuantityModal(product)
    })
  })

  // Cerrar modales
  const cartModal = document.getElementById("cart-modal")
  if (cartModal) {
    cartModal.querySelector(".close-modal").addEventListener("click", toggleCartModal)
  }

  // --- Lógica para los botones de checkout ---
  handlePickupButton()
  handleDeliveryButton()

  updateCartCount()
}

function handlePickupButton() {
  const pickupBtn = document.getElementById("pickup-btn")
  if (!pickupBtn) return

  pickupBtn.addEventListener("click", () => {
    const cart = getCart()
    if (cart.length === 0) return

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    toggleCartModal() // Cierra el modal del carrito

    // Reutilizamos el modal de confirmación
    showConfirmationModal("¡Pedido Confirmado!", "Muy bien, tus productos están listos para recoger en tienda.", total)
  })
}

function handleDeliveryButton() {
  const deliveryBtn = document.getElementById("delivery-btn")
  const deliveryModal = document.getElementById("delivery-modal")
  if (!deliveryBtn || !deliveryModal) return

  deliveryBtn.addEventListener("click", () => {
    const cart = getCart()
    if (cart.length === 0) return

    toggleCartModal() // Cierra el modal del carrito
    deliveryModal.style.display = "flex" // Muestra el modal de domicilio

    // Pre-rellenar nombre si el usuario está logueado
    const user = JSON.parse(localStorage.getItem("loggedInUser"))
    if (user && user.username) {
      document.getElementById("delivery-nombre").value = user.username
    }
  })

  // Lógica para cerrar y enviar el formulario de domicilio
  const formDelivery = document.getElementById("form-delivery")
  deliveryModal.querySelector(".close-modal").addEventListener("click", () => (deliveryModal.style.display = "none"))

  formDelivery.addEventListener("submit", (e) => {
    e.preventDefault()
    const subtotal = getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = 50 // Costo de envío
    const finalTotal = subtotal + shippingCost

    deliveryModal.style.display = "none" // Oculta el modal de domicilio
    showConfirmationModal(
      "¡Pedido en Camino!",
      `Tu pedido ha sido confirmado y será enviado pronto. Se ha añadido un costo de envío de $${shippingCost.toFixed(2)}.`,
      finalTotal,
    )
  })
}

function showConfirmationModal(title, message, total) {
  const confirmationModal = document.getElementById("pickup-confirmation-modal")

  // Personalizar el contenido del modal
  confirmationModal.querySelector("h2").textContent = title
  confirmationModal.querySelector("p").textContent = message
  confirmationModal.querySelector("#pickup-total").textContent = `Total: $${total.toFixed(2)}`

  confirmationModal.style.display = "flex"

  const closeAndReset = () => {
    confirmationModal.style.display = "none"
    saveCart([]) // Vacía el carrito
    updateCartCount() // Actualiza el contador a 0

    // Desplazamiento suave hacia el catálogo de productos
    const catalogoSection = document.getElementById("catalogo")
    if (catalogoSection) {
      catalogoSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  confirmationModal.querySelector("#close-confirmation-modal").addEventListener("click", closeAndReset, { once: true })
}

function showAlertModal(message, title = "Aviso") {
  const alertModal = document.getElementById("alert-modal")
  if (!alertModal) {
    // Si el modal no existe por alguna razón, usa el alert normal
    alert(message)
    return
  }

  const modalTitle = document.getElementById("alert-modal-title")
  const modalMessage = document.getElementById("alert-modal-message")
  const closeBtn = document.getElementById("alert-modal-close")

  if (modalTitle) modalTitle.textContent = title
  if (modalMessage) modalMessage.textContent = message

  alertModal.style.display = "flex"

  closeBtn.addEventListener(
    "click",
    () => {
      alertModal.style.display = "none"
    },
    { once: true },
  )
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

function addToCart(product, quantity) {
  const cart = getCart()
  const existingProduct = cart.find((item) => item.id === product.id)

  if (existingProduct) {
    existingProduct.quantity += quantity
  } else {
    product.quantity = quantity
    cart.push(product)
  }

  saveCart(cart)
  // Animación visual para el botón del carrito
  const cartBtn = document.getElementById("cart-btn")
  cartBtn.classList.add("shake")
  setTimeout(() => cartBtn.classList.remove("shake"), 500)
}

function updateCartCount() {
  const cart = getCart()
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  const cartCountSpan = document.getElementById("cart-count")
  if (cartCountSpan) {
    cartCountSpan.textContent = count
  }
}

function toggleCartModal(e) {
  if (e) e.preventDefault()
  const modal = document.getElementById("cart-modal")
  if (modal.style.display === "flex") {
    modal.style.display = "none"
  } else {
    renderCartItems()
    modal.style.display = "flex"
  }
}

function renderCartItems() {
  const cart = getCart()
  const itemsContainer = document.getElementById("cart-items-container")
  const totalContainer = document.getElementById("cart-total")
  itemsContainer.innerHTML = ""

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>"
    totalContainer.innerHTML = ""
    return
  }

  let total = 0
  cart.forEach((item) => {
    total += item.price * item.quantity
    itemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>                    
                    <div class="quantity-selector" style="margin-top: 0.5rem; justify-content: flex-start;">
                        <button type="button" class="quantity-btn cart-quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="text" class="cart-quantity-input" value="${item.quantity}" readonly>
                        <button type="button" class="quantity-btn cart-quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <p style="margin-top: 0.5rem;">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div style="text-align: right;">
                    <button class="btn-remove-item" data-id="${item.id}" title="Eliminar producto">&times;</button>
                </div>
            </div>
        `
  })

  totalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`

  // Añadir listeners a los botones de quitar
  document.querySelectorAll(".btn-remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id
      removeFromCart(id)
    })
  })

  // Añadir listeners a los botones de cantidad (+/-)
  document.querySelectorAll(".cart-quantity-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id
      const action = e.target.dataset.action
      if (action === "increase") {
        increaseCartItemQuantity(id)
      } else if (action === "decrease") {
        decreaseCartItemQuantity(id)
      }
    })
  })
}

function removeFromCart(productId) {
  let cart = getCart()
  // Filtra el carrito para eliminar completamente el producto, sin importar la cantidad.
  cart = cart.filter((item) => item.id !== productId)
  saveCart(cart)
  renderCartItems() // Vuelve a renderizar el carrito para mostrar los cambios
}

function increaseCartItemQuantity(productId) {
  const cart = getCart()
  const product = cart.find((item) => item.id === productId)
  if (product) {
    if (product.quantity >= 15) {
      showAlertModal("No contamos con tantas unidades disponibles. El máximo por producto es 15.")
      return
    }
    product.quantity++
  }
  saveCart(cart)
  renderCartItems()
}

function decreaseCartItemQuantity(productId) {
  const cart = getCart()
  const product = cart.find((item) => item.id === productId)
  if (product) {
    if (product.quantity > 1) {
      product.quantity--
    } else {
      // Si la cantidad es 1, al disminuir se elimina el producto
      removeFromCart(productId)
      return // Salimos para evitar doble renderizado
    }
  }
  saveCart(cart)
  renderCartItems()
}

function openQuantityModal(product) {
  const modal = document.getElementById("quantity-modal")
  const title = document.getElementById("quantity-modal-title")
  const form = document.getElementById("form-quantity")
  const quantityInput = document.getElementById("quantity-input")
  const closeModalBtn = modal.querySelector(".close-modal")
  const plusBtn = document.getElementById("quantity-plus")
  const minusBtn = document.getElementById("quantity-minus")

  title.textContent = `¿Cuántos "${product.name}" quieres?`
  quantityInput.value = 1 // Resetea a 1 cada vez
  modal.style.display = "flex"

  // Listeners para los botones + y -
  const plusHandler = () => {
    const currentValue = Number.parseInt(quantityInput.value, 10)
    if (currentValue >= 15) {
      showAlertModal("No contamos con tantas unidades disponibles. El máximo por producto es 15.")
      return
    }
    quantityInput.value = currentValue + 1
  }
  const minusHandler = () => {
    const currentValue = Number.parseInt(quantityInput.value, 10)
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1
    }
  }

  plusBtn.addEventListener("click", plusHandler)
  minusBtn.addEventListener("click", minusHandler)

  const submitHandler = (e) => {
    e.preventDefault()
    const quantity = Number.parseInt(quantityInput.value, 10)
    if (quantity > 0) {
      addToCart(product, quantity)
    }
    modal.style.display = "none"
    // Limpia todos los listeners para evitar duplicados en la próxima apertura
    form.removeEventListener("submit", submitHandler) // Limpia el listener para evitar duplicados
    plusBtn.removeEventListener("click", plusHandler)
    minusBtn.removeEventListener("click", minusHandler)
  }

  form.addEventListener("submit", submitHandler)
  closeModalBtn.addEventListener(
    "click",
    () => {
      modal.style.display = "none"
      form.removeEventListener("submit", submitHandler)
      plusBtn.removeEventListener("click", plusHandler)
      minusBtn.removeEventListener("click", minusHandler)
    },
    { once: true },
  )
}

// ----- LÓGICA PARA PARTÍCULAS EN TARJETAS DE PRODUCTO -----

function handleProductCardParticles() {
  const productCards = document.querySelectorAll(".product-card")
  if (productCards.length === 0) return

  productCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      createParticles(card)
    })

    card.addEventListener("mouseleave", () => {
      const particleContainer = card.querySelector(".particle-container")
      if (particleContainer) {
        particleContainer.remove()
      }
    })
  })
}

function createParticles(card) {
  // Asegurarse de que no haya un contenedor de partículas previo
  if (card.querySelector(".particle-container")) return

  const particleContainer = document.createElement("div")
  particleContainer.classList.add("particle-container")
  card.appendChild(particleContainer)

  const numberOfParticles = 20 // Cantidad de chispas

  for (let i = 0; i < numberOfParticles; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    // Posición y tamaño aleatorios
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.transform = `scale(${Math.random()})`
    particle.style.setProperty("--random-x", Math.random())
    particle.style.setProperty("--random-y", Math.random())
    particle.style.animationDelay = `${Math.random() * 2}s`
    particleContainer.appendChild(particle)
  }
}

// ----- LÓGICA PARA PANELES DE ADMIN Y BARBERO -----

function getCitas() {
  // Obtiene las citas de localStorage o devuelve un array vacío con datos de ejemplo si no hay nada
  const citas = localStorage.getItem("citas")
  if (citas) {
    return JSON.parse(citas)
  } else {
    // Datos de ejemplo para la primera vez
    const citasEjemplo = [
      { id: 1, nombre: "Juan Pérez", servicio: "Corte y Barba", fecha: "2025-11-26T10:00", telefono: "5512345678" },
      { id: 2, nombre: "Miguel R.", servicio: "Corte de Cabello", fecha: "2025-11-26T12:30", telefono: "5587654321" },
    ]
    localStorage.setItem("citas", JSON.stringify(citasEjemplo))
    return citasEjemplo
  }
}

function saveCitas(citas) {
  localStorage.setItem("citas", JSON.stringify(citas))
}

function handleAdminDashboard() {
  if (!document.getElementById("admin-panel")) return

  const modal = document.getElementById("cita-modal")
  const btnAbrirModal = document.getElementById("btn-abrir-modal-cita")
  const closeModalBtn = modal.querySelector(".close-modal")
  const formCita = document.getElementById("form-cita")
  const modalTitulo = document.getElementById("cita-modal-titulo")

  btnAbrirModal.addEventListener("click", () => {
    formCita.reset()
    document.getElementById("cita-id").value = ""
    modalTitulo.textContent = "Añadir Nueva Cita"
    modal.style.display = "flex"
  })

  closeModalBtn.addEventListener("click", () => (modal.style.display = "none"))

<<<<<<< HEAD
    formCita.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('cita-id').value;
        const nuevaCita = {
            id: id ? parseInt(id) : Date.now(),
            nombre: sanitizeHTML(document.getElementById('cita-nombre').value),
            telefono: sanitizeHTML(document.getElementById('cita-telefono').value),
            servicio: sanitizeHTML(document.getElementById('cita-servicio').value),
            fecha: document.getElementById('cita-fecha').value, // La fecha no necesita sanitización de HTML
        };
=======
  formCita.addEventListener("submit", (e) => {
    e.preventDefault()
    const id = document.getElementById("cita-id").value
    const nuevaCita = {
      id: id ? Number.parseInt(id) : Date.now(), // Usa el ID existente o crea uno nuevo
      nombre: document.getElementById("cita-nombre").value,
      telefono: document.getElementById("cita-telefono").value,
      servicio: document.getElementById("cita-servicio").value,
      fecha: document.getElementById("cita-fecha").value,
    }
>>>>>>> 4556148552fe05caf7d416858403540cf03ca712

    let citas = getCitas()
    if (id) {
      // Editando
      citas = citas.map((c) => (c.id === nuevaCita.id ? nuevaCita : c))
    } else {
      // Creando
      citas.push(nuevaCita)
    }
    saveCitas(citas)
    renderAdminTable()
    modal.style.display = "none"
  })

  renderAdminTable()
}

function renderAdminTable() {
  const tbody = document.getElementById("citas-tbody")
  if (!tbody) return
  tbody.innerHTML = ""
  const citas = getCitas()

  citas.forEach((cita) => {
    const fecha = new Date(cita.fecha)
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.servicio}</td>
            <td>${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}</td>
            <td>${cita.telefono}</td>
            <td class="actions-cell">
                <button class="btn-accion btn-editar" data-id="${cita.id}">Editar</button>
                <button class="btn-accion btn-eliminar" data-id="${cita.id}">Eliminar</button>
            </td>
        `
    tbody.appendChild(tr)
  })

  // Añadir listeners para los nuevos botones
  document.querySelectorAll(".btn-editar").forEach((btn) => btn.addEventListener("click", editarCita))
  document.querySelectorAll(".btn-eliminar").forEach((btn) => btn.addEventListener("click", eliminarCita))
}

function editarCita(e) {
  const id = Number.parseInt(e.target.dataset.id)
  const citas = getCitas()
  const cita = citas.find((c) => c.id === id)

  document.getElementById("cita-id").value = cita.id
  document.getElementById("cita-nombre").value = cita.nombre
  document.getElementById("cita-telefono").value = cita.telefono
  document.getElementById("cita-servicio").value = cita.servicio
  document.getElementById("cita-fecha").value = cita.fecha

  document.getElementById("cita-modal-titulo").textContent = "Editar Cita"
  document.getElementById("cita-modal").style.display = "flex"
}

function eliminarCita(e) {
  if (!confirm("¿Estás seguro de que quieres eliminar esta cita?")) return
  const id = Number.parseInt(e.target.dataset.id)
  let citas = getCitas()
  citas = citas.filter((c) => c.id !== id)
  saveCitas(citas)
  renderAdminTable()
}

function handleBarberDashboard() {
  const tbody = document.getElementById("citas-tbody")
  if (!document.getElementById("barber-panel") || !tbody) return

  tbody.innerHTML = ""
  const citas = getCitas()

  citas.forEach((cita) => {
    const fecha = new Date(cita.fecha)
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.servicio}</td>
            <td>${fecha.toLocaleTimeString()}</td>
        `
    tbody.appendChild(tr)
  })
}

function handleReseñasForm() {
  const formReseña = document.getElementById("form-reseña")

  // Verifica si el formulario existe en la página actual
  if (formReseña) {
    formReseña.addEventListener("submit", (event) => {
      const user = JSON.parse(localStorage.getItem("loggedInUser"))

      // Si el usuario no ha iniciado sesión, previene el envío y lo redirige
      if (!user) {
        event.preventDefault()
        document.getElementById("login-modal").style.display = "flex" // Muestra el modal
        localStorage.setItem("loginForReview", "true") // Establecer bandera para saber que el login es para una reseña
        return
      }

      // Previene el comportamiento por defecto del formulario (recargar la página)
      event.preventDefault()

<<<<<<< HEAD
            // 1. Obtener los datos del formulario
            const nombre = sanitizeHTML(document.getElementById('reseña-nombre').value);
            const comentario = sanitizeHTML(document.getElementById('reseña-comentario').value);
            const rating = document.querySelector('input[name="rating"]:checked').value;

            // 2. Crear la nueva tarjeta de reseña
            const reseñaGrid = document.querySelector('.reseñas-grid');
            const nuevaReseña = document.createElement('div');
            nuevaReseña.className = 'reseña-card';
=======
      // 1. Obtener los datos del formulario
      const nombre = document.getElementById("reseña-nombre").value
      const comentario = document.getElementById("reseña-comentario").value
      const rating = document.querySelector('input[name="rating"]:checked').value

      // 2. Crear la nueva tarjeta de reseña
      const reseñaGrid = document.querySelector(".reseñas-grid")
      const nuevaReseña = document.createElement("div")
      nuevaReseña.classList.add("reseña-card")
>>>>>>> 4556148552fe05caf7d416858403540cf03ca712

      let estrellasHTML = ""
      for (let i = 0; i < rating; i++) {
        estrellasHTML += "<span>&#9733;</span>"
      }

      nuevaReseña.innerHTML = `
                <div class="reseña-estrellas">${estrellasHTML}</div>
<<<<<<< HEAD
                <p class="reseña-texto"></p>
                <h4 class="reseña-autor"></h4>
            `;

            // 3. Usar .textContent para insertar los datos sanitizados.
            // Esto es aún más seguro que usar innerHTML con datos del usuario.
            const textoP = nuevaReseña.querySelector('.reseña-texto');
            const autorH4 = nuevaReseña.querySelector('.reseña-autor');
            
            textoP.textContent = `"${comentario}"`;
            autorH4.textContent = `- ${nombre}`;

            // 3. Añadir la nueva reseña al grid
            reseñaGrid.appendChild(nuevaReseña);
=======
                <p class="reseña-texto">"${comentario}"</p>
                <h4 class="reseña-autor">- ${nombre}</h4>
            `

      // 3. Añadir la nueva reseña al grid
      reseñaGrid.appendChild(nuevaReseña)
>>>>>>> 4556148552fe05caf7d416858403540cf03ca712

      // 4. Limpiar el formulario
      formReseña.reset()
    })
  }
}
