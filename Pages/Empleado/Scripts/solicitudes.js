/* ============================================================
   SISTEMA DE GESTIÓN DE SOLICITUDES 
   (Permisos + Incapacidades + Cambio Turno + Vacaciones + Certificados)
   
   Versión con formularios dinámicos y validaciones por tipo
   ============================================================ */

const empleadoActual = {
    id: "EMP-2024-156",
    nombre: "EDDIER PAZ PARDO",
    rol: "empleado"
};

const STORAGE_KEY = "operpan_solicitudes";

// Función para migrar solicitudes antiguas a nuevo formato estructurado
function migrarSolicitudesAntiguas(solicitudes) {
    return solicitudes.map(sol => {
        // Si ya tiene los campos específicos, no migrar
        if (sol.datosEspecificos) return sol;
        
        let datosEspecificos = {};
        switch (sol.tipo) {
            case "permiso":
                datosEspecificos = {
                    tipo_permiso: "otro",
                    hora_salida: "",
                    hora_regreso: "",
                    motivo: sol.motivo || ""
                };
                break;
            case "incapacidad":
                datosEspecificos = {
                    entidad: "",
                    numero_incapacidad: "",
                    observaciones: sol.motivo || ""
                };
                break;
            case "cambio_turno":
                datosEspecificos = {
                    turno_actual: "",
                    turno_solicitado: "",
                    motivo: sol.motivo || "",
                    observaciones: ""
                };
                break;
            case "vacaciones":
                datosEspecificos = {
                    direccion: "",
                    telefono: "",
                    observaciones: sol.motivo || ""
                };
                break;
            case "certificados":
                datosEspecificos = {
                    tipo_certificado: "laboral",
                    dirigido_a: "",
                    finalidad: "",
                    periodo: ""
                };
                break;
            default:
                datosEspecificos = {};
        }
        return {
            ...sol,
            datosEspecificos
        };
    });
}

function inicializarSolicitudes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        const sample = [
            { id: "sol1", empleadoId: "EMP-2024-156", tipo: "permiso", fechaInicio: "2025-04-10", fechaFin: "2025-04-10", estado: "aprobada", justificacionRechazo: "", fechaCreacion: "2025-04-01T10:30:00", fechaModificacion: "2025-04-02T09:00:00", adjunto: "", datosEspecificos: { tipo_permiso: "personal", hora_salida: "09:00", hora_regreso: "12:00", motivo: "Cita médica" } },
            { id: "sol2", empleadoId: "EMP-2024-156", tipo: "incapacidad", fechaInicio: "2025-04-15", fechaFin: "2025-04-17", estado: "pendiente", justificacionRechazo: "", fechaCreacion: "2025-04-14T08:15:00", fechaModificacion: "2025-04-14T08:15:00", adjunto: "incapacidad_medica.pdf", datosEspecificos: { entidad: "EPS Sura", numero_incapacidad: "INC-12345", observaciones: "Gripe severa" } },
            { id: "sol3", empleadoId: "EMP-2024-156", tipo: "vacaciones", fechaInicio: "2025-05-01", fechaFin: "2025-05-15", estado: "pendiente", justificacionRechazo: "", fechaCreacion: "2025-04-05T11:45:00", fechaModificacion: "2025-04-05T11:45:00", adjunto: "", datosEspecificos: { direccion: "Calle 123", telefono: "3001234567", observaciones: "Descanso anual" } }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
        return sample;
    }
    let parsed = JSON.parse(stored);
    return migrarSolicitudesAntiguas(parsed);
}

let solicitudes = inicializarSolicitudes();

function guardarSolicitudes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes));
}

function mostrarMensaje(mensaje, tipo = "success") {
    const toast = document.getElementById("liveToast");
    const msgSpan = document.getElementById("toastMsg");
    msgSpan.innerText = mensaje;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
}

let filtroActual = "todas";

