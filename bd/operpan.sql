-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 19-03-2026 a las 13:01:49
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_delete_memorando` (IN `proc_mem_id` INT)   BEGIN
    DELETE FROM memorando WHERE mem_id = proc_mem_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_emp_mem` ()   BEGIN
    SELECT CONCAT(e.emp_nom,' ',e.emp_ape) AS nombreCompleto,
           m.mem_id, m.mem_descrip
    FROM empleado e
    INNER JOIN memorando m ON e.emp_id = m.emp_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_emp_per` ()   BEGIN
    SELECT CONCAT(e.emp_nom,' ',e.emp_ape) AS nombreCompleto,
           p.per_fecha, p.per_descrip, p.per_estado
    FROM permiso p
    INNER JOIN empleado e ON p.emp_id = e.emp_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_insert_memorando` (IN `proc_mem_id` INT, IN `proc_emp_id` INT, IN `proc_mem_fecha` DATE, IN `proc_mem_tipo` VARCHAR(100), IN `proc_mem_descrip` VARCHAR(255))   BEGIN
    INSERT INTO memorando(mem_id, emp_id, mem_fecha, mem_tipo, mem_descrip)
    VALUES (proc_mem_id, proc_emp_id, proc_mem_fecha, proc_mem_tipo, proc_mem_descrip);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `proc_uptade_horario` (IN `proc_hor_id` INT, IN `proc_hor_jrn` VARCHAR(255))   BEGIN
    UPDATE horario
    SET hor_jrn = proc_hor_jrn
    WHERE hor_id = proc_hor_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `carg_id` int(11) NOT NULL,
  `carg_tipo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`carg_id`, `carg_tipo`) VALUES
(1, 'Mesero'),
(2, 'Cajero'),
(3, 'Cocinero'),
(4, 'Panadero'),
(5, 'Pastelero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `emp_id` int(11) NOT NULL,
  `emp_nom` varchar(100) NOT NULL,
  `emp_ape` varchar(100) NOT NULL,
  `emp_doc` int(11) NOT NULL,
  `emp_tel` int(11) NOT NULL,
  `emp_dir` varchar(255) NOT NULL,
  `emp_correo` varchar(255) DEFAULT NULL,
  `contrato_ini` date NOT NULL,
  `contrato_fin` date DEFAULT NULL,
  `estado_id` int(11) NOT NULL,
  `hor_id` int(11) NOT NULL,
  `carg_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`emp_id`, `emp_nom`, `emp_ape`, `emp_doc`, `emp_tel`, `emp_dir`, `emp_correo`, `contrato_ini`, `contrato_fin`, `estado_id`, `hor_id`, `carg_id`) VALUES
(1, 'Juan Carlos', 'Perez Gomez', 1010, 311999999, 'Calle 99', 'juan.carlos@gmail.com', '2024-01-10', NULL, 1, 1, 1),
(2, 'Maria', 'Lopez', 1020, 300222222, 'Calle 20', 'maria@gmail.com', '2023-05-15', NULL, 1, 2, 1),
(3, 'Carlos', 'Gomez', 1030, 300333333, 'Calle 30', 'carlos@gmail.com', '2024-02-20', NULL, 1, 3, 2),
(4, 'Ana', 'Martinez', 1040, 300444444, 'Calle 40', 'ana@gmail.com', '2022-11-05', NULL, 1, 5, 3),
(5, 'Luis', 'Rodriguez', 1050, 300555555, 'Calle 50', 'luis@gmail.com', '2023-03-12', NULL, 1, 7, 4),
(6, 'Pedro', 'Ramirez', 1060, 300666666, 'Calle 60', 'pedro@gmail.com', '2021-07-01', NULL, 1, 8, 4),
(7, 'Andres', 'Lopez', 1080, 300888888, 'Calle 80', 'andres@gmail.com', '2025-01-01', NULL, 1, 1, 1);

