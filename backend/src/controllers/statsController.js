const statsLocalModel = require("../models/statsLocalModel");

const generarStatsEstimadas = (nombreJugador) => {
  const seed = nombreJugador
    .split("")
    .reduce((acc, letra) => acc + letra.charCodeAt(0), 0);

  return {
    games: {
      appearences: (seed % 28) + 1,
      minutes: (seed % 2400) + 300
    },
    goals: {
      total: seed % 16,
      assists: seed % 10
    },
    cards: {
      yellow: seed % 7,
      red: seed % 2
    },
    fuente: "estimada"
  };
};

const obtenerEstadisticasJugador = async (req, res) => {
  const nombreJugador = req.params.nombreJugador;

  try {
    const jugadorLocal = await statsLocalModel.buscarJugadorLocal(nombreJugador);

    if (jugadorLocal) {
      return res.json({
        response: [
          {
            player: {
              name: nombreJugador
            },
            statistics: [
              {
                team: {
                  name: jugadorLocal.team
                },
                league: {
                  name: jugadorLocal.competition
                },
                games: {
                  appearences:
                    Number(jugadorLocal.matches_played) || 0,
                  minutes:
                    Number(jugadorLocal.minutes_played) || 0
                },
                goals: {
                  total: Number(jugadorLocal.goals) || 0,
                  assists:
                    Number(jugadorLocal.assists) || 0
                },
                cards: {
                  yellow:
                    Number(jugadorLocal.yellow_cards) || 0,
                  red:
                    Number(jugadorLocal.red_cards) || 0
                },
                fuente: "csv_real"
              }
            ]
          }
        ],
        results: 1,
        fuente: "csv_real"
      });
    }

    return res.json({
      response: [
        {
          player: {
            name: nombreJugador
          },
          statistics: [
            generarStatsEstimadas(nombreJugador)
          ]
        }
      ],
      results: 1,
      fuente: "estimada"
    });
  } catch (error) {
    console.error("Error stats local:", error.message);

    return res.json({
      response: [
        {
          player: {
            name: nombreJugador
          },
          statistics: [
            generarStatsEstimadas(nombreJugador)
          ]
        }
      ],
      results: 1,
      fuente: "estimada"
    });
  }
};

module.exports = { obtenerEstadisticasJugador };