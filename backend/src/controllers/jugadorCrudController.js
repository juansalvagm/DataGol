const Jugador = require("../models/jugadorModel");

const obtenerJugadores = async (req, res) => {
  try {
    const jugadores =
      await Jugador.obtenerJugadores();

    res.json(jugadores);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador =
      await Jugador.obtenerJugadorPorId(
        req.params.id
      );

    res.json(jugador);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const crearJugador = async (req, res) => {
  try {
    const {
      nombre,
      posicion,
      nacionalidad,
      equipo_id,
      usuario_id
    } = req.body;

    const resultado =
      await Jugador.crearJugador(
        nombre,
        posicion,
        nacionalidad,
        equipo_id,
        usuario_id
      );

    res.json(resultado);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const actualizarJugador = async (req, res) => {
  try {
    const {
      nombre,
      posicion,
      nacionalidad
    } = req.body;

    const resultado =
      await Jugador.actualizarJugador(
        req.params.id,
        nombre,
        posicion,
        nacionalidad
      );

    res.json(resultado);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const eliminarJugador = async (req, res) => {
  try {
    const resultado =
      await Jugador.eliminarJugador(
        req.params.id
      );

    res.json(resultado);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  obtenerJugadores,
  obtenerJugadorPorId,
  crearJugador,
  actualizarJugador,
  eliminarJugador
};