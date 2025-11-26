// ----- LÓGICA DE AUTENTICACIÓN (SIMULADA) -----
let DUMMY_USERS = [ // Cambiado a let para poder añadir nuevos usuarios
    { username: 'cliente', password: '123', role: 'cliente' },
    { username: 'barbero', password: '123', role: 'barbero' },
    { username: 'admin', password: '123', role: 'admin' }
];

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (slides.length === 0 || dots.length === 0) {
        console.error("Error: No se encontraron los elementos 'slide' o 'dot'.");
        return; 
    }

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    handleAuth();
    setupLoginRequiredElements();
    handleLoginModalAndRedirect();
    handleReseñasForm();
    handleAdminDashboard();
    handleBarberDashboard();
    handleProductCardParticles(); // Nueva función para las partículas
    handleShoppingCart(); // Nueva función para el carrito
    handleSideMenu(); // Nueva función para el menú lateral
});

function handleAuth() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const isProductsPage = window.location.pathname.includes('productos.html');

    // Lógica especial para el botón de la derecha en la página de productos
    if (isProductsPage) {
        // Mueve el botón del carrito al placeholder de la derecha en la barra de navegación
        const navPlaceholder = document.querySelector('.nav-placeholder');
        navPlaceholder.innerHTML = `<a href="#" id="cart-btn" class="btn-cita">Carrito (<span id="cart-count">0</span>)</a>`;
        document.getElementById('cart-btn').addEventListener('click', toggleCartModal);
        // En la página de productos, no necesitamos mostrar el estado de login/logout en el menú lateral.
        // Así que detenemos la función aquí.
        return;
    }

    if (user) {
        let dashboardLink = '';
        if (user.role === 'admin') {
            dashboardLink = `<a href="html/admin-dashboard.html" class="nav-dashboard">Panel Admin</a>`;
        } else if (user.role === 'barbero') {
            dashboardLink = `<a href="html/barbero-dashboard.html" class="nav-dashboard">Mis Citas</a>`;
        }

        // Si el usuario ha iniciado sesión, muestra su nombre y un botón para salir.
        authContainer.innerHTML = `
            <div class="auth-user">
                <span class="welcome-text">Hola, <span class="username">${user.username}</span></span>
                ${dashboardLink}
                <a href="#" id="logout-btn" class="btn-logout">Salir</a>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', logout);
    } else {
        // Si no ha iniciado sesión, el contenedor de auth tendrá el botón de Iniciar Sesión
        authContainer.innerHTML = `<a href="#" class="btn-cita requires-login">Iniciar Sesión</a>`;
        // Asegurarse de que el listener se aplique a este nuevo botón
        setupLoginRequiredElements();
    }
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');

    // Comprueba si la página actual está dentro de la carpeta /html/
    const onSubPage = window.location.pathname.includes('/html/');

    // Si está en una subpágina, necesita subir un nivel (../) para encontrar Index.html
    // Si está en la página principal, solo necesita ir a Index.html
    const indexPath = onSubPage ? '../index.html' : 'index.html';
    window.location.href = indexPath;
}

function setupLoginRequiredElements() {
    const loginRequiredLinks = document.querySelectorAll('.requires-login');
    loginRequiredLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!user) {
                event.preventDefault(); // Detiene la navegación a la página de citas
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.style.display = 'flex'; // Muestra el modal
                }
            }
        });
    });
}
function handleLoginModalAndRedirect() {
    const loginForm = document.getElementById('form-login');
    const modal = document.getElementById('login-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const registerForm = document.getElementById('form-register');

    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterBtn = document.getElementById('show-register-view');
    const showLoginBtn = document.getElementById('show-login-view');

    if (loginForm && modal && closeModalBtn) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');

            const foundUser = DUMMY_USERS.find(u => u.username === username && u.password === password);

            if (foundUser) {
                localStorage.setItem('loggedInUser', JSON.stringify({ username: foundUser.username, role: foundUser.role }));
                
                const loginForReview = localStorage.getItem('loginForReview');
                localStorage.removeItem('loginForReview'); // Limpiar la bandera inmediatamente

                // Redirigir según el rol
                if (foundUser.role === 'admin') {
                    window.location.href = 'html/admin-dashboard.html';
                } else if (foundUser.role === 'barbero') {
                    window.location.href = 'html/barbero-dashboard.html';
                } else {
                    // Para clientes: si venía de reseña, se queda en Index.html; si no, va a citas.html
                    if (loginForReview === 'true') {
                        window.location.href = 'index.html';
                    } else {
                        window.location.href = 'html/citas.html';
                    }
                }
            } else {
                errorDiv.textContent = 'Usuario o contraseña incorrectos.';
                errorDiv.style.display = 'block';
            }
        });

        // Lógica para el formulario de registro
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const errorDiv = document.getElementById('register-error');

            // Simulación de validación: el usuario no debe existir
            const userExists = DUMMY_USERS.some(u => u.username === username);
            if (userExists) {
                errorDiv.textContent = 'Este nombre de usuario ya está en uso.';
                errorDiv.style.display = 'block';
                return;
            }

            // Añadir nuevo usuario (siempre como cliente)
            const newUser = { username, password, role: 'cliente' };
            DUMMY_USERS.push(newUser);

            // Iniciar sesión automáticamente y recargar
            localStorage.setItem('loggedInUser', JSON.stringify(newUser));
            window.location.reload();
        });

        // Cierra el modal al hacer clic en la 'X'
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            localStorage.removeItem('loginForReview'); // Limpiar la bandera si el modal se cierra sin login
        });

        // Lógica para cambiar entre vistas
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.style.display = 'none';
            loginView.style.display = 'block';
        });
    }
}

// ----- LÓGICA PARA EL MENÚ LATERAL -----
function handleSideMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.querySelector('.close-side-menu');

    if (hamburgerBtn && sideMenu && closeBtn) {
        hamburgerBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            hamburgerBtn.classList.add('open');
        });

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenu.classList.remove('open');
            hamburgerBtn.classList.remove('open');
        });
    }
}

// ----- LÓGICA DEL CARRITO DE COMPRAS -----

function handleShoppingCart() {
    if (!window.location.pathname.includes('productos.html')) return;

    // Añadir evento a los botones "Agregar al carrito"
    document.querySelectorAll('.btn-comprar').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                img: card.dataset.img,
            };
            openQuantityModal(product);
        });
    });

    // Cerrar modales
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.querySelector('.close-modal').addEventListener('click', toggleCartModal);
    }

    updateCartCount();
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product, quantity) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        product.quantity = quantity;
        cart.push(product);
    }

    saveCart(cart);
    // Animación visual para el botón del carrito
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('shake');
    setTimeout(() => cartBtn.classList.remove('shake'), 500);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) {
        cartCountSpan.textContent = count;
    }
}

function toggleCartModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        renderCartItems();
        modal.style.display = 'flex';
    }
}

function renderCartItems() {
    const cart = getCart();
    const itemsContainer = document.getElementById('cart-items-container');
    const totalContainer = document.getElementById('cart-total');
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        totalContainer.innerHTML = '';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        itemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img.replace('..', '')}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x $${item.price.toFixed(2)}</p>
                </div>
                <button class="btn-remove-item" data-id="${item.id}">&times;</button>
            </div>
        `;
    });

    totalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;

    // Añadir listeners a los botones de quitar
    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            removeFromCart(id);
        });
    });
}

