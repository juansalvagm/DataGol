const express = require("express");
const router = express.Router();
const favoritoController = require("../controllers/favoritoController");

router.get("/", favoritoController.obtenerFavoritos);

router.post("/", favoritoController.crearFavorito);

router.put("/:id", favoritoController.actualizarFavorito);

router.delete("/:id", favoritoController.eliminarFavorito);

module.exports = router;