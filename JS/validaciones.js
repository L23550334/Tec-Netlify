// JS/validaciones.js

// ========================================
// FUNCIONES DE VALIDACIÓN REUTILIZABLES
// ========================================

const Validaciones = {
    // Validar email con formato correcto
    email: (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },
  
    // Validar teléfono de 10 dígitos
    telefono: (telefono) => {
      const regex = /^[0-9]{10}$/
      return regex.test(telefono)
    },
  
    // Validar nombre (solo letras y espacios, 3-50 caracteres)
    nombre: (nombre) => {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/
      return regex.test(nombre)
    },
  
    // Validar contraseña (mínimo 6 caracteres)
    password: (password) => password.length >= 6,
  
    // Validar campo no vacío
    requerido: (valor) => valor.trim() !== "",
  
    // Validar longitud mínima
    longitudMinima: (valor, min) => valor.trim().length >= min,
  
    // Validar longitud máxima
    longitudMaxima: (valor, max) => valor.trim().length <= max,
  
    // Validar fecha no sea en el pasado
    fechaFutura: (fecha) => {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const fechaSeleccionada = new Date(fecha)
      return fechaSeleccionada >= hoy
    },
  
    // Validar que no sea domingo
    noDomingo: (fecha) => {
      const fechaSeleccionada = new Date(fecha)
      return fechaSeleccionada.getDay() !== 0 // 0 = Domingo
    },
  
    // Validar hora en horario laboral (9:00 - 20:00)
    horaLaboral: (hora) => {
      const [horas, minutos] = hora.split(":").map(Number)
      const horaEnMinutos = horas * 60 + minutos
      const inicioLaboral = 9 * 60 // 9:00 AM
      const finLaboral = 20 * 60 // 8:00 PM
      return horaEnMinutos >= inicioLaboral && horaEnMinutos <= finLaboral
    },
  
    // Validar número positivo
    numeroPositivo: (numero) => !isNaN(numero) && Number.parseFloat(numero) > 0,
  
    // Validar dirección (mínimo 5 caracteres)
    direccion: (direccion) => direccion.trim().length >= 5,
  }
  
  // ========================================
  // FUNCIONES DE UI PARA ERRORES
  // ========================================
  
  function mostrarErrorCampo(input, mensaje) {
    // Remover error previo si existe
    limpiarErrorCampo(input)
  
    input.classList.add("input-error")
  
    const errorSpan = document.createElement("span")
    errorSpan.className = "error-mensaje"
    errorSpan.textContent = mensaje
    errorSpan.style.cssText = "color: #e74c3c; font-size: 12px; display: block; margin-top: 4px;"
  
    input.parentNode.appendChild(errorSpan)
  }
  
  function limpiarErrorCampo(input) {
    input.classList.remove("input-error")
    const errorExistente = input.parentNode.querySelector(".error-mensaje")
    if (errorExistente) {
      errorExistente.remove()
    }
  }
  
  function limpiarTodosErrores(formulario) {
    formulario.querySelectorAll(".input-error").forEach((input) => {
      input.classList.remove("input-error")
    })
    formulario.querySelectorAll(".error-mensaje").forEach((span) => {
      span.remove()
    })
  }
  
  // ========================================
  // VALIDACIÓN DEL FORMULARIO DE CITAS
  // ========================================
  
  function validarFormularioCitas(form) {
    const nombre = form.querySelector("#nombre")
    const email = form.querySelector("#email")
    const telefono = form.querySelector("#telefono")
    const fecha = form.querySelector("#fecha")
    const hora = form.querySelector("#hora")
    const servicio = form.querySelector("#servicio")
  
    let esValido = true
    limpiarTodosErrores(form)
  
    // Validar nombre
    if (nombre && !Validaciones.nombre(nombre.value)) {
      mostrarErrorCampo(nombre, "El nombre solo debe contener letras (mínimo 3 caracteres)")
      esValido = false
    }
  
    // Validar email
    if (email && !Validaciones.email(email.value)) {
      mostrarErrorCampo(email, "Ingresa un correo electrónico válido")
      esValido = false
    }
  
    // Validar teléfono
    if (telefono && !Validaciones.telefono(telefono.value)) {
      mostrarErrorCampo(telefono, "El teléfono debe tener 10 dígitos")
      esValido = false
    }
  
    // Validar fecha
    if (fecha) {
      if (!Validaciones.requerido(fecha.value)) {
        mostrarErrorCampo(fecha, "Selecciona una fecha")
        esValido = false
      } else if (!Validaciones.fechaFutura(fecha.value)) {
        mostrarErrorCampo(fecha, "La fecha no puede ser en el pasado")
        esValido = false
      } else if (!Validaciones.noDomingo(fecha.value)) {
        mostrarErrorCampo(fecha, "No se agendan citas los domingos")
        esValido = false
      }
    }
  
    // Validar hora
    if (hora) {
      if (!Validaciones.requerido(hora.value)) {
        mostrarErrorCampo(hora, "Selecciona una hora")
        esValido = false
      } else if (!Validaciones.horaLaboral(hora.value)) {
        mostrarErrorCampo(hora, "El horario es de 9:00 AM a 8:00 PM")
        esValido = false
      }
    }
  
    // Validar servicio
    if (servicio && !Validaciones.requerido(servicio.value)) {
      mostrarErrorCampo(servicio, "Selecciona un servicio")
      esValido = false
    }
  
    return esValido
  }
  
  // ========================================
  // VALIDACIÓN DEL FORMULARIO DE DOMICILIO
  // ========================================
  
  function validarFormularioDomicilio(form) {
    const nombre = form.querySelector("#delivery-nombre")
    const calle = form.querySelector("#delivery-calle")
    const numExterior = form.querySelector("#delivery-num-exterior")
    const colonia = form.querySelector("#delivery-colonia")
  
    let esValido = true
    limpiarTodosErrores(form)
  
    // Validar nombre
    if (nombre && !Validaciones.nombre(nombre.value)) {
      mostrarErrorCampo(nombre, "El nombre solo debe contener letras (mínimo 3 caracteres)")
      esValido = false
    }
  
    // Validar calle
    if (calle && !Validaciones.direccion(calle.value)) {
      mostrarErrorCampo(calle, "La calle debe tener al menos 5 caracteres")
      esValido = false
    }
  
    // Validar número exterior
    if (numExterior && !Validaciones.requerido(numExterior.value)) {
      mostrarErrorCampo(numExterior, "Ingresa el número exterior")
      esValido = false
    }
  
    // Validar colonia
    if (colonia && !Validaciones.requerido(colonia.value)) {
      mostrarErrorCampo(colonia, "Selecciona una colonia")
      esValido = false
    }
  
    return esValido
  }
  
  // ========================================
  // INICIALIZACIÓN DE VALIDACIONES EN TIEMPO REAL
  // ========================================
  
  document.addEventListener("DOMContentLoaded", () => {
    // Validación en tiempo real para campos de email
    document.querySelectorAll('input[type="email"]').forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value && !Validaciones.email(this.value)) {
          mostrarErrorCampo(this, "Correo electrónico inválido")
        } else {
          limpiarErrorCampo(this)
        }
      })
    })
  
    // Validación en tiempo real para campos de teléfono
    document.querySelectorAll('input[type="tel"]').forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.value && !Validaciones.telefono(this.value)) {
          mostrarErrorCampo(this, "Debe tener 10 dígitos")
        } else {
          limpiarErrorCampo(this)
        }
      })
  
      // Solo permitir números
      input.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "")
      })
    })
  
    // Validación para formulario de citas
    const formCitas = document.getElementById("form-cita")
    if (formCitas) {
      formCitas.addEventListener("submit", function (e) {
        if (!validarFormularioCitas(this)) {
          e.preventDefault()
        }
      })
    }
  
    // Validación para formulario de domicilio
    const formDelivery = document.getElementById("form-delivery")
    if (formDelivery) {
      formDelivery.addEventListener("submit", function (e) {
        if (!validarFormularioDomicilio(this)) {
          e.preventDefault()
        }
      })
    }
  })
  