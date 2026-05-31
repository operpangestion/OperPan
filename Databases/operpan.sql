-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 26-03-2026 a las 17:06:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `operpan`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_estado_permiso` (IN `p_id_permiso` INT, IN `p_estado` VARCHAR(100))   BEGIN
  UPDATE permiso
  SET estado_permiso = p_estado
  WHERE id_permiso = p_id_permiso;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `eliminar_memorando` (IN `p_id` INT)   BEGIN
  DELETE FROM memorando WHERE id_memorando = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_memorando` (IN `p_id_empleado` INT, IN `p_fecha` DATE, IN `p_tipo` VARCHAR(100), IN `p_descripcion` VARCHAR(255))   BEGIN
  INSERT INTO memorando(
    id_empleado,
    fecha_subida,
    tipo,
    descripcion
  )
  VALUES (
    p_id_empleado,
    p_fecha,
    p_tipo,
    p_descripcion
  );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ver_empleado_horario` (IN `idEmpleado` INT)   BEGIN 
	SELECT CONCAT(e.nombre, ' ',e.apellido) AS Nombre_Empleado, a.fecha_inicio, a.fecha_fin, h.jornada, a.fecha_descanso FROM empleado e
    INNER JOIN asignacion_horario a ON a.id_empleado=e.id_empleado
    INNER JOIN horario h ON h.id_horario=a.id_horario
    WHERE idEmpleado=e.id_empleado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ver_empleado_tarea` (IN `idEmpleado` INT)   BEGIN 
	SELECT CONCAT(e.nombre, ' ' , e.apellido ) AS Nombre_Empleado,t.fecha_inicio, t.fecha_fin, t.descripcion_tarea, t.estado_tarea  
    FROM empleado e
    INNER JOIN tarea t ON t.id_empleado = e.id_empleado
	WHERE idEmpleado = e.id_empleado;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignacion_horario`
--

CREATE TABLE `asignacion_horario` (
  `id_asignacion` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `id_horario` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `fecha_descanso` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignacion_horario`
--

INSERT INTO `asignacion_horario` (`id_asignacion`, `id_empleado`, `id_horario`, `fecha_inicio`, `fecha_fin`, `fecha_descanso`) VALUES
(1, 1, 1, '2026-03-01', '2026-03-07', '2026-03-05'),
(2, 2, 2, '2026-03-01', '2026-03-07', '2026-03-02'),
(3, 3, 1, '2026-03-01', '2026-03-07', '2026-03-04'),
(4, 4, 3, '2026-03-01', '2026-03-07', '2026-03-06'),
(5, 5, 2, '2026-03-01', '2026-03-07', '2026-03-07'),
(6, 1, 2, '2026-03-08', '2026-03-14', '2026-03-09'),
(7, 2, 3, '2026-03-08', '2026-03-14', '2026-03-10'),
(8, 3, 2, '2026-03-08', '2026-03-14', '2026-03-11'),
(9, 4, 1, '2026-03-08', '2026-03-14', '2026-03-12'),
(10, 5, 3, '2026-03-08', '2026-03-14', '2026-03-13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `id_cargo` int(11) NOT NULL,
  `tipo_cargo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`id_cargo`, `tipo_cargo`) VALUES
(1, 'Mesero'),
(2, 'Cajero'),
(3, 'Cocinero'),
(4, 'Panadero'),
(5, 'Pastelero'),
(6, 'Administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id_empleado` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `documento` int(11) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `fecha_inicio_contrato` date DEFAULT NULL,
  `fecha_fin_contrato` date DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL,
  `id_cargo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id_empleado`, `nombre`, `apellido`, `documento`, `telefono`, `direccion`, `correo`, `fecha_inicio_contrato`, `fecha_fin_contrato`, `estado`, `id_cargo`) VALUES
