import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Ligas() {
  const [ligas, setLigas] = useState([]);

  useEffect(() => {
    const cargarLigas = async () => {
      try {
        const response = await api.get("/ligas");
        setLigas(response.data.competitions || []);
      } catch (error) {
        console.error("Error al cargar ligas:", error);
      }
    };

    cargarLigas();
  }, []);

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Ligas</h1>
          <p>Selecciona qué quieres ver de cada competición.</p>
        </div>

        {ligas.length === 0 ? (
          <div className="empty-state">No hay ligas.</div>
        ) : (
          <div className="grid list-grid">
            {ligas.map((liga) => (
              <div className="card card-content" key={liga.id}>
                <div className="team-row">
                  <div className="team-badge">🏆</div>
                  <div className="team-info">
                    <h3>{liga.name}</h3>
                    <p>{liga.area?.name}</p>
                  </div>
                </div>

                <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link to={`/equipos/${liga.code}`} className="tag">Equipos</Link>
                  <Link to={`/partidos/${liga.code}`} className="tag">Partidos</Link>
                  <Link to={`/clasificacion/${liga.code}`} className="tag">Clasificación</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ligas;