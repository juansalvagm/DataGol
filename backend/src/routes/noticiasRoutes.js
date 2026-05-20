const express = require("express");
const router = express.Router();
const noticiasController = require("../controllers/noticiasController");

router.get("/", noticiasController.obtenerNoticias);

module.exports = router;