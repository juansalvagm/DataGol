const db = require("../config/db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y password obligatorios" });
    }

    const [rows] = await db.query(
      "SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: rows[0]
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

module.exports = { login };