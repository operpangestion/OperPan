// navegacion
function navegar() {
    const ruta = document.getElementById("_nav").value;
    if (ruta !== "") {
        window.location.href = ruta;
    }
}

//Cerrar Sesion  
function cerrarSesion() {
    // redirige al login o página de inicio
    window.location.href = "../../index.html";
}