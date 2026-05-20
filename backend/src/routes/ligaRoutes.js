const express = require("express");
const router = express.Router();
const ligaController = require("../controllers/ligaController");

router.get("/", ligaController.obtenerLigas);
router.get("/equipos/:codigoLiga", ligaController.obtenerEquipos);
router.get("/partidos/:codigoLiga", ligaController.obtenerPartidos);
router.get("/clasificacion/:codigoLiga", ligaController.obtenerClasificacion);

module.exports = router;