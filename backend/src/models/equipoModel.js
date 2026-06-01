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
  pais
) => {

  const [result] =
    await db.query(

      `INSERT INTO equipos
       (nombre, liga, pais)
       VALUES (?, ?, ?)`,

      [nombre, liga, pais]
    );

  return result;
};

const actualizarEquipo =
  async (
    id,
    nombre,
    liga,
    pais
  ) => {

  const [result] =
    await db.query(

      `UPDATE equipos
       SET nombre = ?,
           liga = ?,
           pais = ?
       WHERE id = ?`,

      [
        nombre,
        liga,
        pais,
        id
      ]
    );

  return result;
};

const eliminarEquipo =
  async (id) => {

  const [result] =
    await db.query(
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