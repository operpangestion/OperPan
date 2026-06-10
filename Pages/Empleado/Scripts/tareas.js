// ============================================================
// SISTEMA DE GESTIÓN DE TAREAS - OPERPAN (EMPLEADO)
// Versión con detalle modal, registro de ejecución y evidencias
// ============================================================

const empleadoActual = {
    id: "EMP-2024-156",
    nombre: "EDDIER PAZ PARDO",
    turno: "Mañana (6am - 2pm)"
};

const STORAGE_TASKS = "operpan_tareas";
const STORAGE_HISTORY = "operpan_tareas_historial";

// Inicializar tareas de ejemplo con campos extendidos para ejecución
function inicializarTareas() {
    const stored = localStorage.getItem(STORAGE_TASKS);
    if (!stored) {
        const sample = [
            { id: "t1", empleadoId: "EMP-2024-156", titulo: "Preparar masa de pan francés", descripcion: "Realizar la mezcla y amasado según receta estándar", turno: "Mañana (6am - 2pm)", fechaLimite: "2025-04-16", estado: "pendiente", prioridad: "alta", fechaAsignacion: "2025-04-14T08:00:00", ultimaModificacion: "2025-04-14T08:00:00", observacionesEjecucion: "", evidenciaEjecucion: "", fechaFinalizacion: null, historialCambios: [] },
            { id: "t2", empleadoId: "EMP-2024-156", titulo: "Revisar inventario de hornos", descripcion: "Verificar limpieza y funcionamiento de los hornos antes del turno", turno: "Mañana (6am - 2pm)", fechaLimite: "2025-04-15", estado: "progreso", prioridad: "media", fechaAsignacion: "2025-04-13T09:30:00", ultimaModificacion: "2025-04-14T07:15:00", observacionesEjecucion: "", evidenciaEjecucion: "", fechaFinalizacion: null, historialCambios: [] },
            { id: "t3", empleadoId: "EMP-2024-156", titulo: "Empaquetar pedidos de mostrador", descripcion: "Organizar pedidos para clientes habituales", turno: "Mañana (6am - 2pm)", fechaLimite: "2025-04-12", estado: "finalizada", prioridad: "baja", fechaAsignacion: "2025-04-10T10:00:00", ultimaModificacion: "2025-04-12T13:45:00", observacionesEjecucion: "Se empaquetaron 25 pedidos según lista", evidenciaEjecucion: "evidencia_pedidos.jpg", fechaFinalizacion: "2025-04-12T13:45:00", historialCambios: [] },
            { id: "t4", empleadoId: "EMP-2024-156", titulo: "Limpieza de área de amasado", descripcion: "Desinfección completa de superficies y utensilios", turno: "Mañana (6am - 2pm)", fechaLimite: "2025-04-14", estado: "pendiente", prioridad: "alta", fechaAsignacion: "2025-04-14T06:00:00", ultimaModificacion: "2025-04-14T06:00:00", observacionesEjecucion: "", evidenciaEjecucion: "", fechaFinalizacion: null, historialCambios: [] },
            { id: "t5", empleadoId: "EMP-2024-156", titulo: "Capacitación en normas de higiene", descripcion: "Ver video de inducción y firmar acta", turno: "Mañana (6am - 2pm)", fechaLimite: "2025-04-18", estado: "progreso", prioridad: "media", fechaAsignacion: "2025-04-11T11:00:00", ultimaModificacion: "2025-04-13T09:00:00", observacionesEjecucion: "", evidenciaEjecucion: "", fechaFinalizacion: null, historialCambios: [] }
        ];
        localStorage.setItem(STORAGE_TASKS, JSON.stringify(sample));
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify([]));
        return sample;
    }
    return JSON.parse(stored);
}

let tareas = inicializarTareas();
let historialAcciones = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");

function guardarTareas() {
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(tareas));
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(historialAcciones));
}

// Registrar acción en el historial (trazabilidad)
function registrarHistorial(tareaId, accion, detalle) {
    const registro = {
        tareaId,
        empleadoId: empleadoActual.id,
        empleadoNombre: empleadoActual.nombre,
        accion,
        detalle,
        fecha: new Date().toISOString()
    };
    historialAcciones.unshift(registro);
    if (historialAcciones.length > 200) historialAcciones.pop();
    guardarTareas();
    console.log("[TRAZABILIDAD]", registro);
}

// Notificación simulada (toast)
function mostrarNotificacion(mensaje, tipo = "info") {
    const toast = document.getElementById("liveToast");
    const msgSpan = document.getElementById("toastMsg");
    msgSpan.innerText = mensaje;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 3500);
    if (Notification.permission === "granted" && tipo === "info") {
        new Notification("OperPan - Tareas", { body: mensaje });
    }
}

if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
}

// Variables para el modal y tarea seleccionada
let currentTaskId = null;
const taskModal = new bootstrap.Modal(document.getElementById("taskDetailModal"));

