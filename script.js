let slideIndex = 1;
// Añadimos esta línea para asegurarnos de que el script se carga
console.log("script.js se ha cargado!"); 
showSlides(slideIndex);

// Controles de siguiente/anterior
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Controles de puntos
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    // Si no encuentra slides, detiene la función para no dar error
    if (slides.length === 0 || dots.length === 0) {
        console.error("Error: No se encontraron los elementos 'slide' o 'dot'.");
        return; 
    }

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Oculta todos los slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Quita la clase "active" de todos los puntos
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Muestra el slide actual y marca el punto como "active"
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}