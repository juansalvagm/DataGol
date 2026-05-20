const db = require("../config/db");

const getAllUsuarios = async () => {
  const [rows] = await db.query(
    "SELECT id, nombre, email, rol, fecha_creacion FROM usuarios"
  );
  return rows;
};

const getUsuarioById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, nombre, email, rol, fecha_creacion FROM usuarios WHERE id = ?",
    [id]
  );
  return rows[0];
};

const createUsuario = async (nombre, email, password, rol) => {
  const [result] = await db.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    [nombre, email, password, rol]
  );
  return result;
};

const updateUsuario = async (id, nombre, email, password, rol) => {
  const [result] = await db.query(
    "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?",
    [nombre, email, password, rol, id]
  );
  return result;
};

const deleteUsuario = async (id) => {
  const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
  return result;
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};