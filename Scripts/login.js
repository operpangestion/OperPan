// ==========================================================================
// OPERPAN - SISTEMA DE AUTENTICACIÓN Y SEGURIDAD (login.js)
// ==========================================================================

// --- BASE DE DATOS SIMULADA ---
const adminAccounts = {
    "admin": {
        username: "admin",
        password: "Admin123!",
        role: "admin",
        fullName: "Administrador Principal",
        suspended: false,
    },
    "gerente": {
        username: "gerente",
        password: "Gerente123!",
        role: "gerente",
        fullName: "Gerente Operaciones",
        suspended: false,
    }
};

const empleadosDB = {
    "EMP001": { codigo: "EMP001", nombre: "Carlos Méndez", role: "empleado", suspended: false, activo: true },
    "EMP002": { codigo: "EMP002", nombre: "Luisa Fernández", role: "empleado", suspended: true, activo: false },
    "EMP003": { codigo: "EMP003", nombre: "Jorge Ramírez", role: "empleado", suspended: false, activo: true },
};

// --- GESTIÓN DE BLOQUEO TEMPORAL (RNF-LG-02) ---
function getAttemptsStorage() {
    const stored = localStorage.getItem("operpan_login_attempts");
    return stored ? JSON.parse(stored) : {};
}

function saveAttemptsStorage(data) {
    localStorage.setItem("operpan_login_attempts", JSON.stringify(data));
}

function isAccountBlocked(username) {
    const attemptsData = getAttemptsStorage();
    const record = attemptsData[username];
    if (record && record.blockedUntil && Date.now() < record.blockedUntil) {
        return true;
    }
    if (record && record.blockedUntil && Date.now() >= record.blockedUntil) {
        delete attemptsData[username];
        saveAttemptsStorage(attemptsData);
    }
    return false;
}

function registerFailedAttempt(username) {
    const attemptsData = getAttemptsStorage();
    const now = Date.now();
    if (!attemptsData[username]) {
        attemptsData[username] = { attempts: 1, blockedUntil: null };
    } else {
        if (attemptsData[username].blockedUntil && now >= attemptsData[username].blockedUntil) {
            attemptsData[username] = { attempts: 1, blockedUntil: null };
        } else {
            attemptsData[username].attempts += 1;
        }
    }
    if (attemptsData[username].attempts >= 3) {
        attemptsData[username].blockedUntil = now + 300000; // 5 minutos
        attemptsData[username].attempts = 0;
    }
    saveAttemptsStorage(attemptsData);
}

function clearAttempts(username) {
    const attemptsData = getAttemptsStorage();
    if (attemptsData[username]) {
        delete attemptsData[username];
        saveAttemptsStorage(attemptsData);
    }
}

// --- REGISTRO DE ACCESOS (AUDITORÍA) ---
function registrarAcceso(usuario, rol, tipoAcceso, codigoOCredencial) {
    const ahora = new Date();
    const logEntry = {
        timestamp: ahora.toISOString(),
        fechaHora: ahora.toLocaleString('es-CO'),
        usuario: usuario,
        rol: rol,
        tipo: tipoAcceso,
        credencial: codigoOCredencial,
        dispositivo: navigator.userAgent || "Desconocido",
        ip: "simulada-local"
    };
    let logs = localStorage.getItem("operpan_access_logs");
    logs = logs ? JSON.parse(logs) : [];
    logs.unshift(logEntry);
    if (logs.length > 100) logs.pop();
    localStorage.setItem("operpan_access_logs", JSON.stringify(logs));
    console.log("[AUDITORÍA] Acceso registrado:", logEntry);
}

// --- MENSAJES DE INTERFAZ (ALERTAS FLUJO) ---
function showMessage(message, isError = true) {
    const msgDiv = document.getElementById("globalMessage");
    const msgSpan = document.getElementById("msgText");
    if (!msgDiv || !msgSpan) return;

    msgSpan.innerText = message;
    msgDiv.classList.add("show");
    
    // Forzar la visualización en caso de que los estilos CSS no tengan transiciones
    msgDiv.style.display = "block"; 

    if (isError) {
        msgDiv.style.background = "#FEF2F0";
        msgDiv.style.color = "#B91C1C";
        msgDiv.style.borderLeft = "4px solid #A40706";
    } else {
        msgDiv.style.background = "#E6F7EC";
        msgDiv.style.color = "#0E6B2E";
        msgDiv.style.borderLeft = "4px solid #2E7D32";
    }
    setTimeout(() => {
        msgDiv.classList.remove("show");
        msgDiv.style.display = "none";
    }, 6000);
}

function clearMessage() {
    const msgDiv = document.getElementById("globalMessage");
    if (msgDiv) {
        msgDiv.classList.remove("show");
        msgDiv.style.display = "none";
    }
}