function removeFromCart(productId) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        if (cart[productIndex].quantity > 1) {
            // Si hay más de uno, solo reduce la cantidad
            cart[productIndex].quantity--;
        } else {
            // Si solo hay uno, elimina el producto del carrito
            cart.splice(productIndex, 1);
        }
    }

    saveCart(cart);
    renderCartItems(); // Vuelve a renderizar el carrito para mostrar los cambios
}

function openQuantityModal(product) {
    const modal = document.getElementById('quantity-modal');
    const title = document.getElementById('quantity-modal-title');
    const form = document.getElementById('form-quantity');
    const quantityInput = document.getElementById('quantity-input');
    const closeModalBtn = modal.querySelector('.close-modal');
    const plusBtn = document.getElementById('quantity-plus');
    const minusBtn = document.getElementById('quantity-minus');

    title.textContent = `¿Cuántos "${product.name}" quieres?`;
    quantityInput.value = 1; // Resetea a 1 cada vez
    modal.style.display = 'flex';

    // Listeners para los botones + y -
    const plusHandler = () => {
        quantityInput.value = parseInt(quantityInput.value, 10) + 1;
    };
    const minusHandler = () => {
        const currentValue = parseInt(quantityInput.value, 10);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    };

    plusBtn.addEventListener('click', plusHandler);
    minusBtn.addEventListener('click', minusHandler);

    const submitHandler = (e) => {
        e.preventDefault();
        const quantity = parseInt(quantityInput.value, 10);
        if (quantity > 0) {
            addToCart(product, quantity);
        }
        modal.style.display = 'none';
        // Limpia todos los listeners para evitar duplicados en la próxima apertura
        form.removeEventListener('submit', submitHandler); // Limpia el listener para evitar duplicados
        plusBtn.removeEventListener('click', plusHandler);
        minusBtn.removeEventListener('click', minusHandler);
    };

    form.addEventListener('submit', submitHandler);
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        form.removeEventListener('submit', submitHandler);
        plusBtn.removeEventListener('click', plusHandler);
        minusBtn.removeEventListener('click', minusHandler);
    }, { once: true });
}

