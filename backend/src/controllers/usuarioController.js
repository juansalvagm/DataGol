const usuarioModel = require("../models/usuarioModel");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.getAllUsuarios();
    res.json(usuarios);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuarioModel.getUsuarioById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.json(usuario);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Nombre, email y password son obligatorios"
      });
    }

    const resultado = await usuarioModel.createUsuario(
      nombre,
      email,
      password,
      rol || "usuario"
    );

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id: resultado.insertId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const resultado = await usuarioModel.updateUsuario(
      req.params.id,
      nombre,
      email,
      password,
      rol
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const resultado = await usuarioModel.deleteUsuario(req.params.id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};