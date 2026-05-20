import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Partidos() {
  const { liga } = useParams();

  const [partidosPorFecha, setPartidosPorFecha] = useState({});
  const [dias, setDias] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);

  const formatearDia = (fecha) => {
    const hoy = new Date().toISOString().split("T")[0];

    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    const ayerISO = ayer.toISOString().split("T")[0];
    const mananaISO = manana.toISOString().split("T")[0];

    if (fecha === ayerISO) return "Ayer";
    if (fecha === hoy) return "Hoy";
    if (fecha === mananaISO) return "Mañana";

    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "2-digit",
      month: "short"
    });
  };

  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        setCargando(true);

        const response = await api.get(`/ligas/partidos/${liga}`);
        const lista = response.data.matches || response.data || [];

        const agrupados = {};

        lista.forEach((partido) => {
          const fecha = partido.utcDate?.split("T")[0];

          if (!fecha) return;

          if (!agrupados[fecha]) {
            agrupados[fecha] = [];
          }

          agrupados[fecha].push(partido);
        });

        const fechasOrdenadas = Object.keys(agrupados).sort((a, b) =>
          a.localeCompare(b)
        );

        setPartidosPorFecha(agrupados);
        setDias(fechasOrdenadas);

        const hoy = new Date().toISOString().split("T")[0];

        setFechaSeleccionada(
          fechasOrdenadas.includes(hoy) ? hoy : fechasOrdenadas[0] || ""
        );
      } catch (error) {
        console.error("Error cargando partidos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPartidos();
  }, [liga]);

  const partidosDelDia = partidosPorFecha[fechaSeleccionada] || [];

  return (
    <div className="app-shell">
      <div className="container">
        <Link to="/ligas" className="back-link">
          ← Volver a ligas
        </Link>

        <div className="page-header">
          <h1>Partidos</h1>
          <p>Calendario de la liga {liga}</p>
        </div>

        {cargando ? (
          <div className="empty-state">Cargando partidos...</div>
        ) : dias.length === 0 ? (
          <div className="empty-state">No hay partidos disponibles.</div>
        ) : (
          <>
            <div className="match-calendar">
              <div className="calendar-month">
                Temporada:{" "}
                <strong>
                  {new Date(dias[0]).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric"
                  })}{" "}
                  -{" "}
                  {new Date(dias[dias.length - 1]).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric"
                  })}
                </strong>
              </div>

              <div className="calendar-days">
                {dias.map((fecha) => (
                  <button
                    key={fecha}
                    className={
                      fecha === fechaSeleccionada
                        ? "calendar-day active"
                        : "calendar-day"
                    }
                    onClick={() => setFechaSeleccionada(fecha)}
                  >
                    {formatearDia(fecha)}
                  </button>
                ))}
              </div>
            </div>

            <h2 style={{ color: "#19e35f", marginBottom: "18px" }}>
              {new Date(fechaSeleccionada).toLocaleDateString("es-ES", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </h2>

            {partidosDelDia.length === 0 ? (
              <div className="empty-state">No hay partidos para este día.</div>
            ) : (
              <div className="grid list-grid">
                {partidosDelDia.map((partido) => (
                  <div className="card card-content" key={partido.id}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        gap: "12px"
                      }}
                    >
                      <span>{partido.homeTeam?.name || "Local"}</span>

                      <strong>
                        {partido.score?.fullTime?.home ?? "-"} -{" "}
                        {partido.score?.fullTime?.away ?? "-"}
                      </strong>

                      <span style={{ textAlign: "right" }}>
                        {partido.awayTeam?.name || "Visitante"}
                      </span>
                    </div>

                    <div className="card-meta">
                      🕒{" "}
                      {new Date(partido.utcDate).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>

                    <div className="card-meta">
                      📊 Estado: {partido.status || "No disponible"}
                    </div>

                    <div className="card-meta">
                      Jornada: {partido.matchday || "N/D"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Partidos;