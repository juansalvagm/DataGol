import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Clasificacion() {
  const { liga } = useParams();
  const [tabla, setTabla] = useState([]);

  useEffect(() => {
    const cargarClasificacion = async () => {
      try {
        const response = await api.get(`/ligas/clasificacion/${liga}`);
        const standings = response.data.standings || [];
        const total = standings.find((s) => s.type === "TOTAL");
        setTabla(total?.table || []);
      } catch (error) {
        console.error("Error al cargar clasificación:", error);
      }
    };

    cargarClasificacion();
  }, [liga]);

  return (
    <div className="app-shell">
      <div className="container">
        <Link to="/ligas" className="back-link">← Volver a ligas</Link>

        <div className="page-header">
          <h1>Clasificación</h1>
          <p>Liga: {liga}</p>
        </div>

        {tabla.length === 0 ? (
          <div className="empty-state">No hay clasificación para mostrar.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#121c2d",
                borderRadius: "12px",
                overflow: "hidden",
                color: "white"
              }}
            >
              <thead>
                <tr style={{ background: "#19e35f", color: "#08120b" }}>
                  <th style={{ padding: "12px" }}>#</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Equipo</th>
                  <th style={{ padding: "12px" }}>PJ</th>
                  <th style={{ padding: "12px" }}>G</th>
                  <th style={{ padding: "12px" }}>E</th>
                  <th style={{ padding: "12px" }}>P</th>
                  <th style={{ padding: "12px" }}>GF</th>
                  <th style={{ padding: "12px" }}>GC</th>
                  <th style={{ padding: "12px" }}>DG</th>
                  <th style={{ padding: "12px" }}>PTS</th>
                </tr>
              </thead>
              <tbody>
                {tabla.map((equipo) => (
                  <tr
                    key={equipo.team.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.position}
                    </td>

                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                      >
                        <img
                          src={equipo.team.crest}
                          alt={equipo.team.name}
                          style={{
                            width: "28px",
                            height: "28px",
                            objectFit: "contain",
                            background: "white",
                            borderRadius: "6px",
                            padding: "2px"
                          }}
                        />
                        <span>{equipo.team.name}</span>
                      </div>
                    </td>

                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.playedGames}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.won}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.draw}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.lost}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.goalsFor}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.goalsAgainst}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {equipo.goalDifference}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#19e35f"
                      }}
                    >
                      {equipo.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clasificacion;