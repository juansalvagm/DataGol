const express = require("express");
const router = express.Router();
const jugadorController = require("../controllers/jugadorController");

router.get("/:idEquipo", jugadorController.obtenerJugadores);

module.exports = router;