// ----- LÓGICA PARA PARTÍCULAS EN TARJETAS DE PRODUCTO -----

function handleProductCardParticles() {
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length === 0) return;

    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createParticles(card);
        });

        card.addEventListener('mouseleave', () => {
            const particleContainer = card.querySelector('.particle-container');
            if (particleContainer) {
                particleContainer.remove();
            }
        });
    });
}

function createParticles(card) {
    // Asegurarse de que no haya un contenedor de partículas previo
    if (card.querySelector('.particle-container')) return;

    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-container');
    card.appendChild(particleContainer);

    const numberOfParticles = 20; // Cantidad de chispas

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Posición y tamaño aleatorios
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.transform = `scale(${Math.random()})`;
        particle.style.setProperty('--random-x', Math.random());
        particle.style.setProperty('--random-y', Math.random());
        particle.style.setProperty('--random-x', Math.random());
        particle.style.setProperty('--random-y', Math.random());
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particleContainer.appendChild(particle);
    }
}

// ----- LÓGICA PARA PANELES DE ADMIN Y BARBERO -----

function getCitas() {
    // Obtiene las citas de localStorage o devuelve un array vacío con datos de ejemplo si no hay nada
    const citas = localStorage.getItem('citas');
    if (citas) {
        return JSON.parse(citas);
    } else {
        // Datos de ejemplo para la primera vez
        const citasEjemplo = [
            { id: 1, nombre: 'Juan Pérez', servicio: 'Corte y Barba', fecha: '2025-11-26T10:00', telefono: '5512345678' },
            { id: 2, nombre: 'Miguel R.', servicio: 'Corte de Cabello', fecha: '2025-11-26T12:30', telefono: '5587654321' }
        ];
        localStorage.setItem('citas', JSON.stringify(citasEjemplo));
        return citasEjemplo;
    }
}

function saveCitas(citas) {
    localStorage.setItem('citas', JSON.stringify(citas));
}

function handleAdminDashboard() {
    if (!document.getElementById('admin-panel')) return;

    const modal = document.getElementById('cita-modal');
    const btnAbrirModal = document.getElementById('btn-abrir-modal-cita');
    const closeModalBtn = modal.querySelector('.close-modal');
    const formCita = document.getElementById('form-cita');
    const modalTitulo = document.getElementById('cita-modal-titulo');

    btnAbrirModal.addEventListener('click', () => {
        formCita.reset();
        document.getElementById('cita-id').value = '';
        modalTitulo.textContent = 'Añadir Nueva Cita';
        modal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');

    formCita.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('cita-id').value;
        const nuevaCita = {
            id: id ? parseInt(id) : Date.now(), // Usa el ID existente o crea uno nuevo
            nombre: document.getElementById('cita-nombre').value,
            telefono: document.getElementById('cita-telefono').value,
            servicio: document.getElementById('cita-servicio').value,
            fecha: document.getElementById('cita-fecha').value,
        };

        let citas = getCitas();
        if (id) { // Editando
            citas = citas.map(c => c.id === nuevaCita.id ? nuevaCita : c);
        } else { // Creando
            citas.push(nuevaCita);
        }
        saveCitas(citas);
        renderAdminTable();
        modal.style.display = 'none';
    });

    renderAdminTable();
}

