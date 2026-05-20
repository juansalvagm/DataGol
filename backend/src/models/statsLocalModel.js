const db = require("../config/db");

const normalizar = (texto = "") => {
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const buscarJugadorLocal = async (nombre) => {
  const nombreNormalizado = normalizar(nombre);
  const partes = nombreNormalizado.split(" ");
  const apellido = partes[partes.length - 1] || "";

  const [rows] = await db.query(`
    SELECT
      player_name,
      team,
      competition,
      matches_played,
      minutes_played,
      goals,
      assists,
      yellow_cards,
      red_cards
    FROM jugador_stats_real
  `);

  const exacto = rows.find(
    (row) => normalizar(row.player_name) === nombreNormalizado
  );

  if (exacto) return exacto;

  const parcialCompleto = rows.find((row) => {
    const nombreDB = normalizar(row.player_name);

    return (
      nombreDB.includes(nombreNormalizado) ||
      nombreNormalizado.includes(nombreDB)
    );
  });

  if (parcialCompleto) return parcialCompleto;

  const porApellido = rows.find((row) => {
    const nombreDB = normalizar(row.player_name);
    return nombreDB.split(" ").includes(apellido);
  });

  return porApellido || null;
};

module.exports = {
  buscarJugadorLocal
};