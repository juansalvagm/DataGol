const favoritoModel = require("../models/favoritoModel");

const obtenerFavoritos = async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({
        error: "Falta usuario_id"
      });
    }

    const favoritos = await favoritoModel.getFavoritos(
      usuario_id
    );

    res.json(favoritos);

  } catch (error) {
    console.error("Error al obtener favoritos:", error);

    res.status(500).json({
      error: "Error al obtener favoritos"
    });
  }
};

const crearFavorito = async (req, res) => {
  try {
    const { usuario_id, tipo, referencia_id, nombre } = req.body;

    if (!usuario_id || !tipo || !referencia_id || !nombre) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    const resultado = await favoritoModel.createFavorito(
      usuario_id,
      tipo,
      referencia_id,
      nombre
    );

    res.status(201).json({
      mensaje: "Favorito creado correctamente",
      id: resultado.insertId
    });

  } catch (error) {
    console.error("Error al crear favorito:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Este equipo ya está en favoritos"
      });
    }

    res.status(500).json({
      error: "Error al crear favorito"
    });
  }
};

const actualizarFavorito = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;

    await favoritoModel.updateFavorito(id, nombre);

    res.json({
      mensaje: "Favorito actualizado correctamente"
    });

  } catch (error) {
    console.error("Error al actualizar favorito:", error);

    res.status(500).json({
      error: "Error al actualizar favorito"
    });
  }
};

const eliminarFavorito = async (req, res) => {
  try {
    const { id } = req.params;

    await favoritoModel.deleteFavorito(id);

    res.json({
      mensaje: "Favorito eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar favorito:", error);

    res.status(500).json({
      error: "Error al eliminar favorito"
    });
  }
};

module.exports = {
  obtenerFavoritos,
  crearFavorito,
  actualizarFavorito,
  eliminarFavorito
};