(1, 'Juan', 'Perez', 1010, 2147483647, 'Calle 1', 'juan@gmail.com', '2024-01-10', NULL, 'Activo', 1),
(2, 'Maria', 'Lopez', 1020, 300222222, 'Calle 2', 'maria@gmail.com', '2023-05-15', NULL, 'Activo', 2),
(3, 'Carlos', 'Gomez', 1030, 300333333, 'Calle 3', 'carlos@gmail.com', '2024-02-20', NULL, 'Activo', 3),
(4, 'Ana', 'Martinez', 1040, 300444444, 'Calle 4', 'ana@gmail.com', '2026-01-01', NULL, 'Activo', 3),
(5, 'Luis', 'Rodriguez', 1050, 300555555, 'Calle 5', 'luis@gmail.com', '2023-03-12', NULL, 'Activo', 4),
(6, 'Pedro', 'Ramirez', 1060, 300666666, 'Calle 6', 'pedro@gmail.com', '2021-07-01', NULL, 'Activo', 4),
(7, 'Andres', 'Lopez', 1080, 300888888, 'Calle 7', 'andres@gmail.com', '2025-01-01', NULL, 'Activo', 5),
(8, 'Sofia', 'Morales', 1100, 302123456, 'Calle 8', 'sofia@gmail.com', '2024-06-01', NULL, 'Activo', 5),
(9, 'Camila', 'Diaz', 1200, 303456789, 'Calle 9', 'camila@gmail.com', '2023-09-10', NULL, 'Activo', 2),
(10, 'David', 'Torres', 1300, 304567890, 'Calle 10', 'davidto@gmail.com', '2022-08-20', NULL, 'Activo', 1),
(11, 'Carlos', 'Ramírez', 2000, 310000000, 'Oficina principal', 'admin@operpan.com', '2026-01-01', NULL, 'Activo', 6);