// Abrir modal con detalle de tarea
function verDetalleTarea(tareaId) {
    const tarea = tareas.find(t => t.id === tareaId && t.empleadoId === empleadoActual.id);
    if (!tarea) return;

    currentTaskId = tareaId;
    // Llenar información general
    document.getElementById("modalTitulo").innerText = tarea.titulo;
    document.getElementById("modalDescripcion").innerText = tarea.descripcion || "Sin descripción";
    document.getElementById("modalFechaAsignacion").innerText = new Date(tarea.fechaAsignacion).toLocaleDateString();
    document.getElementById("modalFechaLimite").innerText = tarea.fechaLimite;

    // Prioridad
    const prioridadBadge = document.getElementById("modalPrioridadBadge");
    if (tarea.prioridad === "alta") prioridadBadge.innerHTML = '<span class="badge bg-danger">Alta prioridad</span>';
    else if (tarea.prioridad === "media") prioridadBadge.innerHTML = '<span class="badge bg-warning text-dark">Media prioridad</span>';
    else prioridadBadge.innerHTML = '<span class="badge bg-secondary">Baja prioridad</span>';

    // Estado
    const estadoSpan = document.getElementById("modalEstadoBadge");
    let estadoClass = "";
    let estadoTexto = "";
    switch (tarea.estado) {
        case "pendiente": estadoClass = "badge-pending"; estadoTexto = "Pendiente"; break;
        case "progreso": estadoClass = "badge-progress"; estadoTexto = "En progreso"; break;
        case "finalizada": estadoClass = "badge-completed"; estadoTexto = "Finalizada"; break;
        default: estadoClass = "badge-secondary"; estadoTexto = tarea.estado;
    }
    estadoSpan.className = `badge ${estadoClass}`;
    estadoSpan.innerText = estadoTexto;

    // Mostrar/ocultar secciones según estado
    const ejecucionSection = document.getElementById("ejecucionSection");
    const ejecucionPrevSection = document.getElementById("ejecucionPrevSection");
    if (tarea.estado === "finalizada") {
        ejecucionSection.style.display = "none";
        ejecucionPrevSection.style.display = "block";
        document.getElementById("prevObservaciones").innerText = tarea.observacionesEjecucion || "No se registraron observaciones.";
        const evidenciaLink = document.getElementById("prevEvidencia");
        if (tarea.evidenciaEjecucion) {
            evidenciaLink.innerHTML = `<a href="#" class="text-danger" onclick="alert('Simulación: ${tarea.evidenciaEjecucion}')"><i class="bi bi-paperclip"></i> ${tarea.evidenciaEjecucion}</a>`;
        } else {
            evidenciaLink.innerHTML = "<span class='text-muted'>No se adjuntó evidencia.</span>";
        }
        document.getElementById("prevFechaFinalizacion").innerText = tarea.fechaFinalizacion ? new Date(tarea.fechaFinalizacion).toLocaleString() : "No registrada";
    } else {
        ejecucionSection.style.display = "block";
        ejecucionPrevSection.style.display = "none";
        // Limpiar campos del formulario de ejecución
        document.getElementById("ejecucionObservaciones").value = "";
        document.getElementById("ejecucionEvidencia").value = "";
    }

    taskModal.show();
}

// Finalizar tarea desde el modal
async function finalizarTarea() {
    if (!currentTaskId) return;
    const tarea = tareas.find(t => t.id === currentTaskId);
    if (!tarea || tarea.estado === "finalizada") {
        mostrarNotificacion("La tarea ya está finalizada.", "error");
        taskModal.hide();
        return;
    }

    const observaciones = document.getElementById("ejecucionObservaciones").value.trim();
    if (!observaciones) {
        mostrarNotificacion("Debe ingresar observaciones de ejecución antes de finalizar.", "error");
        document.getElementById("ejecucionObservaciones").classList.add("is-invalid");
        return;
    }
    document.getElementById("ejecucionObservaciones").classList.remove("is-invalid");

    // Procesar evidencia (simulación)
    const fileInput = document.getElementById("ejecucionEvidencia");
    let evidenciaNombre = "";
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            mostrarNotificacion("Formato no permitido. Use JPG, PNG o PDF.", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            mostrarNotificacion("El archivo no debe superar 5MB.", "error");
            return;
        }
        evidenciaNombre = file.name; // Simulación: solo nombre
        // En un entorno real aquí se subiría el archivo a un servidor
    }

    // Actualizar tarea
    tarea.estado = "finalizada";
    tarea.fechaFinalizacion = new Date().toISOString();
    tarea.observacionesEjecucion = observaciones;
    tarea.evidenciaEjecucion = evidenciaNombre;
    tarea.ultimaModificacion = new Date().toISOString();
    guardarTareas();

    registrarHistorial(tarea.id, "finalizada", `Empleado finalizó la tarea. Observaciones: ${observaciones.substring(0, 100)}${evidenciaNombre ? " - Evidencia: " + evidenciaNombre : ""}`);

    mostrarNotificacion(`✅ Tarea "${tarea.titulo}" finalizada correctamente.`, "success");
    taskModal.hide();
    renderizarTareas(filtroActual);
    actualizarEstadisticas();
}

