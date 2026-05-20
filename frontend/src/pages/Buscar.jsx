import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Buscar() {
  const { texto } = useParams();
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const ligas = ["PL", "PD", "SA", "BL1", "FL1"];

  useEffect(() => {
    const buscarEquipos = async () => {
      try {
        setCargando(true);

        const busqueda = texto.toLowerCase().trim();
        let resultados = [];

        for (const liga of ligas) {
          const response = await api.get(`/ligas/equipos/${liga}`);
          const equiposLiga = response.data.teams || [];

          const equiposFiltrados = equiposLiga.filter((equipo) =>
            equipo.name?.toLowerCase().includes(busqueda)
          );

          resultados = [
            ...resultados,
            ...equiposFiltrados.map((equipo) => ({
              ...equipo,
              liga
            }))
          ];
        }

        setEquipos(resultados);
      } catch (error) {
        console.error("Error buscando equipos:", error);
      } finally {
        setCargando(false);
      }
    };

    buscarEquipos();
  }, [texto]);

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Resultados de búsqueda</h1>
          <p>Has buscado: {texto}</p>
        </div>

        {cargando ? (
          <div className="empty-state">Buscando...</div>
        ) : equipos.length === 0 ? (
          <div className="empty-state">No se encontraron equipos.</div>
        ) : (
          <div className="grid list-grid">
            {equipos.map((equipo) => (
              <Link
                to={`/jugadores/${equipo.id}/${equipo.liga}`}
                className="card card-link"
                key={`${equipo.id}-${equipo.liga}`}
              >
                <div className="team-row">
                  <img
                    src={equipo.crest}
                    alt={equipo.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                      backgroundColor: "white",
                      borderRadius: "10px",
                      padding: "5px"
                    }}
                  />

                  <div className="team-info">
                    <h3>{equipo.name}</h3>
                    <p>{equipo.area?.name || "Sin país"}</p>
                  </div>
                </div>

                <div className="card-meta">
                  Liga: {equipo.liga}
                </div>

                <div className="card-meta">
                  Estadio: {equipo.venue || "No disponible"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Buscar;