const db = require("../config/db");

const obtenerEquipos = async () => {
  const [rows] = await db.query(
    "SELECT * FROM equipos"
  );

  return rows;
};

const obtenerEquipoPorId = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM equipos WHERE id = ?",
    [id]
  );

  return rows[0];
};

const crearEquipo = async (
  nombre,
  liga,
  pais,
  escudo_url,
  usuario_id
) => {
  const [result] = await db.query(
    `INSERT INTO equipos
     (
       nombre,
       liga,
       pais,
       escudo_url,
       usuario_id
     )
     VALUES (?, ?, ?, ?, ?)`,
    [
      nombre,
      liga,
      pais,
      escudo_url,
      usuario_id
    ]
  );

  return result;
};

const actualizarEquipo = async (
  id,
  nombre,
  liga,
  pais,
  escudo_url
) => {
  const [result] = await db.query(
    `UPDATE equipos
     SET nombre = ?,
         liga = ?,
         pais = ?,
         escudo_url = ?
     WHERE id = ?`,
    [
      nombre,
      liga,
      pais,
      escudo_url,
      id
    ]
  );

  return result;
};

const eliminarEquipo = async (id) => {
  const [result] = await db.query(
    "DELETE FROM equipos WHERE id = ?",
    [id]
  );

  return result;
};

module.exports = {
  obtenerEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo
};