// Filtrar tareas del empleado actual
let filtroActual = "todas";

function filtrarTareas() {
    let misTareas = tareas.filter(t => t.empleadoId === empleadoActual.id);
    const hoy = new Date().toISOString().split('T')[0];
    misTareas.forEach(t => {
        if (t.estado !== "finalizada" && t.fechaLimite < hoy && !t.vencida) {
            t.vencida = true;
        } else if (t.estado === "finalizada") {
            t.vencida = false;
        }
    });

    if (filtroActual === "todas") return misTareas;
    if (filtroActual === "pendiente") return misTareas.filter(t => t.estado === "pendiente" && !t.vencida);
    if (filtroActual === "progreso") return misTareas.filter(t => t.estado === "progreso");
    if (filtroActual === "finalizada") return misTareas.filter(t => t.estado === "finalizada");
    return misTareas;
}

function actualizarEstadisticas() {
    const misTareas = tareas.filter(t => t.empleadoId === empleadoActual.id);
    const pendientes = misTareas.filter(t => t.estado === "pendiente").length;
    const progreso = misTareas.filter(t => t.estado === "progreso").length;
    const finalizadas = misTareas.filter(t => t.estado === "finalizada").length;
    const hoy = new Date().toISOString().split('T')[0];
    const vencidas = misTareas.filter(t => t.estado !== "finalizada" && t.fechaLimite < hoy).length;
    document.getElementById("pendientesCount").innerText = pendientes;
    document.getElementById("progresoCount").innerText = progreso;
    document.getElementById("finalizadasCount").innerText = finalizadas;
    document.getElementById("vencidasCount").innerText = vencidas;
}

function renderizarTareas(filtro) {
    const container = document.getElementById("tasksContainer");
    if (!container) return;
    filtroActual = filtro;
    const tareasFiltradas = filtrarTareas();

    if (tareasFiltradas.length === 0) {
        container.innerHTML = `<div class="alert alert-light text-center">No hay tareas con el filtro seleccionado.</div>`;
        return;
    }

    let html = '';
    tareasFiltradas.forEach(t => {
        let badgeClass = "";
        let estadoTexto = "";
        switch (t.estado) {
            case "pendiente": badgeClass = "badge-pending"; estadoTexto = "Pendiente"; break;
            case "progreso": badgeClass = "badge-progress"; estadoTexto = "En progreso"; break;
            case "finalizada": badgeClass = "badge-completed"; estadoTexto = "Finalizada"; break;
            default: badgeClass = "badge-secondary";
        }
        const vencida = (t.estado !== "finalizada" && t.fechaLimite < new Date().toISOString().split('T')[0]);
        if (vencida) {
            badgeClass = "badge-expired";
            estadoTexto = "Vencida";
        }
        const prioridadIcon = t.prioridad === "alta" ? '<i class="bi bi-flag-fill text-danger"></i>' : (t.prioridad === "media" ? '<i class="bi bi-flag text-warning"></i>' : '<i class="bi bi-flag text-secondary"></i>');

        html += `
        <div class="task-card">
            <div class="d-flex justify-content-between align-items-start flex-wrap">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                        <h5 class="mb-0">${t.titulo}</h5>
                        ${prioridadIcon}
                        <span class="badge ${badgeClass}">${estadoTexto}</span>
                    </div>
                    <p class="text-muted small mb-2">${t.descripcion || "Sin descripción"}</p>
                    <div class="d-flex gap-3 flex-wrap small text-muted">
                        <span><i class="bi bi-calendar-event"></i> Límite: ${t.fechaLimite}</span>
                        <span><i class="bi bi-clock-history"></i> Asignada: ${new Date(t.fechaAsignacion).toLocaleDateString()}</span>
                    </div>
                </div>
                <div id="taskActions" class="mt-2 mt-sm-0">
                    <button class="btn-action" onclick="verDetalleTarea('${t.id}')"><i class="bi bi-eye"></i> Ver detalle</button>
                </div>
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
    actualizarEstadisticas();
}

// Filtros UI
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        const filtro = this.getAttribute("data-filter");
        renderizarTareas(filtro);
    });
});

// Cierre de sesión
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    mostrarNotificacion("Cerrando sesión...", "info");
    setTimeout(() => window.location.href = "../../login.html", 800);
});

// Sidebar toggle móvil
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
if (menuToggle) {
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("active"));
}

// Evento del botón finalizar en modal
document.getElementById("btnFinalizarTarea")?.addEventListener("click", finalizarTarea);

// Inicializar
renderizarTareas("todas");

// Simulación de recordatorio (opcional)
setTimeout(() => {
    const tareasProximas = tareas.filter(t => t.empleadoId === empleadoActual.id && t.estado !== "finalizada");
    const hoy = new Date();
    tareasProximas.forEach(t => {
        const limite = new Date(t.fechaLimite);
        const diffDays = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
        if (diffDays === 1 && t.estado !== "finalizada") {
            mostrarNotificacion(`📌 Recordatorio: La tarea "${t.titulo}" vence mañana.`, "info");
        }
    });
}, 2000);