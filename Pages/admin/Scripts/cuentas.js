// ============================================================
// OPERPAN — GESTIÓN DE CUENTAS v2.1
// Roles: empleado (acceso por ID), gerente/admin (usuario+pass)
// ============================================================

const KEY_USERS = "operpan_usuarios_v2";
const KEY_AUDIT = "operpan_audit_v2";

// ── Datos de ejemplo iniciales ──────────────────────────────
function inicializarDatos() {
    if (!localStorage.getItem(KEY_USERS)) {
        const sample = [
            {
                id: "EMP-2024-001", primerNombre: "Eddie", segundoNombre: "R",
                primerApellido: "Paz", segundoApellido: "Pardo",
                tipoDocumento: "Cédula de Ciudadanía", documento: "12345678",
                correo: "eddie.paz@estacionpaisa.com", telefono: "3001234567",
                cargo: "Panadero Principal", rol: "empleado", estado: "activo",
                usuarioSistema: "", passwordSistema: "",
                fechaCreacion: new Date().toISOString()
            },
            {
                id: "EMP-2024-002", primerNombre: "María", segundoNombre: "",
                primerApellido: "González", segundoApellido: "Torres",
                tipoDocumento: "Cédula de Ciudadanía", documento: "87654321",
                correo: "maria.gonzalez@estacionpaisa.com", telefono: "3009876543",
                cargo: "Repostera", rol: "empleado", estado: "activo",
                usuarioSistema: "", passwordSistema: "",
                fechaCreacion: new Date().toISOString()
            },
            {
                id: "EMP-2024-003", primerNombre: "Carlos", segundoNombre: "",
                primerApellido: "Rodríguez", segundoApellido: "Ruiz",
                tipoDocumento: "Cédula de Ciudadanía", documento: "11223344",
                correo: "carlos.rodriguez@estacionpaisa.com", telefono: "3005551234",
                cargo: "Servicio al Cliente", rol: "empleado", estado: "suspendido",
                usuarioSistema: "", passwordSistema: "",
                fechaCreacion: new Date().toISOString()
            },
            {
                id: "GER-2024-001", primerNombre: "Laura", segundoNombre: "",
                primerApellido: "Martínez", segundoApellido: "",
                tipoDocumento: "Cédula de Ciudadanía", documento: "55667788",
                correo: "laura.martinez@estacionpaisa.com", telefono: "3017654321",
                cargo: "Gerente de Turno", rol: "gerente", estado: "activo",
                usuarioSistema: "gerente.laura", passwordSistema: "Ger@2024!",
                fechaCreacion: new Date().toISOString()
            }
        ];
        localStorage.setItem(KEY_USERS, JSON.stringify(sample));
        localStorage.setItem(KEY_AUDIT, JSON.stringify([]));
    }
}

inicializarDatos();
let usuarios = JSON.parse(localStorage.getItem(KEY_USERS));
let auditLog = JSON.parse(localStorage.getItem(KEY_AUDIT) || "[]");
let editandoId = null;
let eliminarId = null;

function guardarLS() {
    localStorage.setItem(KEY_USERS, JSON.stringify(usuarios));
    localStorage.setItem(KEY_AUDIT, JSON.stringify(auditLog));
}

function auditoria(accion, detalles, idAfectado) {
    auditLog.unshift({ fecha: new Date().toISOString(), accion, detalles, idAfectado });
    if (auditLog.length > 300) auditLog.pop();
    guardarLS();
}

function mostrarToast(msg, tipo) {
    const t = document.getElementById("liveToast");
    const icon = document.getElementById("toastIcon");
    document.getElementById("toastMsg").innerText = msg;
    icon.className = tipo === "error"
        ? "bi bi-x-circle-fill text-danger fs-5"
        : "bi bi-check-circle-fill text-success fs-5";
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3500);
}

// ── Generar ID según rol ─────────────────────────────────────
function generarId(rol) {
    const prefijos = { empleado: "EMP", gerente: "GER", admin: "ADM" };
    const prefijo = prefijos[rol] || "EMP";
    const year = new Date().getFullYear();
    const nums = usuarios
        .filter(u => u.id.startsWith(prefijo))
        .map(u => parseInt(u.id.split("-")[2]) || 0);
    const siguiente = (nums.length > 0 ? Math.max(...nums) : 0) + 1;
    return `${prefijo}-${year}-${String(siguiente).padStart(3, "0")}`;
}

