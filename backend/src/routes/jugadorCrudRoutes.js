const express = require("express");

const router = express.Router();

const {
  obtenerJugadores,
  obtenerJugadorPorId,
  crearJugador,
  actualizarJugador,
  eliminarJugador
} = require(
  "../controllers/jugadorCrudController"
);

router.get("/", obtenerJugadores);

router.get("/:id", obtenerJugadorPorId);

router.post("/", crearJugador);

router.put("/:id", actualizarJugador);

router.delete("/:id", eliminarJugador);

module.exports = router;