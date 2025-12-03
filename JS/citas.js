// JS/citas.js - Manejo completo del sistema de citas

document.addEventListener("DOMContentLoaded", () => {
    const formCita = document.getElementById("form-cita")
    const selectBarbero = document.getElementById("barbero")
    const selectServicio = document.getElementById("servicio")
    const inputFecha = document.getElementById("fecha")
    const selectHora = document.getElementById("hora")
    const resumenCita = document.getElementById("resumen-cita")
    const mensajeCita = document.getElementById("mensaje-cita")
    const seccionMisCitas = document.getElementById("mis-citas")
  
    // Configurar fecha mínima (hoy) y máxima (30 días)
    const hoy = new Date()
    const maxFecha = new Date()
    maxFecha.setDate(hoy.getDate() + 30)
  
    inputFecha.min = hoy.toISOString().split("T")[0]
    inputFecha.max = maxFecha.toISOString().split("T")[0]
  
    // Cargar barberos al iniciar
    cargarBarberos()
  
    // Verificar si el usuario está logueado para mostrar sus citas
    const usuario = JSON.parse(localStorage.getItem("usuario"))
    if (usuario) {
      seccionMisCitas.style.display = "block"
      cargarMisCitas(usuario.id_usuario)
    }
  
    // Evento: Al cambiar fecha o barbero, cargar horarios disponibles
    inputFecha.addEventListener("change", validarFechaYCargarHorarios)
    selectBarbero.addEventListener("change", validarFechaYCargarHorarios)
  
    // Evento: Actualizar resumen al cambiar cualquier campo
    selectServicio.addEventListener("change", actualizarResumen)
    selectHora.addEventListener("change", actualizarResumen)
  
    // Evento: Validar que no sea domingo
    inputFecha.addEventListener("change", function () {
      const fecha = new Date(this.value + "T00:00:00")
      if (fecha.getDay() === 0) {
        mostrarMensaje("No se trabaja los domingos. Selecciona otro día.", "error")
        this.value = ""
        selectHora.disabled = true
        selectHora.innerHTML = '<option value="">Primero selecciona fecha y barbero</option>'
      }
    })
  
    // Evento: Enviar formulario
    formCita.addEventListener("submit", (e) => {
      e.preventDefault()
      agendarCita()
    })
  
    // Función: Cargar barberos desde la BD
    function cargarBarberos() {
      fetch("../php/barberos_get.php")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            selectBarbero.innerHTML = '<option value="">Selecciona un barbero...</option>'
            data.barberos.forEach((barbero) => {
              const option = document.createElement("option")
              option.value = barbero.id_usuario
              option.textContent = barbero.nombre
              selectBarbero.appendChild(option)
            })
          } else {
            selectBarbero.innerHTML = '<option value="">Error al cargar barberos</option>'
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          selectBarbero.innerHTML = '<option value="">Error de conexión</option>'
        })
    }
  
    // Función: Validar fecha y cargar horarios
    function validarFechaYCargarHorarios() {
      const fecha = inputFecha.value
      const barberoId = selectBarbero.value
  
      if (fecha && barberoId) {
        cargarHorariosDisponibles(barberoId, fecha)
      } else {
        selectHora.disabled = true
        selectHora.innerHTML = '<option value="">Primero selecciona fecha y barbero</option>'
      }
      actualizarResumen()
    }
  
    // Función: Cargar horarios disponibles
    function cargarHorariosDisponibles(barberoId, fecha) {
      selectHora.disabled = true
      selectHora.innerHTML = '<option value="">Cargando horarios...</option>'
  
      fetch(`../php/horarios_disponibles.php?barbero=${barberoId}&fecha=${fecha}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            selectHora.innerHTML = '<option value="">Selecciona un horario...</option>'
  
            if (data.horarios.length === 0) {
              selectHora.innerHTML = '<option value="">No hay horarios disponibles</option>'
              return
            }
  
            data.horarios.forEach((horario) => {
              const option = document.createElement("option")
              option.value = horario
              option.textContent = formatearHora(horario)
              selectHora.appendChild(option)
            })
            selectHora.disabled = false
          } else {
            selectHora.innerHTML = '<option value="">Error al cargar horarios</option>'
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          selectHora.innerHTML = '<option value="">Error de conexión</option>'
        })
    }
  
    // Función: Formatear hora (24h a 12h)
    function formatearHora(hora24) {
      const [hora, minutos] = hora24.split(":")
      const horaNum = Number.parseInt(hora)
      const ampm = horaNum >= 12 ? "PM" : "AM"
      const hora12 = horaNum % 12 || 12
      return `${hora12}:${minutos} ${ampm}`
    }
  
    // Función: Actualizar resumen de la cita
    function actualizarResumen() {
      const barberoText = selectBarbero.options[selectBarbero.selectedIndex]?.text || "-"
      const servicioText = selectServicio.options[selectServicio.selectedIndex]?.text || "-"
      const fecha = inputFecha.value
      const horaText = selectHora.options[selectHora.selectedIndex]?.text || "-"
  
      document.getElementById("resumen-barbero").textContent =
        barberoText !== "Selecciona un barbero..." ? barberoText : "-"
      document.getElementById("resumen-servicio").textContent =
        servicioText !== "Selecciona un servicio..." ? servicioText.split(" - ")[0] : "-"
      document.getElementById("resumen-fecha").textContent = fecha ? formatearFecha(fecha) : "-"
      document.getElementById("resumen-hora").textContent = horaText !== "Selecciona un horario..." ? horaText : "-"
  
      // Mostrar resumen si hay datos
      if (selectBarbero.value || selectServicio.value || fecha || selectHora.value) {
        resumenCita.style.display = "block"
      }
    }
  
    // Función: Formatear fecha
    function formatearFecha(fechaStr) {
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ]
  
      const fecha = new Date(fechaStr + "T00:00:00")
      return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`
    }
  
    // Función: Agendar cita
    function agendarCita() {
      const usuario = JSON.parse(localStorage.getItem("usuario"))
  
      if (!usuario) {
        mostrarMensaje("Debes iniciar sesión para agendar una cita.", "error")
        setTimeout(() => {
          window.location.href = "login.html"
        }, 2000)
        return
      }
  
      const datos = {
        id_cliente: usuario.id_usuario,
        id_barbero: selectBarbero.value,
        fecha: inputFecha.value,
        hora: selectHora.value,
        servicio: selectServicio.value,
      }
  
      // Validar campos
      if (!datos.id_barbero || !datos.fecha || !datos.hora || !datos.servicio) {
        mostrarMensaje("Por favor completa todos los campos.", "error")
        return
      }
  
      // Deshabilitar botón mientras se procesa
      const btnAgendar = document.getElementById("btn-agendar")
      btnAgendar.disabled = true
      btnAgendar.textContent = "Procesando..."
  
      fetch("../php/citas_crear.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            mostrarMensaje("¡Cita agendada con éxito! Te esperamos.", "success")
            formCita.reset()
            resumenCita.style.display = "none"
            selectHora.disabled = true
            selectHora.innerHTML = '<option value="">Primero selecciona fecha y barbero</option>'
  
            // Recargar lista de citas
            if (usuario) {
              cargarMisCitas(usuario.id_usuario)
            }
          } else {
            mostrarMensaje(data.mensaje || "Error al agendar la cita.", "error")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          mostrarMensaje("Error de conexión. Intenta de nuevo.", "error")
        })
        .finally(() => {
          btnAgendar.disabled = false
          btnAgendar.textContent = "Confirmar Cita"
        })
    }
  
    // Función: Cargar mis citas
    function cargarMisCitas(idCliente) {
      const listaCitas = document.getElementById("lista-mis-citas")
  
      fetch(`../php/citas_cliente_get.php?id_cliente=${idCliente}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.citas.length > 0) {
            listaCitas.innerHTML = data.citas
              .map(
                (cita) => `
                          <div class="cita-card ${cita.estado}">
                              <div class="cita-info">
                                  <h4>${cita.servicio}</h4>
                                  <p><strong>Barbero:</strong> ${cita.nombre_barbero}</p>
                                  <p><strong>Fecha:</strong> ${formatearFecha(cita.fecha)}</p>
                                  <p><strong>Hora:</strong> ${formatearHora(cita.hora)}</p>
                              </div>
                              <div class="cita-estado">
                                  <span class="estado-badge ${cita.estado}">${cita.estado}</span>
                                  ${
                                    cita.estado === "pendiente"
                                      ? `<button class="btn-cancelar" onclick="cancelarCita(${cita.id_cita})">Cancelar</button>`
                                      : ""
                                  }
                              </div>
                          </div>
                      `,
              )
              .join("")
          } else {
            listaCitas.innerHTML = '<p class="no-citas">No tienes citas agendadas.</p>'
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          listaCitas.innerHTML = "<p>Error al cargar tus citas.</p>"
        })
    }
  
    // Función: Mostrar mensaje
    function mostrarMensaje(texto, tipo) {
      mensajeCita.textContent = texto
      mensajeCita.className = `mensaje-form ${tipo}`
      mensajeCita.style.display = "block"
  
      setTimeout(() => {
        mensajeCita.style.display = "none"
      }, 5000)
    }
  })
  
  // Función global: Cancelar cita
  function cancelarCita(idCita) {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      return
    }
  
    fetch("../php/citas_cancelar.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_cita: idCita }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Cita cancelada exitosamente.")
          location.reload()
        } else {
          alert(data.mensaje || "Error al cancelar la cita.")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error de conexión.")
      })
  }
  