// --- CONTROLADORES DE LOGIN ---
function handleAdminLogin(event) {
    event.preventDefault();
    clearMessage();
    
    const usernameInput = document.getElementById("adminUser");
    const passwordInput = document.getElementById("adminPass");
    
    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showMessage("⚠️ Por favor complete usuario y contraseña.");
        return;
    }

    const account = adminAccounts[username.toLowerCase()];
    if (!account) {
        showMessage("❌ Credenciales inválidas. Usuario o contraseña incorrectos.");
        registerFailedAttempt(username);
        return;
    }

    if (isAccountBlocked(account.username)) {
        const attemptsData = getAttemptsStorage();
        const blockedUntil = attemptsData[account.username]?.blockedUntil;
        const minutosRest = Math.ceil((blockedUntil - Date.now()) / 60000);
        showMessage(`🔒 Cuenta temporalmente bloqueada. Intente nuevamente en ${minutosRest} minuto(s).`);
        return;
    }

    if (account.suspended) {
        showMessage("⛔ Acceso denegado. Su cuenta ha sido suspendida. Contacte al administrador.");
        return;
    }

    if (account.password !== password) {
        registerFailedAttempt(account.username);
        showMessage("❌ Contraseña incorrecta. Verifique sus credenciales.");
        return;
    }

    clearAttempts(account.username);
    registrarAcceso(account.fullName, account.role, "login_admin_gerente", username);
    showMessage(`✅ Bienvenido ${account.fullName}. Redirigiendo...`, false);

    setTimeout(() => {
        // Redirección relativa estricta desde la raíz del proyecto
        window.location.href = "../Pages/admin/landingAdmin.html";
    }, 1000);
}

function handleEmpleadoLogin(event) {
    event.preventDefault();
    clearMessage();
    
    const codigoInput = document.getElementById("empleadoCodigo");
    if (!codigoInput) return;

    const codigo = codigoInput.value.trim().toUpperCase();

    if (!codigo) {
        showMessage("📌 Debe ingresar su código personal de empleado.");
        return;
    }

    const empleado = empleadosDB[codigo];
    if (!empleado) {
        showMessage("❌ Código personal inválido. No existe en la base de datos.");
        return;
    }

    if (empleado.suspended || !empleado.activo) {
        showMessage("⛔ Acceso denegado. Su cuenta está inactiva o suspendida.");
        return;
    }

    registrarAcceso(empleado.nombre, empleado.role, "login_empleado_codigo", codigo);
    showMessage(`👋 Bienvenido ${empleado.nombre}. Accediendo...`, false);

    setTimeout(() => {
        window.location.href = "../Pages/Empleado/landingEmpleado.html";
    }, 1000);
}

// --- CAMBIO DE PESTAÑAS (TABS INTERFAZ) ---
function setActiveTab(active) {
    const tabAdmin = document.getElementById("tabAdminGerente");
    const tabEmp = document.getElementById("tabEmpleado");
    const adminPane = document.getElementById("adminFormPane");
    const empPane = document.getElementById("empleadoFormPane");

    if (!tabAdmin || !tabEmp || !adminPane || !empPane) return;
    
    if (active === "admin") {
        tabAdmin.classList.add("active");
        tabEmp.classList.remove("active");
        adminPane.style.display = "block";
        empPane.style.display = "none";
    } else {
        tabEmp.classList.add("active");
        tabAdmin.classList.remove("active");
        adminPane.style.display = "none";
        empPane.style.display = "block";
    }
    clearMessage();
}

// --- INICIALIZACIÓN DE EVENTOS DEL DOM ---
document.addEventListener('DOMContentLoaded', () => {
    const tabAdmin = document.getElementById("tabAdminGerente");
    const tabEmp = document.getElementById("tabEmpleado");
    const formAdmin = document.getElementById("loginAdminForm");
    const formEmpleado = document.getElementById("loginEmpleadoForm");
    const forgotLink = document.getElementById("forgotPasswordLink");

    if (tabAdmin) tabAdmin.addEventListener("click", () => setActiveTab("admin"));
    if (tabEmp) tabEmp.addEventListener("click", () => setActiveTab("empleado"));
    if (formAdmin) formAdmin.addEventListener("submit", handleAdminLogin);
    if (formEmpleado) formEmpleado.addEventListener("submit", handleEmpleadoLogin);

    if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            showMessage("🔐 Para recuperar su acceso, comuníquese con el Administrador o solicite restablecimiento vía soporte.", true);
        });
    }

    // Configuración por defecto
    setActiveTab("admin");
});

// --- FUNCIONES GLOBALIZADAS ---
function navegar() {
    const navElement = document.getElementById("_nav");
    if (navElement && navElement.value !== "") {
        window.location.href = navElement.value;
    }
}

function cerrarSesion() {
    window.location.href = "./index.html";
}