--
-- Disparadores `empleado`
--
DELIMITER $$
CREATE TRIGGER `trg_empleado_delete` AFTER DELETE ON `empleado` FOR EACH ROW BEGIN
    INSERT INTO empleado_auditoria (
        emp_id,
        emp_nom_old,
        emp_ape_old,
        emp_doc_old,
        emp_tel_old,
        emp_dir_old,
        emp_correo_old,
        fecha,
        usuario,
        accion
    )
    VALUES (
        OLD.emp_id,
        OLD.emp_nom,
        OLD.emp_ape,
        OLD.emp_doc,
        OLD.emp_tel,
        OLD.emp_dir,
        OLD.emp_correo,
        NOW(),
        CURRENT_USER(),
        'Se eliminaron registros'
    );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_empleado_update` AFTER UPDATE ON `empleado` FOR EACH ROW BEGIN
    INSERT INTO empleado_auditoria(
        emp_id,
        emp_nom_old, emp_ape_old, emp_doc_old, emp_tel_old, emp_dir_old, emp_correo_old,
        emp_nom_new, emp_ape_new, emp_doc_new, emp_tel_new, emp_dir_new, emp_correo_new,
        fecha, usuario, accion
    )
    VALUES (
        OLD.emp_id,
        OLD.emp_nom, OLD.emp_ape, OLD.emp_doc, OLD.emp_tel, OLD.emp_dir, OLD.emp_correo,
        NEW.emp_nom, NEW.emp_ape, NEW.emp_doc, NEW.emp_tel, NEW.emp_dir, NEW.emp_correo,
        NOW(), CURRENT_USER(), 'Se actualizaron datos'
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado_auditoria`
--

