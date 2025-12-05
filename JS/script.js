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

let slideIndex = 1

function initSlider() {
  const slides = document.getElementsByClassName("slide")
  const dots = document.getElementsByClassName("dot")

  // Solo ejecutar si estamos en una página que tiene el carrusel
  if (slides.length > 0 && dots.length > 0) {
    showSlides(slideIndex)
  }
}

// Llamar a initSlider en lugar de showSlides directamente
initSlider()

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
  handleModalViewSwitching() // Reemplaza la lógica de login/registro conflictiva
  handleReseñasForm()
  handleProductCardParticles() // Nueva función para las partículas
  handleShoppingCart() // Nueva función para el carrito
  handleSideMenu() // Nueva función para el menú lateral
  cargarProductosCatalogo(); // Cargar productos dinámicamente
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

/**
 * Gestiona el cambio de vistas entre el formulario de login y el de registro dentro del modal.
 * La lógica de envío de formularios ya está en login.js.
 */
function handleModalViewSwitching() {
  const modal = document.getElementById("login-modal")
  const closeModalBtn = document.querySelector(".close-modal")
  const loginView = document.getElementById("login-view")
  const registerView = document.getElementById("register-view")
  const showRegisterBtn = document.getElementById("show-register-view")
  const showLoginBtn = document.getElementById("show-login-view")

  if (modal && closeModalBtn && showRegisterBtn && showLoginBtn) {
    // Cierra el modal al hacer clic en la 'X'
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none"
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

function cargarProductosCatalogo() {
    // Solo ejecutar en la página de productos
    if (!window.location.pathname.includes("productos.html")) return;

    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '<p style="color: white; text-align: center;">Cargando productos...</p>';

    fetch('../php/productos_get.php')
        .then(res => {
            if (!res.ok) {
                throw new Error('Error al cargar los productos: ' + res.status);
            }
            return res.json();
        })
        .then(productos => {
            productGrid.innerHTML = ''; // Limpiar mensaje de carga

            if (!productos || productos.length === 0) {
                productGrid.innerHTML = '<p style="color: #888; text-align: center;">No hay productos disponibles en este momento.</p>';
                return;
            }

            productos.forEach(prod => {
                // SOLUCIÓN DE EMERGENCIA: Forzar la ruta correcta.
                // 1. Extraemos solo el nombre del archivo de la URL que viene de la BD (ej: "cera2.webp").
                const nombreArchivo = prod.imagen_url ? prod.imagen_url.split(/[\\/]/).pop() : 'placeholder_producto.webp';
                
                // 2. Construimos la ruta relativa correcta desde la página productos.html.
                const imageUrl = `../img/${nombreArchivo}`; // Sube un nivel desde /html/ y luego entra a /img/

                const card = document.createElement('div');
                card.className = 'product-card';
                card.dataset.id = prod.id_producto;
                card.dataset.name = prod.nombre;
                card.dataset.price = prod.precio;
                card.dataset.img = imageUrl;

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${prod.nombre}">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.descripcion || 'Sin descripción.'}</p>
                    <span class="precio">$${parseFloat(prod.precio).toFixed(2)}</span>
                    <button class="btn-comprar">Agregar al carrito</button>
                `;
                productGrid.appendChild(card);
            });
            handleShoppingCart(); // Volver a inicializar los listeners para los nuevos botones
        })
        .catch(err => {
            console.error('Error al cargar productos del catálogo:', err);
            productGrid.innerHTML = `<p style="color: red; text-align: center;">Error al cargar productos. Intenta recargar la página.</p>`;
        });
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
  const checkoutOptions = document.getElementById("checkout-options")
  itemsContainer.innerHTML = ""

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>"
    totalContainer.innerHTML = ""
    if (checkoutOptions) {
        checkoutOptions.classList.add('disabled');
    }
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

  if (checkoutOptions) {
    checkoutOptions.classList.remove('disabled');
  }

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
        return
      }

      // Previene el comportamiento por defecto del formulario (recargar la página)
      event.preventDefault()

      // Obtener los datos del formulario
      const nombre = sanitizeHTML(document.getElementById("reseña-nombre").value)
      const comentario = sanitizeHTML(document.getElementById("reseña-comentario").value)
      const rating = document.querySelector('input[name="rating"]:checked').value

      // Crear la nueva tarjeta de reseña
      const reseñaGrid = document.querySelector(".reseñas-grid")
      const nuevaReseña = document.createElement("div")
      nuevaReseña.className = "reseña-card"

      let estrellasHTML = ""
      for (let i = 0; i < rating; i++) {
        estrellasHTML += "<span>&#9733;</span>"
      }

      nuevaReseña.innerHTML = ` <div class="reseña-estrellas">${estrellasHTML}</div>
                <p class="reseña-texto"></p>
                <h4 class="reseña-autor"></h4>
            `

      // Usar .textContent para insertar los datos sanitizados.
      // Esto es aún más seguro que usar innerHTML con datos del usuario.
      const textoP = nuevaReseña.querySelector(".reseña-texto")
      const autorH4 = nuevaReseña.querySelector(".reseña-autor")

      textoP.textContent = `"${comentario}"`
      autorH4.textContent = `- ${nombre}`

      // Añadir la nueva reseña al grid
      reseñaGrid.appendChild(nuevaReseña)

      // Limpiar el formulario
      formReseña.reset()
    })
  }
}