function renderizarSolicitudes() {
    const container = document.getElementById("solicitudesContainer");
    if (!container) return;

    const misSolicitudes = solicitudes.filter(s => s.empleadoId === empleadoActual.id);
    let filtradas = misSolicitudes;
    if (filtroActual !== "todas") {
        filtradas = misSolicitudes.filter(s => s.estado === filtroActual);
    }

    if (filtradas.length === 0) {
        container.innerHTML = `<div class="alert alert-light text-center">No hay solicitudes ${filtroActual !== 'todas' ? 'con estado ' + filtroActual : ''}.</div>`;
        return;
    }

    filtradas.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    let html = '';
    filtradas.forEach(sol => {
        let badgeClass = "";
        let estadoTexto = "";
        if (sol.estado === "pendiente") { badgeClass = "badge-pending"; estadoTexto = "Pendiente"; }
        else if (sol.estado === "aprobada") { badgeClass = "badge-approved"; estadoTexto = "Aprobada"; }
        else { badgeClass = "badge-rejected"; estadoTexto = "Rechazada"; }

        const tipoMostrar = {
            permiso: "Permiso", incapacidad: "Incapacidad", cambio_turno: "Cambio de turno", vacaciones: "Vacaciones", certificados: "Certificado"
        }[sol.tipo] || sol.tipo;

        let detalle = "";
        if (sol.tipo === "permiso" && sol.datosEspecificos) {
            detalle = `<small class="text-muted">${sol.datosEspecificos.tipo_permiso} · ${sol.fechaInicio} ${sol.datosEspecificos.hora_salida} a ${sol.datosEspecificos.hora_regreso}</small>`;
        } else if (sol.tipo === "incapacidad" && sol.datosEspecificos) {
            detalle = `<small class="text-muted">${sol.datosEspecificos.entidad} · N° ${sol.datosEspecificos.numero_incapacidad}</small>`;
        } else if (sol.tipo === "cambio_turno" && sol.datosEspecificos) {
            detalle = `<small class="text-muted">${sol.datosEspecificos.turno_actual} → ${sol.datosEspecificos.turno_solicitado}</small>`;
        } else if (sol.tipo === "certificados" && sol.datosEspecificos) {
            detalle = `<small class="text-muted">${sol.datosEspecificos.tipo_certificado} · Dirigido a: ${sol.datosEspecificos.dirigido_a}</small>`;
        } else {
            detalle = `<small class="text-muted">${sol.fechaInicio} → ${sol.fechaFin}</small>`;
        }

        html += `
        <div class="request-card">
            <div class="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                    <h5 class="mb-1">${tipoMostrar}</h5>
                    ${detalle}
                    <p class="mb-2 mt-2">${sol.datosEspecificos?.motivo || sol.datosEspecificos?.observaciones || "Sin descripción"}</p>
                    ${sol.adjunto ? `<span class="badge bg-light text-dark"><i class="bi bi-paperclip"></i> ${sol.adjunto}</span>` : ''}
                    ${sol.justificacionRechazo ? `<div class="small text-danger mt-2"><i class="bi bi-chat-dots"></i> Rechazo: ${sol.justificacionRechazo}</div>` : ''}
                    <div class="small text-muted mt-2">Creada: ${new Date(sol.fechaCreacion).toLocaleString()}</div>
                </div>
                <div>
                    <span class="badge ${badgeClass}">${estadoTexto}</span>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

function generarId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}

function calcularDias(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin - inicio);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// Mostrar/ocultar formularios dinámicos
const tipoSelect = document.getElementById("tipoSolicitud");
const forms = {
    permiso: document.getElementById("formPermiso"),
    incapacidad: document.getElementById("formIncapacidad"),
    cambio_turno: document.getElementById("formCambioTurno"),
    vacaciones: document.getElementById("formVacaciones"),
    certificados: document.getElementById("formCertificados")
};

function mostrarFormularioSegunTipo() {
    const tipo = tipoSelect.value;
    Object.keys(forms).forEach(key => {
        if (forms[key]) forms[key].style.display = "none";
    });
    if (tipo && forms[tipo]) {
        forms[tipo].style.display = "block";
    }
}

// Actualizar días calculados para incapacidad y vacaciones
function actualizarDiasIncapacidad() {
    const inicio = document.getElementById("incapacidadFechaInicio").value;
    const fin = document.getElementById("incapacidadFechaFin").value;
    const diasInput = document.getElementById("incapacidadDias");
    if (inicio && fin) diasInput.value = calcularDias(inicio, fin);
    else diasInput.value = "";
}

function actualizarDiasVacaciones() {
    const inicio = document.getElementById("vacacionesFechaInicio").value;
    const fin = document.getElementById("vacacionesFechaFin").value;
    const diasInput = document.getElementById("vacacionesDias");
    if (inicio && fin) diasInput.value = calcularDias(inicio, fin);
    else diasInput.value = "";
}

// Certificados campos dinámicos
const certTipoSelect = document.getElementById("certificadoTipo");
const finalidadGroup = document.getElementById("certificadoFinalidadGroup");
const periodoGroup = document.getElementById("certificadoPeriodoGroup");

function actualizarCamposCertificado() {
    const tipo = certTipoSelect.value;
    finalidadGroup.style.display = "none";
    periodoGroup.style.display = "none";
    if (tipo === "laboral") finalidadGroup.style.display = "block";
    if (tipo === "ingresos") periodoGroup.style.display = "block";
}

tipoSelect.addEventListener("change", mostrarFormularioSegunTipo);
document.getElementById("incapacidadFechaInicio").addEventListener("change", actualizarDiasIncapacidad);
document.getElementById("incapacidadFechaFin").addEventListener("change", actualizarDiasIncapacidad);
document.getElementById("vacacionesFechaInicio").addEventListener("change", actualizarDiasVacaciones);
document.getElementById("vacacionesFechaFin").addEventListener("change", actualizarDiasVacaciones);
if (certTipoSelect) certTipoSelect.addEventListener("change", actualizarCamposCertificado);

// Envío del formulario
document.getElementById("solicitudForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const tipo = tipoSelect.value;
    if (!tipo) {
        mostrarMensaje("Seleccione un tipo de solicitud.", "error");
        return;
    }

    let nuevaSolicitud = {
        id: generarId(),
        empleadoId: empleadoActual.id,
        tipo: tipo,
        estado: "pendiente",
        justificacionRechazo: "",
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        adjunto: "",
        datosEspecificos: {}
    };

    let valid = true;

    if (tipo === "permiso") {
        const tipoPermiso = document.getElementById("permisoTipo").value;
        const fechaInicio = document.getElementById("permisoFechaInicio").value;
        const fechaFin = document.getElementById("permisoFechaFin").value;
        const horaSalida = document.getElementById("permisoHoraSalida").value;
        const horaRegreso = document.getElementById("permisoHoraRegreso").value;
        const motivo = document.getElementById("permisoMotivo").value;
        const adjuntoFile = document.getElementById("permisoAdjunto").files[0];
        if (!fechaInicio || !fechaFin || !horaSalida || !horaRegreso) valid = false;
        if (valid) {
            nuevaSolicitud.fechaInicio = fechaInicio;
            nuevaSolicitud.fechaFin = fechaFin;
            nuevaSolicitud.adjunto = adjuntoFile ? adjuntoFile.name : "";
            nuevaSolicitud.datosEspecificos = { tipo_permiso: tipoPermiso, hora_salida: horaSalida, hora_regreso: horaRegreso, motivo };
        } else mostrarMensaje("Complete todos los campos obligatorios del permiso.", "error");
    }
    else if (tipo === "incapacidad") {
        const fechaInicio = document.getElementById("incapacidadFechaInicio").value;
        const fechaFin = document.getElementById("incapacidadFechaFin").value;
        const entidad = document.getElementById("incapacidadEntidad").value;
        const numero = document.getElementById("incapacidadNumero").value;
        const observaciones = document.getElementById("incapacidadObservaciones").value;
        const adjuntoFile = document.getElementById("incapacidadAdjunto").files[0];
        if (!fechaInicio || !fechaFin || !entidad || !numero) valid = false;
        if (!adjuntoFile) { valid = false; mostrarMensaje("Debe adjuntar el soporte médico (obligatorio).", "error"); }
        if (valid) {
            nuevaSolicitud.fechaInicio = fechaInicio;
            nuevaSolicitud.fechaFin = fechaFin;
            nuevaSolicitud.adjunto = adjuntoFile.name;
            nuevaSolicitud.datosEspecificos = { entidad, numero_incapacidad: numero, observaciones };
        } else if (!valid && !adjuntoFile) {} else mostrarMensaje("Complete todos los campos obligatorios de la incapacidad.", "error");
    }
    else if (tipo === "cambio_turno") {
        const fecha = document.getElementById("cambioFecha").value;
        const turnoActual = document.getElementById("cambioTurnoActual").value;
        const turnoSolicitado = document.getElementById("cambioTurnoSolicitado").value;
        const motivo = document.getElementById("cambioMotivo").value;
        const observaciones = document.getElementById("cambioObservaciones").value;
        if (!fecha || !turnoActual || !turnoSolicitado) valid = false;
        if (valid) {
            nuevaSolicitud.fechaInicio = fecha;
            nuevaSolicitud.fechaFin = fecha;
            nuevaSolicitud.datosEspecificos = { turno_actual: turnoActual, turno_solicitado: turnoSolicitado, motivo, observaciones };
        } else mostrarMensaje("Complete los campos obligatorios del cambio de turno.", "error");
    }
    else if (tipo === "vacaciones") {
        const fechaInicio = document.getElementById("vacacionesFechaInicio").value;
        const fechaFin = document.getElementById("vacacionesFechaFin").value;
        const direccion = document.getElementById("vacacionesDireccion").value;
        const telefono = document.getElementById("vacacionesTelefono").value;
        const observaciones = document.getElementById("vacacionesObservaciones").value;
        if (!fechaInicio || !fechaFin || !direccion || !telefono) valid = false;
        if (valid) {
            nuevaSolicitud.fechaInicio = fechaInicio;
            nuevaSolicitud.fechaFin = fechaFin;
            nuevaSolicitud.datosEspecificos = { direccion, telefono, observaciones };
        } else mostrarMensaje("Complete todos los campos obligatorios de vacaciones.", "error");
    }
    else if (tipo === "certificados") {
        const tipoCert = document.getElementById("certificadoTipo").value;
        const dirigido = document.getElementById("certificadoDirigido").value;
        const finalidad = document.getElementById("certificadoFinalidad").value;
        const periodo = document.getElementById("certificadoPeriodo").value;
        if (!dirigido) valid = false;
        if (valid) {
            nuevaSolicitud.estado = "aprobada"; // Auto-aprobado
            nuevaSolicitud.fechaInicio = new Date().toISOString().split('T')[0];
            nuevaSolicitud.fechaFin = nuevaSolicitud.fechaInicio;
            nuevaSolicitud.datosEspecificos = { tipo_certificado: tipoCert, dirigido_a: dirigido, finalidad, periodo };
        } else mostrarMensaje("Indique a quién va dirigido el certificado.", "error");
    }

    if (valid) {
        solicitudes.push(nuevaSolicitud);
        guardarSolicitudes();
        renderizarSolicitudes();
        document.getElementById("solicitudForm").reset();
        // Resetear visibilidad
        mostrarFormularioSegunTipo();
        tipoSelect.value = "";
        mostrarFormularioSegunTipo();
        mostrarMensaje("Solicitud enviada correctamente.", "success");
        console.log(`[AUDITORÍA] Empleado ${empleadoActual.nombre} creó solicitud ${nuevaSolicitud.id} tipo ${tipo}`);
    }
});

// Filtros
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        filtroActual = this.getAttribute("data-filter");
        renderizarSolicitudes();
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active", "btn-primary"));
        this.classList.add("active", "btn-primary");
        this.classList.remove("btn-outline-secondary");
    });
});

// Cierre sesión
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    mostrarMensaje("Cerrando sesión...", "info");
    setTimeout(() => window.location.href = "../../login.html", 800);
});

// Sidebar toggle
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
if (menuToggle) {
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("active"));
}

renderizarSolicitudes();
window.solicitudes = solicitudes;