--
-- Disparadores `empleado`
--
DELIMITER $$
CREATE TRIGGER `trg_empleado_delete` AFTER DELETE ON `empleado` FOR EACH ROW BEGIN
  INSERT INTO empleado_auditoria(
    id_empleado,
    nombre_old, apellido_old, documento_old, telefono_old, direccion_old, correo_old,
    fecha, usuario, accion
  )
  VALUES (
    OLD.id_empleado,
    OLD.nombre, OLD.apellido, OLD.documento, OLD.telefono, OLD.direccion, OLD.correo,
    NOW(), CURRENT_USER(), 'Eliminación de empleado'
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_empleado_update` AFTER UPDATE ON `empleado` FOR EACH ROW BEGIN
  INSERT INTO empleado_auditoria(
    id_empleado,
    nombre_old, apellido_old, documento_old, telefono_old, direccion_old, correo_old,
    nombre_new, apellido_new, documento_new, telefono_new, direccion_new, correo_new,
    fecha, usuario, accion
  )
  VALUES (
    OLD.id_empleado,
    OLD.nombre, OLD.apellido, OLD.documento, OLD.telefono, OLD.direccion, OLD.correo,
    NEW.nombre, NEW.apellido, NEW.documento, NEW.telefono, NEW.direccion, NEW.correo,
    NOW(), CURRENT_USER(), 'Actualización de empleado'
  );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado_auditoria`
--

CREATE TABLE `empleado_auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  `nombre_old` varchar(100) DEFAULT NULL,
  `apellido_old` varchar(100) DEFAULT NULL,
  `documento_old` int(11) DEFAULT NULL,
  `telefono_old` int(11) DEFAULT NULL,
  `direccion_old` varchar(255) DEFAULT NULL,
  `correo_old` varchar(255) DEFAULT NULL,
  `nombre_new` varchar(100) DEFAULT NULL,
  `apellido_new` varchar(100) DEFAULT NULL,
  `documento_new` int(11) DEFAULT NULL,
  `telefono_new` int(11) DEFAULT NULL,
  `direccion_new` varchar(255) DEFAULT NULL,
  `correo_new` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `accion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado_auditoria`
--

INSERT INTO `empleado_auditoria` (`id_auditoria`, `id_empleado`, `nombre_old`, `apellido_old`, `documento_old`, `telefono_old`, `direccion_old`, `correo_old`, `nombre_new`, `apellido_new`, `documento_new`, `telefono_new`, `direccion_new`, `correo_new`, `fecha`, `usuario`, `accion`) VALUES
(1, 12, 'Laura', 'Gómez', 1400, 305678901, 'Calle 12', 'laura.gomez@operpan.com', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-25 19:53:54', 'root@localhost', 'Eliminación de empleado'),
(2, 10, 'David', 'Torres', 1300, 304567890, 'Calle 10', 'davidtorres@gmail.com', 'David', 'Torres', 1300, 304567890, 'Calle 10', 'davidto@gmail.com', '2026-03-25 19:56:27', 'root@localhost', 'Actualización de empleado'),
(3, 1, 'Juan', 'Perez', 1010, 300111111, 'Calle 1', 'juan@gmail.com', 'Juan', 'Perez', 1010, 2147483647, 'Calle 1', 'juan@gmail.com', '2026-03-26 07:12:05', 'root@localhost', 'Actualización de empleado'),
(4, 1, 'Juan', 'Perez', 1010, 2147483647, 'Calle 1', 'juan@gmail.com', 'Juan', 'Perez', 1010, 2147483647, 'Calle 1', 'juan@gmail.com', '2026-03-26 10:32:19', 'root@localhost', 'Actualización de empleado'),
(5, 11, 'Carlos', 'Ramírez', 2000, 310000000, 'Oficina principal', 'admin@operpan.com', 'Carlos', 'Ramírez', 2000, 310000000, 'Oficina principal', 'admin@operpan.com', '2026-03-26 10:32:30', 'root@localhost', 'Actualización de empleado'),
(6, 10, 'David', 'Torres', 1300, 304567890, 'Calle 10', 'davidto@gmail.com', 'David', 'Torres', 1300, 304567890, 'Calle 10', 'davidto@gmail.com', '2026-03-26 10:32:45', 'root@localhost', 'Actualización de empleado'),
(7, 9, 'Camila', 'Diaz', 1200, 303456789, 'Calle 9', 'camila@gmail.com', 'Camila', 'Diaz', 1200, 303456789, 'Calle 9', 'camila@gmail.com', '2026-03-26 10:32:52', 'root@localhost', 'Actualización de empleado'),
(8, 2, 'Maria', 'Lopez', 1020, 300222222, 'Calle 2', 'maria@gmail.com', 'Maria', 'Lopez', 1020, 300222222, 'Calle 2', 'maria@gmail.com', '2026-03-26 10:33:01', 'root@localhost', 'Actualización de empleado'),
(9, 3, 'Carlos', 'Gomez', 1030, 300333333, 'Calle 3', 'carlos@gmail.com', 'Carlos', 'Gomez', 1030, 300333333, 'Calle 3', 'carlos@gmail.com', '2026-03-26 10:33:14', 'root@localhost', 'Actualización de empleado'),
(10, 4, 'Ana', 'Martinez', 1040, 300444444, 'Calle 4', 'ana@gmail.com', 'Ana', 'Martinez', 1040, 300444444, 'Calle 4', 'ana@gmail.com', '2026-03-26 10:33:23', 'root@localhost', 'Actualización de empleado'),
(11, 5, 'Luis', 'Rodriguez', 1050, 300555555, 'Calle 5', 'luis@gmail.com', 'Luis', 'Rodriguez', 1050, 300555555, 'Calle 5', 'luis@gmail.com', '2026-03-26 10:33:33', 'root@localhost', 'Actualización de empleado'),
(12, 6, 'Pedro', 'Ramirez', 1060, 300666666, 'Calle 6', 'pedro@gmail.com', 'Pedro', 'Ramirez', 1060, 300666666, 'Calle 6', 'pedro@gmail.com', '2026-03-26 10:33:39', 'root@localhost', 'Actualización de empleado'),
(13, 7, 'Andres', 'Lopez', 1080, 300888888, 'Calle 7', 'andres@gmail.com', 'Andres', 'Lopez', 1080, 300888888, 'Calle 7', 'andres@gmail.com', '2026-03-26 10:33:45', 'root@localhost', 'Actualización de empleado'),
(14, 8, 'Sofia', 'Morales', 1100, 302123456, 'Calle 8', 'sofia@gmail.com', 'Sofia', 'Morales', 1100, 302123456, 'Calle 8', 'sofia@gmail.com', '2026-03-26 10:33:51', 'root@localhost', 'Actualización de empleado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id_horario` int(11) NOT NULL,
  `jornada` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id_horario`, `jornada`, `descripcion`) VALUES
(1, '4:00 AM - 2:00 PM', 'Turno mañana meseros'),
(2, '1:30 PM - 11:00 PM', 'Turno tarde meseros'),
(3, '4:00 AM - 2:00 PM', 'Turno mañana cajero'),
(4, '1:30 PM - 11:00 PM', 'Turno tarde cajero'),
(5, '4:00 AM - 2:00 PM', 'Preparación desayuno y almuerzo'),
(6, '7:00 AM - 5:00 PM', 'Producción continua cocina'),
(7, '5:00 AM - 2:00 PM', 'Producción de pan temprano'),
(8, '1:00 PM - 10:00 PM', 'Reposición y producción tarde'),
(9, '7:00 AM - 5:00 PM', 'Producción y decoración pastelería'),
(10, '8:00 AM - 6:00 PM', 'Horario administrativo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incapacidad`
--

CREATE TABLE `incapacidad` (
  `id_incapacidad` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha_subida` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado_incapacidad` enum('Aprobado','No Aprobado') NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `incapacidad`
--

INSERT INTO `incapacidad` (`id_incapacidad`, `id_empleado`, `fecha_subida`, `fecha_inicio`, `fecha_fin`, `estado_incapacidad`, `descripcion`) VALUES
(1, 1, '2026-02-01', '2026-02-02', '2026-02-05', 'Aprobado', 'Gripe fuerte'),
(2, 2, '2026-02-03', '2026-02-04', '2026-02-06', 'Aprobado', 'Dolor lumbar'),
(3, 3, '2026-02-05', '2026-02-06', '2026-02-08', 'No Aprobado', 'Fiebre leve'),
(4, 4, '2026-02-07', '2026-02-08', '2026-02-10', 'Aprobado', 'Migraña'),
(5, 5, '2026-02-09', '2026-02-10', '2026-02-12', 'No Aprobado', 'Dolor leve'),
(6, 6, '2026-02-11', '2026-02-12', '2026-02-14', 'Aprobado', 'Accidente menor'),
(7, 7, '2026-02-13', '2026-02-14', '2026-02-16', 'No Aprobado', 'Infección leve'),
(8, 8, '2026-02-15', '2026-02-16', '2026-02-18', 'Aprobado', 'Cirugía leve'),
(9, 9, '2026-02-17', '2026-02-18', '2026-02-20', 'Aprobado', 'Dolor muscular'),
(10, 10, '2026-02-19', '2026-02-20', '2026-02-22', 'No Aprobado', 'Reposo médico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `memorando`
--

CREATE TABLE `memorando` (
  `id_memorando` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha_subida` date NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `memorando`
--

INSERT INTO `memorando` (`id_memorando`, `id_empleado`, `fecha_subida`, `tipo`, `descripcion`) VALUES
(1, 1, '2026-03-20', 'Llamado de atención', 'Llegada tarde'),
(2, 2, '2026-03-21', 'Reconocimiento', 'Excelente atención al cliente'),
(3, 3, '2026-03-22', 'Advertencia', 'Error en caja'),
(4, 4, '2026-03-23', 'Llamado de atención', 'Incumplimiento de tareas'),
(5, 5, '2026-03-24', 'Reconocimiento', 'Alto rendimiento en producción'),
(6, 6, '2026-03-25', 'Advertencia', 'Uso incorrecto de uniforme'),
(7, 7, '2026-03-26', 'Reconocimiento', 'Buen trabajo en equipo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id_permiso` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha_subida` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `estado_permiso` enum('Aprobado','No Aprobado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permiso`
--

INSERT INTO `permiso` (`id_permiso`, `id_empleado`, `fecha_subida`, `fecha_inicio`, `fecha_fin`, `descripcion`, `estado_permiso`) VALUES
(1, 1, '2026-03-01', '2026-03-05', '2026-03-06', 'Cita médica', 'No Aprobado'),
(2, 2, '2026-03-02', '2026-03-07', '2026-03-08', 'Asunto personal', 'No Aprobado'),
(3, 3, '2026-03-03', '2026-03-10', '2026-03-11', 'Calamidad familiar', 'Aprobado'),
(4, 4, '2026-03-04', '2026-03-12', '2026-03-13', 'Estudio', 'No Aprobado'),
(5, 5, '2026-03-05', '2026-03-14', '2026-03-15', 'Viaje', 'Aprobado'),
(6, 6, '2026-03-06', '2026-03-16', '2026-03-17', 'Motivo de salud', 'Aprobado'),
(7, 7, '2026-03-07', '2026-03-18', '2026-03-19', 'Diligencia personal', 'No Aprobado'),
(8, 8, '2026-03-08', '2026-03-20', '2026-03-21', 'Evento familiar', 'Aprobado'),
(9, 9, '2026-03-09', '2026-03-22', '2026-03-23', 'Viaje familiar', 'Aprobado'),
(10, 10, '2026-03-10', '2026-03-24', '2026-03-25', 'Estudio', 'No Aprobado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `id_tarea` int(11) NOT NULL,
  `id_tipo_tarea` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion_tarea` varchar(255) DEFAULT NULL,
  `estado_tarea` enum('Pendiente','En proceso','Completada','Cancelada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`id_tarea`, `id_tipo_tarea`, `id_empleado`, `fecha_inicio`, `fecha_fin`, `descripcion_tarea`, `estado_tarea`) VALUES
(1, 1, 1, '2026-03-20', '2026-03-20', 'Limpieza completa de baños', 'Pendiente'),
(2, 2, 2, '2026-03-20', '2026-03-20', 'Limpiar vitrinas', 'Completada'),
(3, 3, 1, '2026-03-21', '2026-03-21', 'Trapear piso', 'En proceso'),
(4, 4, 2, '2026-03-21', '2026-03-21', 'Limpieza de naranjera', 'Completada'),
(5, 5, 3, '2026-03-20', '2026-03-20', 'Apertura caja', 'Completada'),
(6, 6, 9, '2026-03-20', '2026-03-20', 'Cierre caja', 'Pendiente'),
(7, 7, 4, '2026-03-20', '2026-03-20', 'Preparar comida', 'En proceso'),
(8, 8, 8, '2026-03-21', '2026-03-21', 'Revisar inventario', 'Pendiente'),
(9, 9, 5, '2026-03-20', '2026-03-20', 'Hornear pan', 'Completada'),
(10, 10, 7, '2026-03-21', '2026-03-21', 'Decorar tortas', 'Pendiente'),
(11, 8, 3, '2026-03-26', '2026-03-26', 'Revisar inventario', 'Pendiente');

--
-- Disparadores `tarea`
--
DELIMITER $$
CREATE TRIGGER `tarea_after_insert` AFTER INSERT ON `tarea` FOR EACH ROW BEGIN
    INSERT INTO tarea_auditoria (id_tarea, tipo_accion, descripcion, usuario)
    VALUES (NEW.id_tarea, 'INSERT', CONCAT('Tarea creada con estado: ', NEW.estado_tarea), CURRENT_USER());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_tarea_update_` AFTER UPDATE ON `tarea` FOR EACH ROW BEGIN
  IF OLD.estado_tarea <> NEW.estado_tarea THEN
    INSERT INTO tarea_auditoria (id_tarea, tipo_accion, descripcion, usuario, fecha)
    VALUES (
      NEW.id_tarea,
      'UPDATE',
      CONCAT('Estado cambiado: ', OLD.estado_tarea, ' → ', NEW.estado_tarea),
      USER(),
      NOW()
    );
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea_auditoria`
--

CREATE TABLE `tarea_auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `id_tarea` int(11) NOT NULL,
  `tipo_accion` enum('INSERT','UPDATE') NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarea_auditoria`
--

INSERT INTO `tarea_auditoria` (`id_auditoria`, `id_tarea`, `tipo_accion`, `descripcion`, `usuario`, `fecha`) VALUES
(1, 4, 'UPDATE', 'Estado cambiado: Pendiente → ', 'root@localhost', '2026-03-26 14:04:16'),
(2, 4, 'UPDATE', 'Estado cambiado:  → Completada', 'root@localhost', '2026-03-26 14:12:11'),
(3, 11, 'INSERT', 'Tarea creada con estado: Pendiente', 'root@localhost', '2026-03-26 14:14:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_tarea`
--

CREATE TABLE `tipo_tarea` (
  `id_tipo_tarea` int(11) NOT NULL,
  `nombre_tipo_tarea` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_tarea`
--

INSERT INTO `tipo_tarea` (`id_tipo_tarea`, `nombre_tipo_tarea`) VALUES
(1, 'Limpieza de baños'),
(2, 'Limpieza de vitrinas'),
(3, 'Limpieza de piso'),
(4, 'Limpieza de naranjera'),
(5, 'Apertura de caja'),
(6, 'Cierre de caja'),
(7, 'Preparación de alimentos'),
(8, 'Inventario cocina'),
(9, 'Producción de pan'),
(10, 'Decoración de pasteles');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_empleado_horario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_empleado_horario` (
`id_empleado` int(11)
,`Nombre_Empleado` varchar(201)
,`fecha_inicio` date
,`fecha_fin` date
,`jornada` varchar(100)
,`fecha_descanso` date
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_empleado_tarea`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_empleado_tarea` (
`id_empleado` int(11)
,`nombre_completo` varchar(201)
,`fecha_inicio` date
,`fecha_fin` date
,`descripcion_tarea` varchar(255)
,`estado_tarea` enum('Pendiente','En proceso','Completada','Cancelada')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_memorandos_por_empleado`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_memorandos_por_empleado` (
`id_empleado` int(11)
,`nombre_completo` varchar(201)
,`total_memorandos` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_empleado_horario`
--
DROP TABLE IF EXISTS `vista_empleado_horario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_empleado_horario`  AS SELECT `e`.`id_empleado` AS `id_empleado`, concat(`e`.`nombre`,' ',`e`.`apellido`) AS `Nombre_Empleado`, `a`.`fecha_inicio` AS `fecha_inicio`, `a`.`fecha_fin` AS `fecha_fin`, `h`.`jornada` AS `jornada`, `a`.`fecha_descanso` AS `fecha_descanso` FROM ((`empleado` `e` join `asignacion_horario` `a` on(`a`.`id_empleado` = `e`.`id_empleado`)) join `horario` `h` on(`a`.`id_horario` = `h`.`id_horario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_empleado_tarea`
--
DROP TABLE IF EXISTS `vista_empleado_tarea`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_empleado_tarea`  AS SELECT `e`.`id_empleado` AS `id_empleado`, concat(`e`.`nombre`,' ',`e`.`apellido`) AS `nombre_completo`, `t`.`fecha_inicio` AS `fecha_inicio`, `t`.`fecha_fin` AS `fecha_fin`, `t`.`descripcion_tarea` AS `descripcion_tarea`, `t`.`estado_tarea` AS `estado_tarea` FROM (`empleado` `e` join `tarea` `t` on(`e`.`id_empleado` = `t`.`id_empleado`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_memorandos_por_empleado`
--
DROP TABLE IF EXISTS `vista_memorandos_por_empleado`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_memorandos_por_empleado`  AS SELECT `e`.`id_empleado` AS `id_empleado`, concat(`e`.`nombre`,' ',`e`.`apellido`) AS `nombre_completo`, count(`m`.`id_memorando`) AS `total_memorandos` FROM (`empleado` `e` left join `memorando` `m` on(`e`.`id_empleado` = `m`.`id_empleado`)) GROUP BY `e`.`id_empleado`, `e`.`nombre`, `e`.`apellido` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignacion_horario`
--
ALTER TABLE `asignacion_horario`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD KEY `id_empleado` (`id_empleado`),
  ADD KEY `id_horario` (`id_horario`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`id_cargo`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `fk_empleado_cargo` (`id_cargo`);

--
-- Indices de la tabla `empleado_auditoria`
--
ALTER TABLE `empleado_auditoria`
  ADD PRIMARY KEY (`id_auditoria`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id_horario`);

--
-- Indices de la tabla `incapacidad`
--
ALTER TABLE `incapacidad`
  ADD PRIMARY KEY (`id_incapacidad`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `memorando`
--
ALTER TABLE `memorando`
  ADD PRIMARY KEY (`id_memorando`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id_permiso`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`id_tarea`),
  ADD KEY `id_tipo_tarea` (`id_tipo_tarea`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `tarea_auditoria`
--
ALTER TABLE `tarea_auditoria`
  ADD PRIMARY KEY (`id_auditoria`);

--
-- Indices de la tabla `tipo_tarea`
--
ALTER TABLE `tipo_tarea`
  ADD PRIMARY KEY (`id_tipo_tarea`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asignacion_horario`
--
ALTER TABLE `asignacion_horario`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `empleado_auditoria`
--
ALTER TABLE `empleado_auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `incapacidad`
--
ALTER TABLE `incapacidad`
  MODIFY `id_incapacidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `memorando`
--
ALTER TABLE `memorando`
  MODIFY `id_memorando` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `id_tarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `tarea_auditoria`
--
ALTER TABLE `tarea_auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_tarea`
--
ALTER TABLE `tipo_tarea`
  MODIFY `id_tipo_tarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignacion_horario`
--
ALTER TABLE `asignacion_horario`
  ADD CONSTRAINT `asignacion_horario_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`),
  ADD CONSTRAINT `asignacion_horario_ibfk_2` FOREIGN KEY (`id_horario`) REFERENCES `horario` (`id_horario`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `fk_empleado_cargo` FOREIGN KEY (`id_cargo`) REFERENCES `cargo` (`id_cargo`);

--
-- Filtros para la tabla `incapacidad`
--
ALTER TABLE `incapacidad`
  ADD CONSTRAINT `incapacidad_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `memorando`
--
ALTER TABLE `memorando`
  ADD CONSTRAINT `memorando_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD CONSTRAINT `permiso_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);

--
-- Filtros para la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`id_tipo_tarea`) REFERENCES `tipo_tarea` (`id_tipo_tarea`),
  ADD CONSTRAINT `tarea_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

