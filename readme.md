# OperPan — Gestión de Personal

> Sistema web administrativo para la gestión de personal y recursos humanos en panaderías.

**[Ver aplicación en producción](https://operpangestion.github.io/OperPan/)**

---

OperPan es una plataforma institucional desarrollada para **Estación Paisa** que digitaliza y centraliza los procesos de administración de personal: horarios, asistencia, permisos, tareas, incapacidades y certificados laborales, todo en un único sistema organizado y trazable.

---

## Características principales

- Gestión completa de empleados (alta, modificación, baja)
- Asignación y administración de horarios y turnos
- Control de asistencia con historial por empleado
- Gestión de permisos, incapacidades y solicitudes
- Módulo de tareas con seguimiento y estados
- Reportes y estadísticas administrativas
- Generación de certificados laborales
- Control de accesos por roles (Administrador, Gerente, Empleado)

---

## Objetivo

Eliminar el manejo manual de procesos operativos en panaderías mediante una plataforma centralizada, accesible y escalable que mejore la productividad, reduzca errores y facilite la toma de decisiones basada en datos.

---

## Tecnologías

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat&logo=bootstrap&logoColor=white)

---

## Capturas

### Homepage
![Homepage](./Assets/img/00-readme/01-homepage.png)

### Acceso al sistema
![Acceso al sistema](./Assets/img/00-readme/02-accede-al-sistema.png)

### Login
![Login](./Assets/img/00-readme/03-login.png)

### Panel Administrador
![Panel Administrador](./Assets/img/00-readme/04-admin.png)

### Panel Empleado
![Panel Empleado](./Assets/img/00-readme/05-empleado.png)

---

## Estructura del repositorio

```
OPERPAN/
├── index.html                  ← Homepage / Portal corporativo
├── Assets/styles.css           ← Estilos globales
├── Pages/
│   ├── login.html
│   ├── admin/                  ← Módulos para Admin/Gerente
│   │   └── sub-pages-admin/
│   └── Empleado/               ← Módulos para Empleado
│       └── sub-pages-empleado/
└── Scripts/script.js
```

---

## Estado del proyecto

**En desarrollo activo** — Fase 1 (Frontend completo) ✅ · Fase 2 (Backend + BD) 🔄 En progreso

---

## Próximas mejoras

- [ ] Integración con backend (API REST)
- [ ] Autenticación real con JWT
- [ ] Generación de PDF para certificados y reportes
- [ ] Exportación a Excel
- [ ] Notificaciones automáticas
- [ ] Soporte multi-sucursal

---

## Equipo

| Desarrollador | GitHub |
|---|---|
| Eddier Paz Pardo | [@EddierPaz](https://github.com/EddierPaz) |
| Santiago Muñetón | [@santiagoencodigo](https://github.com/santiagoencodigo) |
| Andrea Herrera | [@AndreaHerreraDev](https://github.com/AndreaHerreraDev) |

> Proyecto desarrollado en el **SENA** · Análisis y Desarrollo de Software · Ficha 3171608

---

## Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo `LICENSE` para más detalles.