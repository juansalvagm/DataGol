const db = require("../config/db");

const obtenerJugadores = async () => {
  const [rows] = await db.query(
    "SELECT * FROM jugadores"
  );

  return rows;
};

const obtenerJugadorPorId = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM jugadores WHERE id = ?",
    [id]
  );

  return rows[0];
};

const crearJugador = async (
  nombre,
  posicion,
  nacionalidad,
  equipo_id,
  usuario_id
) => {
  const [result] = await db.query(
    `INSERT INTO jugadores
    (
      nombre,
      posicion,
      nacionalidad,
      equipo_id,
      usuario_id
    )
    VALUES (?, ?, ?, ?, ?)`,
    [
      nombre,
      posicion,
      nacionalidad,
      equipo_id,
      usuario_id
    ]
  );

  return result;
};

const actualizarJugador = async (
  id,
  nombre,
  posicion,
  nacionalidad
) => {
  const [result] = await db.query(
    `UPDATE jugadores
     SET nombre = ?,
         posicion = ?,
         nacionalidad = ?
     WHERE id = ?`,
    [
      nombre,
      posicion,
      nacionalidad,
      id
    ]
  );

  return result;
};

const eliminarJugador = async (id) => {
  const [result] = await db.query(
    "DELETE FROM jugadores WHERE id = ?",
    [id]
  );

  return result;
};

module.exports = {
  obtenerJugadores,
  obtenerJugadorPorId,
  crearJugador,
  actualizarJugador,
  eliminarJugador
};