function renderAdminTable() {
    const tbody = document.getElementById('citas-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const citas = getCitas();

    citas.forEach(cita => {
        const fecha = new Date(cita.fecha);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.servicio}</td>
            <td>${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}</td>
            <td>${cita.telefono}</td>
            <td class="actions-cell">
                <button class="btn-accion btn-editar" data-id="${cita.id}">Editar</button>
                <button class="btn-accion btn-eliminar" data-id="${cita.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Añadir listeners para los nuevos botones
    document.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', editarCita));
    document.querySelectorAll('.btn-eliminar').forEach(btn => btn.addEventListener('click', eliminarCita));
}

function editarCita(e) {
    const id = parseInt(e.target.dataset.id);
    const citas = getCitas();
    const cita = citas.find(c => c.id === id);

    document.getElementById('cita-id').value = cita.id;
    document.getElementById('cita-nombre').value = cita.nombre;
    document.getElementById('cita-telefono').value = cita.telefono;
    document.getElementById('cita-servicio').value = cita.servicio;
    document.getElementById('cita-fecha').value = cita.fecha;

    document.getElementById('cita-modal-titulo').textContent = 'Editar Cita';
    document.getElementById('cita-modal').style.display = 'flex';
}

function eliminarCita(e) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cita?')) return;
    const id = parseInt(e.target.dataset.id);
    let citas = getCitas();
    citas = citas.filter(c => c.id !== id);
    saveCitas(citas);
    renderAdminTable();
}

function handleBarberDashboard() {
    const tbody = document.getElementById('citas-tbody');
    if (!document.getElementById('barber-panel') || !tbody) return;

    tbody.innerHTML = '';
    const citas = getCitas();

    citas.forEach(cita => {
        const fecha = new Date(cita.fecha);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.servicio}</td>
            <td>${fecha.toLocaleTimeString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

function handleReseñasForm() {
    const formReseña = document.getElementById('form-reseña');

    // Verifica si el formulario existe en la página actual
    if (formReseña) {
        formReseña.addEventListener('submit', function(event) {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));

            // Si el usuario no ha iniciado sesión, previene el envío y lo redirige
            if (!user) {
                event.preventDefault();
                document.getElementById('login-modal').style.display = 'flex'; // Muestra el modal
                localStorage.setItem('loginForReview', 'true'); // Establecer bandera para saber que el login es para una reseña
                return;
            }

            // Previene el comportamiento por defecto del formulario (recargar la página)
            event.preventDefault();

            // 1. Obtener los datos del formulario
            const nombre = document.getElementById('reseña-nombre').value;
            const comentario = document.getElementById('reseña-comentario').value;
            const rating = document.querySelector('input[name="rating"]:checked').value;

            // 2. Crear la nueva tarjeta de reseña
            const reseñaGrid = document.querySelector('.reseñas-grid');
            const nuevaReseña = document.createElement('div');
            nuevaReseña.classList.add('reseña-card');

            let estrellasHTML = '';
            for (let i = 0; i < rating; i++) {
                estrellasHTML += '<span>&#9733;</span>';
            }

            nuevaReseña.innerHTML = `
                <div class="reseña-estrellas">${estrellasHTML}</div>
                <p class="reseña-texto">"${comentario}"</p>
                <h4 class="reseña-autor">- ${nombre}</h4>
            `;

            // 3. Añadir la nueva reseña al grid
            reseñaGrid.appendChild(nuevaReseña);

            // 4. Limpiar el formulario
            formReseña.reset();
        });
    }
}
