
// ============================================================
// MÓDULO DE REPORTES - OPERPAN (ADMIN + EMPLEADO)
// Cumple: comunicación interna, trazabilidad, persistencia
// ============================================================

const STORAGE_REPORTES = "operpan_reportes";
const STORAGE_AUDIT = "operpan_audit_reportes";

let reportes = [];
let auditLog = [];
let empleadoActual = { id: "EMP-2024-156", nombre: "Eddier Paz Pardo", rol: "empleado" };

function inicializarDatos() {
    const stored = localStorage.getItem(STORAGE_REPORTES);
    if (!stored) {
        reportes = [
            { id: "r1", empleadoId: "EMP-2024-156", empleadoNombre: "Eddier Paz Pardo", tipo: "daño", asunto: "Horno industrial #3 no enciende", descripcion: "El horno dejó de funcionar a las 8am...", prioridad: "alta", estado: "pendiente", fecha: "2025-04-14T09:30:00", adjunto: "", resolucion: null },
            { id: "r2", empleadoId: "EMP-2024-157", empleadoNombre: "Santiago Muñeton", tipo: "insumos", asunto: "Falta de harina", descripcion: "Stock crítico para mañana", prioridad: "media", estado: "revisado", fecha: "2025-04-13T16:15:00", adjunto: "", resolucion: null }
        ];
        localStorage.setItem(STORAGE_REPORTES, JSON.stringify(reportes));
    } else reportes = JSON.parse(stored);

    const storedAudit = localStorage.getItem(STORAGE_AUDIT);
    auditLog = storedAudit ? JSON.parse(storedAudit) : [];
}

function guardarDatos() {
    localStorage.setItem(STORAGE_REPORTES, JSON.stringify(reportes));
    localStorage.setItem(STORAGE_AUDIT, JSON.stringify(auditLog));
}

function registrarAuditoria(accion, detalles, reporteId) {
    const registro = { fecha: new Date().toISOString(), administrador: "Administrador", accion, detalles, reporteId };
    auditLog.unshift(registro);
    if (auditLog.length > 200) auditLog.pop();
    guardarDatos();
    console.log("[AUDITORÍA REPORTES]", registro);
}

function mostrarMensaje(msg) {
    const toast = document.getElementById("liveToast");
    document.getElementById("toastMsg").innerText = msg;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 3000);
}

function actualizarKPIs() {
    const total = reportes.length;
    const pendientes = reportes.filter(r => r.estado === "pendiente").length;
    const urgentes = reportes.filter(r => r.prioridad === "alta" && r.estado !== "resuelto").length;
    const hoy = new Date().toISOString().split('T')[0];
    const resueltosHoy = reportes.filter(r => r.estado === "resuelto" && r.fecha?.split('T')[0] === hoy).length;
    document.getElementById("totalReportes").innerText = total;
    document.getElementById("pendientesCount").innerText = pendientes;
    document.getElementById("urgentesCount").innerText = urgentes;
    document.getElementById("resueltosHoy").innerText = resueltosHoy;
}

function renderizarMisReportes() {
    const container = document.getElementById("misReportesContainer");
    if (!container) return;
    const misReportes = reportes.filter(r => r.empleadoId === empleadoActual.id).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    if (misReportes.length === 0) { container.innerHTML = '<div class="alert alert-light">No has enviado reportes aún.</div>'; return; }
    let html = "";
    misReportes.forEach(r => {
        let estadoBadge = r.estado === "pendiente" ? 'badge-pending' : (r.estado === "revisado" ? 'badge-review' : 'badge-resolved');
        let estadoText = r.estado === "pendiente" ? "Pendiente" : (r.estado === "revisado" ? "En revisión" : "Resuelto");
        html += `<div class="report-card"><div class="d-flex justify-content-between"><div><strong>${r.asunto}</strong><br><small class="text-muted">${new Date(r.fecha).toLocaleString()}</small><p class="mt-1 small">${r.descripcion.substring(0, 100)}...</p></div><div><span class="badge ${estadoBadge}">${estadoText}</span><br><span class="badge bg-secondary">${r.prioridad}</span></div></div></div>`;
    });
    container.innerHTML = html;
}