// ── Mostrar/ocultar sección de acceso según rol ──────────────
function actualizarAcceso() {
    const rol = document.getElementById("rol").value;
    document.getElementById("accesoNone").style.display = rol ? "none" : "block";
    document.getElementById("accesoEmpleado").style.display = rol === "empleado" ? "block" : "none";
    document.getElementById("accesoAdmin").style.display = (rol === "gerente" || rol === "admin") ? "block" : "none";
}

// ── Renderizar tabla ─────────────────────────────────────────
function renderizarTabla(filtro) {
    filtro = filtro !== undefined ? filtro : document.getElementById("searchInput").value;
    const q = filtro.toLowerCase();
    const tbody = document.getElementById("tablaCuentasBody");

    const filtrados = usuarios.filter(u => {
        const nombreCompleto = [u.primerNombre, u.segundoNombre, u.primerApellido, u.segundoApellido]
            .filter(Boolean).join(" ").toLowerCase();
        return nombreCompleto.includes(q)
            || (u.correo || "").toLowerCase().includes(q)
            || (u.documento || "").includes(q)
            || (u.id || "").toLowerCase().includes(q);
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4"><i class="bi bi-search me-2"></i>Sin resultados para "${filtro}"</td></tr>`;
    } else {
        tbody.innerHTML = filtrados.map(u => {
            const nombre = [u.primerNombre, u.segundoNombre, u.primerApellido, u.segundoApellido]
                .filter(Boolean).join(" ");

            const rolLabels = { empleado: "Empleado", gerente: "Gerente", admin: "Administrador" };
            const rolClasses = { empleado: "badge-rol-empleado", gerente: "badge-rol-gerente", admin: "badge-rol-admin" };

            const estadoClass = u.estado === "activo" ? "badge-active" : "badge-inactive";
            const estadoText = u.estado === "activo" ? "Activo" : "Suspendido";

            // Columna acceso según rol
            let accesoHtml;
            if (u.rol === "empleado") {
                accesoHtml = `<span style="font-size:.8rem;color:#0369A1;"><i class="bi bi-key me-1"></i>ID: <strong>${u.id}</strong></span>`;
            } else {
                accesoHtml = `<span style="font-size:.8rem;color:#5B21B6;"><i class="bi bi-person-badge me-1"></i>${u.usuarioSistema || "<em>sin usuario</em>"}</span>`;
            }

            return `
          <tr>
            <td><span class="badge bg-secondary">${u.id}</span></td>
            <td><strong>${nombre}</strong><br><small class="text-muted">${u.tipoDocumento || ""}: ${u.documento}</small></td>
            <td>${u.correo}<br><small class="text-muted">${u.telefono}</small></td>
            <td>${u.cargo}</td>
            <td><span class="badge ${rolClasses[u.rol] || ''}">${rolLabels[u.rol] || u.rol}</span></td>
            <td>${accesoHtml}</td>
            <td><span class="badge ${estadoClass}">${estadoText}</span></td>
            <td>
              <button class="action-btn" onclick="editarCuenta('${u.id}')" title="Editar"><i class="bi bi-pencil-square"></i></button>
              <button class="action-btn" onclick="toggleEstado('${u.id}')" title="Activar / Suspender"><i class="bi bi-person-dash-fill"></i></button>
              <button class="action-btn" onclick="confirmarEliminar('${u.id}')" title="Eliminar"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`;
        }).join("");
    }

    // KPIs
    document.getElementById("kpiTotal").innerText = usuarios.length;
    document.getElementById("kpiActivos").innerText = usuarios.filter(u => u.estado === "activo").length;
    document.getElementById("kpiInactivos").innerText = usuarios.filter(u => u.estado !== "activo").length;
}

// ── Guardar (crear o editar) ─────────────────────────────────
function guardarCuenta() {
    const pn = document.getElementById("primerNombre").value.trim();
    const sn = document.getElementById("segundoNombre").value.trim();
    const pa = document.getElementById("primerApellido").value.trim();
    const sa = document.getElementById("segundoApellido").value.trim();
    const tipodoc = document.getElementById("tipoDocumento").value;
    const doc = document.getElementById("documento").value.trim();
    const fn = document.getElementById("fechaNacimiento").value;
    const genero = document.getElementById("genero").value;
    const ec = document.getElementById("estadoCivil").value;
    const ts = document.getElementById("tipoSangre").value;
    const tel = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const dir = document.getElementById("direccion").value.trim();
    const ce = document.getElementById("contactoEmergencia").value.trim();
    const te = document.getElementById("telefonoEmergencia").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const rol = document.getElementById("rol").value;
    const fi = document.getElementById("fechaIngreso").value;
    const eps = document.getElementById("eps").value.trim();
    const arl = document.getElementById("arl").value.trim();
    const pension = document.getElementById("pension").value.trim();
    const alergias = document.getElementById("alergias").value.trim();
    const enfermedades = document.getElementById("enfermedades").value.trim();
    const discapacidades = document.getElementById("discapacidades").value.trim();

    // Validaciones obligatorias
    if (!pn || !pa || !tipodoc || !doc || !fn || !tel || !correo || !ciudad || !dir || !cargo || !rol || !fi) {
        mostrarToast("Completa todos los campos obligatorios (*).", "error");
        return;
    }

    let usuarioSistema = "", passwordSistema = "", estado = "activo";

    if (rol === "empleado") {
        estado = document.getElementById("estadoEmp").value;

    } else {
        // Gerente o Admin
        usuarioSistema = document.getElementById("usuarioSistema").value.trim();
        passwordSistema = document.getElementById("passwordSistema").value;
        estado = document.getElementById("estadoAdmin").value;

        if (!usuarioSistema) {
            mostrarToast("El usuario del sistema es obligatorio para gerentes y administradores.", "error");
            return;
        }
        if (!editandoId && passwordSistema.length < 8) {
            mostrarToast("La contraseña debe tener mínimo 8 caracteres.", "error");
            return;
        }
        // Verificar usuario único
        const duplicado = usuarios.find(u => u.usuarioSistema === usuarioSistema && u.id !== editandoId);
        if (duplicado) {
            mostrarToast(`El usuario "${usuarioSistema}" ya está en uso.`, "error");
            return;
        }
    }

    const datos = {
        primerNombre: pn, segundoNombre: sn,
        primerApellido: pa, segundoApellido: sa,
        tipoDocumento: tipodoc, documento: doc,
        fechaNacimiento: fn, genero, estadoCivil: ec, tipoSangre: ts,
        telefono: tel, correo, ciudad, direccion: dir,
        contactoEmergencia: ce, telefonoEmergencia: te,
        cargo, rol, fechaIngreso: fi,
        eps, arl, pension,
        alergias, enfermedades, discapacidades,
        usuarioSistema, estado
    };

    if (editandoId) {
        const idx = usuarios.findIndex(u => u.id === editandoId);
        if (idx !== -1) {
            usuarios[idx] = { ...usuarios[idx], ...datos };
            if (passwordSistema) usuarios[idx].passwordSistema = passwordSistema;
            auditoria("MODIFICAR CUENTA", `Cuenta editada: ${pn} ${pa}`, editandoId);
            mostrarToast("Cuenta actualizada correctamente.", "success");
        }
        cancelarEdicion();
    } else {
        const nuevoId = generarId(rol);
        usuarios.push({ id: nuevoId, ...datos, passwordSistema, fechaCreacion: new Date().toISOString() });
        auditoria("CREAR CUENTA", `Nueva cuenta: ${pn} ${pa} (${nuevoId})`, nuevoId);
        mostrarToast(`Cuenta creada — ID: ${nuevoId}`, "success");
        limpiarForm();
        ocultarFormulario();
    }

    guardarLS();
    renderizarTabla();
}

// ── Editar cuenta ────────────────────────────────────────────
function editarCuenta(id) {
    mostrarFormulario();

    const u = usuarios.find(x => x.id === id);
    if (!u) return;

    editandoId = id;

    document.getElementById("formTitle").innerText = "Editar cuenta";
    document.getElementById("btnCancelarEdicion").style.display = "inline-block";

    // Rellenar campos
    document.getElementById("primerNombre").value = u.primerNombre || "";
    document.getElementById("segundoNombre").value = u.segundoNombre || "";
    document.getElementById("primerApellido").value = u.primerApellido || "";
    document.getElementById("segundoApellido").value = u.segundoApellido || "";
    document.getElementById("tipoDocumento").value = u.tipoDocumento || "";
    document.getElementById("documento").value = u.documento || "";
    document.getElementById("fechaNacimiento").value = u.fechaNacimiento || "";
    document.getElementById("genero").value = u.genero || "";
    document.getElementById("estadoCivil").value = u.estadoCivil || "";
    document.getElementById("tipoSangre").value = u.tipoSangre || "";
    document.getElementById("telefono").value = u.telefono || "";
    document.getElementById("correo").value = u.correo || "";
    document.getElementById("ciudad").value = u.ciudad || "";
    document.getElementById("direccion").value = u.direccion || "";
    document.getElementById("contactoEmergencia").value = u.contactoEmergencia || "";
    document.getElementById("telefonoEmergencia").value = u.telefonoEmergencia || "";
    document.getElementById("cargo").value = u.cargo || "";
    document.getElementById("rol").value = u.rol || "";
    document.getElementById("fechaIngreso").value = u.fechaIngreso || "";
    document.getElementById("eps").value = u.eps || "";
    document.getElementById("arl").value = u.arl || "";
    document.getElementById("pension").value = u.pension || "";
    document.getElementById("alergias").value = u.alergias || "";
    document.getElementById("enfermedades").value = u.enfermedades || "";
    document.getElementById("discapacidades").value = u.discapacidades || "";

    actualizarAcceso();

    if (u.rol === "empleado") {
        document.getElementById("estadoEmp").value = u.estado;
    } else {
        document.getElementById("usuarioSistema").value = u.usuarioSistema || "";
        document.getElementById("passwordSistema").value = "";
        document.getElementById("estadoAdmin").value = u.estado;
    }

    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicion() {
    editandoId = null;
    document.getElementById("formTitle").innerText = "Crear nueva cuenta";
    document.getElementById("btnCancelarEdicion").style.display = "none";
    limpiarForm();
    ocultarFormulario();
}

function limpiarForm() {
    const ids = [
        "primerNombre", "segundoNombre", "primerApellido", "segundoApellido",
        "documento", "fechaNacimiento", "telefono", "correo", "ciudad", "direccion",
        "contactoEmergencia", "telefonoEmergencia", "cargo", "fechaIngreso",
        "eps", "arl", "pension", "alergias", "enfermedades", "discapacidades",
        "usuarioSistema", "passwordSistema"
    ];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    ["tipoDocumento", "genero", "estadoCivil", "tipoSangre", "rol"].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = "";
    });
    actualizarAcceso();
}

