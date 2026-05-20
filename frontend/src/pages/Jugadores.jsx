import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import PlayerStatsChart from "../components/PlayerStatsChart";

const obtenerGrupoPosicion = (jugador) => {
  const posicion = jugador.position || "";

  if (posicion.includes("Goalkeeper")) return "Goalkeeper";
  if (posicion.includes("Defence")) return "Defence";
  if (posicion.includes("Midfield")) return "Midfield";
  if (posicion.includes("Attack")) return "Attack";

  return "Other";
};

const obtenerIndicePorPosicion = (jugador, plantilla) => {
  const grupo = obtenerGrupoPosicion(jugador);

  const jugadoresMismaPosicion = plantilla.filter(
    (j) => obtenerGrupoPosicion(j) === grupo
  );

  return jugadoresMismaPosicion.findIndex(
    (j) => j.name === jugador.name
  );
};

const generarStatsEstimadas = (
  jugador,
  plantilla = []
) => {
  const seed = jugador.name
    .split("")
    .reduce(
      (acc, letra) => acc + letra.charCodeAt(0),
      0
    );

  const grupo = obtenerGrupoPosicion(jugador);
  const indice = obtenerIndicePorPosicion(
    jugador,
    plantilla
  );

  const edad = jugador.dateOfBirth
    ? new Date().getFullYear() -
      new Date(
        jugador.dateOfBirth
      ).getFullYear()
    : 25;

  const esJoven = edad <= 21;
  const esVeterano = edad >= 32;

  const factorEdad = esJoven
    ? 0.6
    : esVeterano
    ? 0.8
    : 1;

  const calcularMinutos = (
    partidos,
    media
  ) =>
    Math.round(
      partidos * media * factorEdad
    );

  if (grupo === "Goalkeeper") {
    const partidosPorRol = [32, 6, 1, 0];

    const partidos = Math.round(
      (partidosPorRol[indice] ?? 0) *
        factorEdad
    );

    return {
      games: {
        appearences: partidos,
        minutes: partidos * 90
      },
      goals: {
        total: Math.max(
          0,
          partidos + (seed % 18)
        ),
        assists: Math.max(
          0,
          Math.floor(partidos / 3)
        )
      },
      cards: {
        yellow:
          indice === 0 ? seed % 3 : 0,
        red: 0
      },
      fuente: "estimada"
    };
  }

  if (grupo === "Defence") {
    const partidosPorRol = [
      30, 28, 25, 22, 16, 10, 5, 2
    ];

    const partidos = Math.max(
      1,
      Math.round(
        (partidosPorRol[indice] ?? 1) *
          factorEdad
      )
    );

    return {
      games: {
        appearences: partidos,
        minutes: calcularMinutos(
          partidos,
          indice <= 3 ? 75 : 45
        )
      },
      goals: {
        total:
          indice <= 2
            ? seed % 4
            : seed % 2,
        assists:
          indice <= 3
            ? seed % 5
            : seed % 2
      },
      cards: {
        yellow:
          indice <= 5
            ? seed % 7
            : seed % 3,
        red: seed % 2
      },
      fuente: "estimada"
    };
  }

  if (grupo === "Midfield") {
    const partidosPorRol = [
      32, 29, 26, 22, 18, 13, 8, 4
    ];

    const partidos = Math.max(
      1,
      Math.round(
        (partidosPorRol[indice] ?? 1) *
          factorEdad
      )
    );

    return {
      games: {
        appearences: partidos,
        minutes: calcularMinutos(
          partidos,
          indice <= 3 ? 70 : 42
        )
      },
      goals: {
        total:
          indice <= 2
            ? (seed % 7) + 2
            : seed % 3,
        assists:
          indice <= 2
            ? (seed % 11) + 3
            : seed % 4
      },
      cards: {
        yellow:
          indice <= 5
            ? seed % 6
            : seed % 3,
        red: seed % 2
      },
      fuente: "estimada"
    };
  }

  if (grupo === "Attack") {
    const partidosPorRol = [
      31, 27, 23, 17, 11, 6, 2
    ];

    const partidos = Math.max(
      1,
      Math.round(
        (partidosPorRol[indice] ?? 1) *
          factorEdad
      )
    );

    return {
      games: {
        appearences: partidos,
        minutes: calcularMinutos(
          partidos,
          indice <= 2 ? 68 : 38
        )
      },
      goals: {
        total:
          indice === 0
            ? (seed % 18) + 15
            : indice === 1
            ? (seed % 12) + 7
            : indice === 2
            ? (seed % 8) + 4
            : seed % 3,
        assists:
          indice <= 2
            ? (seed % 8) + 2
            : seed % 2
      },
      cards: {
        yellow: seed % 4,
        red: seed % 2
      },
      fuente: "estimada"
    };
  }

  const partidos = Math.max(
    1,
    Math.round(
      ((seed % 14) + 3) * factorEdad
    )
  );

  return {
    games: {
      appearences: partidos,
      minutes: calcularMinutos(
        partidos,
        50
      )
    },
    goals: {
      total: seed % 4,
      assists: seed % 4
    },
    cards: {
      yellow: seed % 4,
      red: seed % 2
    },
    fuente: "estimada"
  };
};

