import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function PartidoDetalle() {
  const { id } = useParams();
  const [partido, setPartido] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const response = await api.get(`/sportmonks/fixtures/${id}`);
        console.log("DETALLE FRONT:", response.data.data);
        setPartido(response.data.data);
      } catch (error) {
        console.error("Error cargando partido:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  if (cargando) {
    return (
      <div className="app-shell">
        <div className="container">
          <div className="empty-state">Cargando partido...</div>
        </div>
      </div>
    );
  }

  if (!partido) {
    return (
      <div className="app-shell">
        <div className="container">
          <div className="empty-state">No se encontró el partido.</div>
        </div>
      </div>
    );
  }

  const local = partido.participants?.find(
    (equipo) => equipo.meta?.location === "home"
  );

  const visitante = partido.participants?.find(
    (equipo) => equipo.meta?.location === "away"
  );

  const getGoles = (equipoId) => {
    const score = partido.scores?.find(
      (s) => s.participant_id === equipoId && s.description === "CURRENT"
    );

    return score?.score?.goals ?? "-";
  };

  const getNombreEquipo = (participantId) => {
    const equipo = partido.participants?.find((p) => p.id === participantId);
    return equipo?.name || "Equipo";
  };

  return (
    <div className="app-shell">
      <div className="container">
        <Link to="/partidos/SM" className="back-link">
          ← Volver a partidos
        </Link>

        <section className="hero">
          <h1>
            {local?.name || "Local"}{" "}
            <span style={{ color: "#19e35f" }}>
              {getGoles(local?.id)} - {getGoles(visitante?.id)}
            </span>{" "}
            {visitante?.name || "Visitante"}
          </h1>

          <p>
            {partido.starting_at
              ? new Date(partido.starting_at).toLocaleString("es-ES")
              : "Fecha no disponible"}
          </p>
        </section>

        <div className="page-header">
          <h1>Estadísticas del partido</h1>
          <p>Datos recibidos desde Sportmonks</p>
        </div>

        {partido.statistics?.length > 0 ? (
          <div className="grid list-grid">
            {partido.statistics.map((stat, index) => (
              <div className="card card-content" key={stat.id || index}>
                <h3 className="card-title">
                  {stat.type?.name || "Estadística"}
                </h3>

                <p className="card-text">
                  <strong style={{ color: "#19e35f" }}>
                    {stat.data?.value ??
                      stat.data?.count ??
                      stat.value ??
                      "N/D"}
                  </strong>
                </p>

                <div className="card-meta">
                  Equipo: {getNombreEquipo(stat.participant_id)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Sportmonks no está devolviendo estadísticas para este partido.
          </div>
        )}

        <div className="page-header" style={{ marginTop: "32px" }}>
          <h1>Eventos</h1>
          <p>Goles, tarjetas y acciones destacadas</p>
        </div>

        {partido.events?.length > 0 ? (
          <div className="grid list-grid">
            {partido.events.map((evento, index) => (
              <div className="card card-content" key={evento.id || index}>
                <h3 className="card-title">
                  Minuto {evento.minute ?? "?"}
                </h3>

                <p className="card-text">
                  {evento.type?.name || "Evento"}
                </p>

                <div className="card-meta">
                  Jugador ID: {evento.player_id || "N/D"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No hay eventos disponibles para este partido.
          </div>
        )}

        <div className="page-header" style={{ marginTop: "32px" }}>
          <h1>Alineaciones</h1>
        </div>

        {partido.lineups?.length > 0 ? (
          <div className="grid list-grid">
            {partido.lineups.map((lineup, index) => (
              <div className="card card-content" key={lineup.id || index}>
                <h3 className="card-title">
                  {lineup.player?.display_name ||
                    lineup.player?.name ||
                    "Jugador"}
                </h3>

                <p className="card-text">
                  Equipo: {getNombreEquipo(lineup.team_id || lineup.participant_id)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No hay alineaciones disponibles para este partido.
          </div>
        )}
      </div>
    </div>
  );
}

export default PartidoDetalle;