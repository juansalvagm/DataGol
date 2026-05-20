const db = require("../config/db");

const guardarPartidos = async (partidos, liga) => {
  for (const p of partidos) {
    await db.query(
      `INSERT INTO partidos 
      (id, liga, fecha, equipo_local, equipo_visitante, goles_local, goles_visitante, estado, jornada)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      goles_local = VALUES(goles_local),
      goles_visitante = VALUES(goles_visitante),
      estado = VALUES(estado)`,
      [
        p.id,
        liga,
        p.utcDate,
        p.homeTeam.name,
        p.awayTeam.name,
        p.score.fullTime.home ?? 0,
        p.score.fullTime.away ?? 0,
        p.status,
        p.matchday
      ]
    );
  }
};

const getPartidosDB = async (liga) => {
  const [rows] = await db.query(
    "SELECT * FROM partidos WHERE liga = ? ORDER BY fecha",
    [liga]
  );
  return rows;
};

module.exports = {
  guardarPartidos,
  getPartidosDB
};