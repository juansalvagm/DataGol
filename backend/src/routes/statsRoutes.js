const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/:nombreJugador", statsController.obtenerEstadisticasJugador);

module.exports = router;