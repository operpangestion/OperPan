document.addEventListener("DOMContentLoaded", () => {

    // Declaración de Variables (Elementos HTML)
    const buttons = document.querySelectorAll(".nav__btn");
    const sections = document.querySelectorAll(".admin__section");

    // Función para ocultar todas las secciones
    const hideAllSections = () => {
        sections.forEach(section => {
            section.style.display = "none";
        });
    };

    // Mostrar sección por defecto al cargar
    hideAllSections();
    const defaultSection = document.getElementById("horarios");
    if (defaultSection) {
        defaultSection.style.display = "flex";
    }

    // Evento para cada botón
    buttons.forEach(button => {
        button.addEventListener("click", () => {

            const targetId = button.dataset.section;
            const targetSection = document.getElementById(targetId);

            hideAllSections();

            if (targetSection) {
                targetSection.style.display = "flex";
            }

        });
    });

});