// ── Activar / Suspender ──────────────────────────────────────
function toggleEstado(id) {
    const u = usuarios.find(x => x.id === id);
    if (!u) return;
    u.estado = u.estado === "activo" ? "suspendido" : "activo";
    auditoria(u.estado === "activo" ? "ACTIVAR" : "SUSPENDER",
        `${u.primerNombre} ${u.primerApellido} ahora está ${u.estado}`, id);
    mostrarToast(`Cuenta ${u.estado === "activo" ? "activada" : "suspendida"}.`, "success");
    guardarLS();
    renderizarTabla();
}

// ── Eliminar ─────────────────────────────────────────────────
function confirmarEliminar(id) {
    const u = usuarios.find(x => x.id === id);
    if (!u) return;
    if (u.estado !== "suspendido") {
        mostrarToast("Solo se pueden eliminar cuentas suspendidas.", "error");
        return;
    }
    eliminarId = id;
    const nombre = [u.primerNombre, u.primerApellido].join(" ");
    document.getElementById("modalBodyText").innerHTML =
        `¿Eliminar permanentemente a <strong>${nombre}</strong> (${u.id})? Esta acción no se puede deshacer.`;
    document.getElementById("confirmActionBtn").onclick = () => {
        usuarios = usuarios.filter(x => x.id !== eliminarId);
        auditoria("ELIMINAR CUENTA", `Cuenta ${eliminarId} eliminada`, eliminarId);
        mostrarToast("Cuenta eliminada permanentemente.", "success");
        guardarLS();
        renderizarTabla();
        bootstrap.Modal.getInstance(document.getElementById("confirmModal")).hide();
        eliminarId = null;
    };
    new bootstrap.Modal(document.getElementById("confirmModal")).show();
}

// ── Mostarar Formularios
function mostrarFormulario() {
    document.getElementById("formularioCuenta").style.display = "block";
    document.getElementById("formularioCuenta")
        .scrollIntoView({ behavior: "smooth" });
}

function ocultarFormulario() {
    document.getElementById("formularioCuenta").style.display = "none";
}

// ── Eventos ──────────────────────────────────────────────────

// Cerrar el menú si se hace clic fuera de él (en la zona blanca)
document.addEventListener("click", (event) => {
    // Verificamos si el sidebar está abierto (tiene la clase active)
    if (sidebar.classList.contains("active")) {
        // Si el clic NO fue dentro del sidebar Y TAMPOCO en el botón de hamburguesa...
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    }
});
document.getElementById("logoutBtn").addEventListener("click", () => {
    mostrarToast("Cerrando sesión...", "success");
    setTimeout(() => window.location.href = "../../login.html", 900);
});

// ── Inicio ───────────────────────────────────────────────────
renderizarTabla();
actualizarAcceso();