function Jugadores() {
  const { idEquipo, liga } =
    useParams();

  const [equipo, setEquipo] =
    useState(null);

  const [jugadores, setJugadores] =
    useState([]);

  const [stats, setStats] = useState(
    {}
  );

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    const cargarJugadores = async () => {
      try {
        setCargando(true);

        const response = await api.get(
          `/jugadores/${idEquipo}`
        );

        setEquipo(response.data);

        const plantilla =
          response.data.squad || [];

        setJugadores(plantilla);

        const statsMap = {};

        for (const jugador of plantilla) {
          try {
            const responseStats =
              await api.get(
                `/stats/${encodeURIComponent(
                  jugador.name
                )}`
              );

            const estadisticas =
              responseStats.data
                ?.response?.[0]
                ?.statistics?.[0];

            if (estadisticas) {
              statsMap[jugador.name] = {
                ...estadisticas,
                fuente:
                  responseStats.data
                    ?.fuente ||
                  estadisticas?.fuente ||
                  "csv_real"
              };
            } else {
              statsMap[jugador.name] =
                generarStatsEstimadas(
                  jugador,
                  plantilla
                );
            }
          } catch (error) {
            statsMap[jugador.name] =
              generarStatsEstimadas(
                jugador,
                plantilla
              );
          }
        }

        setStats(statsMap);
      } catch (error) {
        console.error(
          "Error al cargar jugadores:",
          error
        );
      } finally {
        setCargando(false);
      }
    };

    cargarJugadores();
  }, [idEquipo, liga]);

  return (
    <div className="app-shell">
      <div className="container">
        <Link
          to={`/equipos/${liga}`}
          className="back-link"
        >
          ← Volver a equipos
        </Link>

        <div className="page-header">
          <h1>
            {equipo?.name ||
              "Jugadores"}
          </h1>

          <p>
            Plantilla con estadísticas
            reales y estimadas
          </p>
        </div>

        {cargando ? (
          <div className="empty-state">
            Cargando jugadores...
          </div>
        ) : jugadores.length === 0 ? (
          <div className="empty-state">
            No hay jugadores para mostrar.
          </div>
        ) : (
          <div className="grid list-grid">
            {jugadores.map((jugador) => {
              const estadisticas =
                stats[jugador.name] ||
                generarStatsEstimadas(
                  jugador,
                  jugadores
                );

              const esPortero =
                obtenerGrupoPosicion(
                  jugador
                ) === "Goalkeeper";

              const porteriasCero =
                Math.max(
                  0,
                  Math.floor(
                    (estadisticas.games
                      ?.appearences || 0) / 3
                  )
                );

              return (
                <div
                  className="card card-content"
                  key={
                    jugador.id ||
                    jugador.name
                  }
                >
                  <div className="player-row">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        jugador.name
                      )}&background=19e35f&color=07110b&bold=true&size=128`}
                      alt={jugador.name}
                      className="player-avatar"
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius:
                          "50%",
                        objectFit:
                          "cover",
                        border:
                          "3px solid rgba(25,227,95,0.35)",
                        background:
                          "#ffffff",
                        boxShadow:
                          "0 0 14px rgba(25,227,95,0.25)"
                      }}
                    />

                    <div className="player-info">
                      <h3>
                        {jugador.name}
                      </h3>

                      <p>
                        {jugador.position ||
                          "Posición no disponible"}
                      </p>
                    </div>
                  </div>

                  <div className="card-meta">
                    <strong>
                      Nacionalidad:
                    </strong>{" "}
                    {jugador.nationality ||
                      "No disponible"}
                  </div>

                  <div className="card-meta">
                    <strong>
                      Fecha nacimiento:
                    </strong>{" "}
                    {jugador.dateOfBirth
                      ? new Date(
                          jugador.dateOfBirth
                        ).toLocaleDateString()
                      : "No disponible"}
                  </div>

                  <div className="card-meta">
                    <strong>Rol:</strong>{" "}
                    {jugador.role ||
                      "No disponible"}
                  </div>

                  <div
                    style={{
                      marginTop: "16px"
                    }}
                  >
                    <div className="tag">
                      {estadisticas.fuente ===
                      "csv_real"
                        ? "Stats reales"
                        : "Stats estimadas"}
                    </div>

                    <div className="card-meta">
                      <strong>
                        Partidos:
                      </strong>{" "}
                      {estadisticas.games
                        ?.appearences ??
                        0}
                    </div>

                    <div className="card-meta">
                      <strong>
                        Minutos:
                      </strong>{" "}
                      {estadisticas.games
                        ?.minutes ?? 0}
                    </div>

                    {esPortero ? (
                      <>
                        <div className="card-meta">
                          <strong>
                            Goles encajados:
                          </strong>{" "}
                          {estadisticas.goals
                            ?.total ?? 0}
                        </div>

                        <div className="card-meta">
                          <strong>
                            Porterías a 0:
                          </strong>{" "}
                          {porteriasCero}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="card-meta">
                          <strong>
                            Goles:
                          </strong>{" "}
                          {estadisticas.goals
                            ?.total ?? 0}
                        </div>

                        <div className="card-meta">
                          <strong>
                            Asistencias:
                          </strong>{" "}
                          {estadisticas.goals
                            ?.assists ?? 0}
                        </div>
                      </>
                    )}

                    <div className="card-meta">
                      <strong>
                        Amarillas:
                      </strong>{" "}
                      {estadisticas.cards
                        ?.yellow ?? 0}
                    </div>

                    <div className="card-meta">
                      <strong>
                        Rojas:
                      </strong>{" "}
                      {estadisticas.cards
                        ?.red ?? 0}
                    </div>

                    <PlayerStatsChart
                      estadisticas={
                        estadisticas
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jugadores;