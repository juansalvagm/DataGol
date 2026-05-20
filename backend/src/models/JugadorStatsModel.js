const db = require("../config/db");

const guardarStatsJugador = async (nombreJugador, liga, temporada, estadisticas) => {
  const stats = estadisticas || {};

  const partidos = stats.games?.appearences ?? 0;
  const minutos = stats.games?.minutes ?? 0;
  const goles = stats.goals?.total ?? 0;
  const asistencias = stats.goals?.assists ?? 0;
  const amarillas = stats.cards?.yellow ?? 0;
  const rojas = stats.cards?.red ?? 0;

  await db.query(
    `INSERT INTO jugador_stats
    (jugador_nombre, liga, temporada, partidos, minutos, goles, asistencias, amarillas, rojas, fuente)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      partidos = VALUES(partidos),
      minutos = VALUES(minutos),
      goles = VALUES(goles),
      asistencias = VALUES(asistencias),
      amarillas = VALUES(amarillas),
      rojas = VALUES(rojas),
      fuente = VALUES(fuente)`,
    [
      nombreJugador,
      liga,
      temporada,
      partidos,
      minutos,
      goles,
      asistencias,
      amarillas,
      rojas,
      "api"
    ]
  );
};

const getStatsJugadorDB = async (nombreJugador, liga) => {
  const [rows] = await db.query(
    `SELECT *
     FROM jugador_stats
     WHERE jugador_nombre = ? AND liga = ?
     ORDER BY temporada DESC
     LIMIT 1`,
    [nombreJugador, liga]
  );

  return rows[0];
};

module.exports = {
  guardarStatsJugador,
  getStatsJugadorDB
};