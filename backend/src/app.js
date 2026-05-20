const express = require("express");
const cors = require("cors");

const ligaRoutes = require("./routes/ligaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const favoritoRoutes = require("./routes/favoritoRoutes");
const jugadorRoutes = require("./routes/jugadorRoutes");
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require("./routes/authRoutes");
const noticiasRoutes = require("./routes/noticiasRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de DataGol funcionando 🚀" });
});

app.use("/api/ligas", ligaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/favoritos", favoritoRoutes);
app.use("/api/jugadores", jugadorRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/noticias", noticiasRoutes);

module.exports = app;