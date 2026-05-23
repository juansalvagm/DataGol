const db = require("../config/db");

const getFavoritos = async (usuario_id) => {
  const [rows] = await db.query(
    `
    SELECT * FROM favoritos
    WHERE usuario_id = ?
    ORDER BY id DESC
    `,
    [usuario_id]
  );

  return rows;
};

const createFavorito = async (
  usuario_id,
  tipo,
  referencia_id,
  nombre
) => {
  const [result] = await db.query(
    `
    INSERT INTO favoritos (
      usuario_id,
      tipo,
      referencia_id,
      nombre
    )
    VALUES (?, ?, ?, ?)
    `,
    [usuario_id, tipo, referencia_id, nombre]
  );

  return result;
};

const updateFavorito = async (id, nombre) => {
  const [result] = await db.query(
    `
    UPDATE favoritos
    SET nombre = ?
    WHERE id = ?
    `,
    [nombre, id]
  );

  return result;
};

const deleteFavorito = async (id) => {
  const [result] = await db.query(
    "DELETE FROM favoritos WHERE id = ?",
    [id]
  );

  return result;
};

module.exports = {
  getFavoritos,
  createFavorito,
  updateFavorito,
  deleteFavorito
};