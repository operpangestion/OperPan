# Guía de Contribución y Flujo de Trabajo con Git

> Documentación interna del proyecto **OperPan** · Grupo Cless Lab.  
> Esta guía está diseñada para configurar un entorno de trabajo desde cero y contribuir al repositorio correctamente.

---

## Documentos de referencia del proyecto

Antes de comenzar, ten a mano los siguientes documentos disponibles en esta misma carpeta:

| Archivo | Descripción |
|---|---|
| [`01-propuesta-tecnica.pdf`](./01-propuesta-tecnica.pdf) | Propuesta técnica oficial del sistema OperPan |
| [`02-mapa-de-navegacion-en-estrella.pdf`](./02-mapa-de-navegacion-en-estrella.pdf) | Mapa de navegación del sistema y flujo entre vistas |
| [`03-informe-de-diseno-v1.pdf`](./03-informe-de-diseno-v1.pdf) | Informe de diseño UI/UX versión 1 |

---

## Requisitos previos

Antes de clonar el proyecto, asegúrate de tener lo siguiente:

- ✅ Una cuenta activa en [GitHub](https://github.com)
- ✅ Git instalado en tu computador
- ✅ Un editor de código (se recomienda [Visual Studio Code](https://code.visualstudio.com))
- ✅ Acceso al repositorio del proyecto

---

## Paso 1 — Instalar Git

Si es la primera vez que usas Git en este computador, descárgalo desde su página oficial:

> 🔗 https://git-scm.com/

Instala normalmente dejando todas las opciones por defecto.

Una vez instalado, verifica que funcione correctamente abriendo la terminal o **Git Bash** y ejecutando:

```bash
git --version
```

Si el comando devuelve algo como `git version 2.x.x`, la instalación fue exitosa.

---

## Paso 2 — Configurar tu identidad en Git

Antes de hacer cualquier operación, Git necesita saber quién eres. Esta información quedará registrada en cada commit que realices.

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tucorreo@gmail.com"
```

Para verificar que quedó guardado correctamente:

```bash
git config --list
```

> **Nota:** El flag `--global` aplica esta configuración para todos los repositorios del computador. Si solo quieres configurarlo para este proyecto específico, omite `--global` y ejecuta el comando dentro de la carpeta del proyecto.

---

## Paso 3 — Clonar el repositorio

Clona el proyecto en tu computador con el siguiente comando:

```bash
git clone https://github.com/operpangestion/OperPan.git
```

Una vez finalizado, entra a la carpeta del proyecto:

```bash
cd OperPan
```

Abre el proyecto en Visual Studio Code:

```bash
code .
```

---

## Paso 4 — Verificar el estado del repositorio

Antes de comenzar a trabajar, asegúrate de estar actualizado con la rama principal:

```bash
git status
```

```bash
git pull origin main
```

> **Buena práctica:** Siempre ejecuta `git pull` antes de empezar a trabajar para evitar conflictos con cambios de otros miembros del equipo.

---

## Paso 5 — Crear una rama para tus cambios

Nunca trabajes directamente sobre `main`. Crea una rama con un nombre descriptivo que indique qué estás haciendo:

```bash
git checkout -b nombre-de-tu-rama
```

Ejemplos de nombres de rama:

```bash
git checkout -b feature/modulo-login
git checkout -b fix/estilos-navbar
git checkout -b docs/actualizar-readme
```

Para verificar en qué rama estás:

```bash
git branch
```

---

## Paso 6 — Realizar tus cambios

Trabaja normalmente en el proyecto desde Visual Studio Code. Cuando termines, verifica qué archivos modificaste:

```bash
git status
```

---

## Paso 7 — Agregar los cambios al área de preparación

Para agregar **todos** los archivos modificados:

```bash
git add .
```

O si solo quieres agregar un archivo específico:

```bash
git add Pages/login.html
```

---

## Paso 8 — Crear un commit

Un commit es una fotografía del estado del proyecto en ese momento. El mensaje debe ser claro y describir qué cambiaste:

```bash
git commit -m "descripción clara del cambio realizado"
```

**Ejemplos de mensajes de commit bien escritos:**

```bash
git commit -m "feat: agrega módulo de gestión de permisos"
git commit -m "fix: corrige estilos responsivos en la navbar"
git commit -m "docs: actualiza README con guía de instalación"
git commit -m "style: ajusta paleta de colores en dashboard admin"
```

> **Convención recomendada:** Usa prefijos como `feat:`, `fix:`, `docs:`, `style:`, `refactor:` para mantener un historial limpio y profesional.

---

## Paso 9 — Subir los cambios a GitHub

```bash
git push origin nombre-de-tu-rama
```

Si es la primera vez que subes esta rama:

```bash
git push -u origin nombre-de-tu-rama
```

---

## Paso 10 — Abrir un Pull Request

1. Ve al repositorio en GitHub: [github.com/operpangestion/OperPan](https://github.com/operpangestion/OperPan)
2. GitHub mostrará automáticamente un botón **"Compare & pull request"** para tu rama recién subida.
3. Escribe un título descriptivo y una breve explicación de los cambios.
4. Asigna a un compañero del equipo como revisor.
5. Haz clic en **"Create pull request"**.

Los cambios serán revisados antes de integrarse a la rama `main`.

---

## Referencia rápida de comandos

```bash
# Clonar el repositorio
git clone https://github.com/operpangestion/OperPan.git

# Actualizar desde remoto
git pull origin main

# Crear y cambiar a una nueva rama
git checkout -b nombre-de-tu-rama

# Ver estado de archivos
git status

# Agregar todos los cambios
git add .

# Crear un commit
git commit -m "descripción del cambio"

# Subir cambios
git push origin nombre-de-tu-rama
```

---

## Solución de problemas frecuentes

**¿Git te pide usuario y contraseña en cada push?**  
Configura tu credencial con un token de acceso personal desde GitHub:  
`Settings → Developer settings → Personal access tokens`

**¿Tienes conflictos al hacer pull?**  
No sobrescribas cambios de otros. Comunícate con el equipo y resuelve el conflicto revisando las líneas marcadas con `<<<<<<`, `=======` y `>>>>>>` en el archivo afectado.

**¿Necesitas deshacer el último commit sin perder los cambios?**

```bash
git reset --soft HEAD~1
```

---

> OperPan © 2025–2026 · Grupo Cless Lab. · SENA — Análisis y Desarrollo de Software