CREATE TABLE `empleado_auditoria` (
  `audit_id` int(11) NOT NULL,
  `emp_id` int(11) DEFAULT NULL,
  `emp_nom_old` varchar(100) DEFAULT NULL,
  `emp_ape_old` varchar(100) DEFAULT NULL,
  `emp_doc_old` int(11) DEFAULT NULL,
  `emp_tel_old` int(11) DEFAULT NULL,
  `emp_dir_old` varchar(255) DEFAULT NULL,
  `emp_correo_old` varchar(255) DEFAULT NULL,
  `emp_nom_new` varchar(100) DEFAULT NULL,
  `emp_ape_new` varchar(100) DEFAULT NULL,
  `emp_doc_new` int(11) DEFAULT NULL,
  `emp_tel_new` int(11) DEFAULT NULL,
  `emp_dir_new` varchar(255) DEFAULT NULL,
  `emp_correo_new` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `accion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado_auditoria`
--

INSERT INTO `empleado_auditoria` (`audit_id`, `emp_id`, `emp_nom_old`, `emp_ape_old`, `emp_doc_old`, `emp_tel_old`, `emp_dir_old`, `emp_correo_old`, `emp_nom_new`, `emp_ape_new`, `emp_doc_new`, `emp_tel_new`, `emp_dir_new`, `emp_correo_new`, `fecha`, `usuario`, `accion`) VALUES
(1, 1, 'Juan', 'Perez', 1010, 300111111, 'Calle 10', 'juan@gmail.com', 'Juan Carlos', 'Perez Gomez', 1010, 311999999, 'Calle 99', 'juan.carlos@gmail.com', '2026-03-19 06:43:06', 'root@localhost', 'Se actuliazaron datos'),
(2, 8, 'Sofia', 'Morales', 1100, 302123456, 'Calle 100', 'sofia@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 06:59:06', 'root@localhost', 'Se eliminaron registros');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `estado_id` int(11) NOT NULL,
  `estado_tipo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`estado_id`, `estado_tipo`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `hor_id` int(11) NOT NULL,
  `hor_carg_id` int(11) NOT NULL,
  `hor_jrn` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`hor_id`, `hor_carg_id`, `hor_jrn`) VALUES
(1, 1, '4:00 AM - 2:00 PM'),
(2, 1, '1:30 PM - 11:00 PM'),
(3, 2, '4:00 AM - 2:00 PM'),
(4, 2, '1:30 PM - 11:00 PM'),
(5, 3, '4:00 AM - 2:00 PM'),
(6, 3, '7:00 AM - 5:00 PM'),
(7, 4, '5:00 AM - 2:00 PM'),
(8, 4, '1:00 PM - 10:00 PM'),
(9, 5, '7:00 AM - 5:00 PM');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario_cargo`
--

CREATE TABLE `horario_cargo` (
  `hor_carg_id` int(11) NOT NULL,
  `carg_id` int(11) NOT NULL,
  `hor_des` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario_cargo`
--

INSERT INTO `horario_cargo` (`hor_carg_id`, `carg_id`, `hor_des`) VALUES
(1, 1, 'Horario Mesero'),
(2, 2, 'Horario Cajero'),
(3, 3, 'Horario Cocinero'),
(4, 4, 'Horario Panadero'),
(5, 5, 'Horario Pastelero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incapacidad`
--

CREATE TABLE `incapacidad` (
  `inc_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `inc_fecha` date NOT NULL,
  `inc_estado` varchar(100) NOT NULL,
  `inc_descrip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `memorando`
--

CREATE TABLE `memorando` (
  `mem_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `mem_fecha` date NOT NULL,
  `mem_tipo` varchar(100) NOT NULL,
  `mem_descrip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `per_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `per_fecha` date NOT NULL,
  `per_descrip` varchar(255) NOT NULL,
  `per_estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `tarea_id` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL,
  `tarea_fecha` date NOT NULL,
  `tarea_descrip` varchar(255) NOT NULL,
  `tarea_estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_emp_horario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_emp_horario` (
`emp_id` int(11)
,`nombreCompleto` varchar(201)
,`hor_jrn` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_emp_tarea`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_emp_tarea` (
`emp_id` int(11)
,`nombreCompleto` varchar(201)
,`tarea_fecha` date
,`tarea_descrip` varchar(255)
,`tarea_estado` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_emp_horario`
--
DROP TABLE IF EXISTS `vista_emp_horario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_emp_horario`  AS SELECT `e`.`emp_id` AS `emp_id`, concat(`e`.`emp_nom`,' ',`e`.`emp_ape`) AS `nombreCompleto`, `h`.`hor_jrn` AS `hor_jrn` FROM (`empleado` `e` join `horario` `h` on(`h`.`hor_id` = `e`.`hor_id`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_emp_tarea`
--
DROP TABLE IF EXISTS `vista_emp_tarea`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_emp_tarea`  AS SELECT `e`.`emp_id` AS `emp_id`, concat(`e`.`emp_nom`,' ',`e`.`emp_ape`) AS `nombreCompleto`, `t`.`tarea_fecha` AS `tarea_fecha`, `t`.`tarea_descrip` AS `tarea_descrip`, `t`.`tarea_estado` AS `tarea_estado` FROM (`empleado` `e` join `tarea` `t` on(`t`.`emp_id` = `e`.`emp_id`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`carg_id`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`emp_id`),
  ADD UNIQUE KEY `index_tel` (`emp_tel`),
  ADD UNIQUE KEY `index_correo` (`emp_correo`),
  ADD KEY `estado_id` (`estado_id`),
  ADD KEY `hor_id` (`hor_id`),
  ADD KEY `carg_id` (`carg_id`);

--
-- Indices de la tabla `empleado_auditoria`
--
ALTER TABLE `empleado_auditoria`
  ADD PRIMARY KEY (`audit_id`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`estado_id`),
  ADD KEY `index_estado` (`estado_tipo`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`hor_id`),
  ADD KEY `hor_carg_id` (`hor_carg_id`);

--
-- Indices de la tabla `horario_cargo`
--
ALTER TABLE `horario_cargo`
  ADD PRIMARY KEY (`hor_carg_id`),
  ADD KEY `carg_id` (`carg_id`);

--
-- Indices de la tabla `incapacidad`
--
ALTER TABLE `incapacidad`
  ADD PRIMARY KEY (`inc_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indices de la tabla `memorando`
--
ALTER TABLE `memorando`
  ADD PRIMARY KEY (`mem_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`per_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`tarea_id`),
  ADD KEY `emp_id` (`emp_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `empleado_auditoria`
--
ALTER TABLE `empleado_auditoria`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`estado_id`),
  ADD CONSTRAINT `empleado_ibfk_2` FOREIGN KEY (`hor_id`) REFERENCES `horario` (`hor_id`),
  ADD CONSTRAINT `empleado_ibfk_3` FOREIGN KEY (`carg_id`) REFERENCES `cargo` (`carg_id`);

--
-- Filtros para la tabla `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`hor_carg_id`) REFERENCES `horario_cargo` (`hor_carg_id`);

--
-- Filtros para la tabla `horario_cargo`
--
ALTER TABLE `horario_cargo`
  ADD CONSTRAINT `horario_cargo_ibfk_1` FOREIGN KEY (`carg_id`) REFERENCES `cargo` (`carg_id`);

--
-- Filtros para la tabla `incapacidad`
--
ALTER TABLE `incapacidad`
  ADD CONSTRAINT `incapacidad_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `empleado` (`emp_id`);

--
-- Filtros para la tabla `memorando`
--
ALTER TABLE `memorando`
  ADD CONSTRAINT `memorando_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `empleado` (`emp_id`);

--
-- Filtros para la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD CONSTRAINT `permiso_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `empleado` (`emp_id`);

--
-- Filtros para la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `tarea_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `empleado` (`emp_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