function renderizarAdminReportes() {
    const container = document.getElementById("reportesAdminContainer");
    if (!container) return;
    let filtrados = [...reportes];
    const tipo = document.getElementById("filtroTipo")?.value || "todos";
    const estado = document.getElementById("filtroEstado")?.value || "todos";
    const prioridad = document.getElementById("filtroPrioridad")?.value || "todos";
    const busqueda = document.getElementById("buscarReporte")?.value.toLowerCase() || "";

    if (tipo !== "todos") filtrados = filtrados.filter(r => r.tipo === tipo);
    if (estado !== "todos") filtrados = filtrados.filter(r => r.estado === estado);
    if (prioridad !== "todos") filtrados = filtrados.filter(r => r.prioridad === prioridad);
    if (busqueda) filtrados = filtrados.filter(r => r.empleadoNombre.toLowerCase().includes(busqueda) || r.asunto.toLowerCase().includes(busqueda));

    filtrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    if (filtrados.length === 0) { container.innerHTML = '<div class="alert alert-light">No hay reportes con esos filtros.</div>'; return; }

    let html = "";
    filtrados.forEach(r => {
        let prioridadClass = r.prioridad === "alta" ? "priority-high" : (r.prioridad === "media" ? "priority-medium" : "");
        let estadoBadge = r.estado === "pendiente" ? 'badge-pending' : (r.estado === "revisado" ? 'badge-review' : 'badge-resolved');
        html += `<div class="admin-report-card ${prioridadClass}">
        <div class="d-flex justify-content-between flex-wrap"><div><strong>${r.empleadoNombre}</strong> <span class="badge bg-secondary">${r.tipo}</span><h5 class="mt-2">${r.asunto}</h5><p class="small">${r.descripcion.substring(0, 120)}...</p><div><small>📅 ${new Date(r.fecha).toLocaleString()}</small> <span class="badge ${estadoBadge}">${r.estado}</span></div></div><div><button class="btn btn-sm btn-primary verDetalleBtn" data-id="${r.id}"><i class="bi bi-eye"></i> Ver</button></div></div>
      </div>`;
    });
    container.innerHTML = html;
    document.querySelectorAll(".verDetalleBtn").forEach(btn => btn.addEventListener("click", () => verDetalleReporte(btn.dataset.id)));
}

function verDetalleReporte(id) {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) return;
    const modalBody = document.getElementById("modalDetalleBody");
    modalBody.innerHTML = `
      <h5>${reporte.asunto}</h5>
      <p><strong>Empleado:</strong> ${reporte.empleadoNombre}<br><strong>Tipo:</strong> ${reporte.tipo}<br><strong>Prioridad:</strong> ${reporte.prioridad}<br><strong>Estado:</strong> ${reporte.estado}<br><strong>Fecha:</strong> ${new Date(reporte.fecha).toLocaleString()}</p>
      <p><strong>Descripción:</strong><br>${reporte.descripcion}</p>
      ${reporte.resolucion ? `<p><strong>Resolución:</strong> ${reporte.resolucion}</p>` : ''}
    `;
    const modal = new bootstrap.Modal(document.getElementById("detalleModal"));
    modal.show();

    document.getElementById("marcarRevisadoBtn").onclick = () => cambiarEstadoReporte(id, "revisado");
    document.getElementById("marcarResueltoBtn").onclick = () => cambiarEstadoReporte(id, "resuelto");
}

function cambiarEstadoReporte(id, nuevoEstado) {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) return;
    const anterior = reporte.estado;
    reporte.estado = nuevoEstado;
    if (nuevoEstado === "resuelto") reporte.resolucion = `Resuelto por administrador el ${new Date().toLocaleString()}`;
    registrarAuditoria(`Cambiar estado de reporte ${id}`, `De ${anterior} a ${nuevoEstado}`, id);
    mostrarMensaje(`Reporte marcado como ${nuevoEstado}`);
    guardarDatos();
    actualizarKPIs();
    renderizarAdminReportes();
    renderizarMisReportes();
    bootstrap.Modal.getInstance(document.getElementById("detalleModal")).hide();
}

// Enviar nuevo reporte (empleado)
document.getElementById("reporteForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const tipo = document.getElementById("tipoReporte").value;
    const asunto = document.getElementById("asunto").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const prioridad = document.getElementById("prioridadReporte").value;
    if (!tipo || !asunto || !descripcion) { mostrarMensaje("Complete todos los campos obligatorios."); return; }
    const nuevoReporte = {
        id: Date.now().toString(),
        empleadoId: empleadoActual.id,
        empleadoNombre: empleadoActual.nombre,
        tipo,
        asunto,
        descripcion,
        prioridad,
        estado: "pendiente",
        fecha: new Date().toISOString(),
        adjunto: "",
        resolucion: null
    };
    reportes.push(nuevoReporte);
    registrarAuditoria("Crear reporte", `Nuevo reporte: ${asunto}`, nuevoReporte.id);
    mostrarMensaje("Reporte enviado correctamente. Quedará pendiente de revisión.");
    guardarDatos();
    actualizarKPIs();
    renderizarMisReportes();
    renderizarAdminReportes();
    document.getElementById("reporteForm").reset();
});

// Filtros en admin
document.getElementById("filtroTipo")?.addEventListener("change", renderizarAdminReportes);
document.getElementById("filtroEstado")?.addEventListener("change", renderizarAdminReportes);
document.getElementById("filtroPrioridad")?.addEventListener("change", renderizarAdminReportes);
document.getElementById("buscarReporte")?.addEventListener("input", renderizarAdminReportes);

// Cambio de vista
document.querySelectorAll(".view-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".view-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const view = tab.dataset.view;
        document.getElementById("viewEmpleado").classList.toggle("active", view === "empleado");
        document.getElementById("viewAdmin").classList.toggle("active", view === "admin");
        if (view === "admin") renderizarAdminReportes();
        else renderizarMisReportes();
    });
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    mostrarMensaje("Cerrando sesión...");
    setTimeout(() => window.location.href = "../../login.html", 800);
});


inicializarDatos();
actualizarKPIs();
renderizarMisReportes();
renderizarAdminReportes();
