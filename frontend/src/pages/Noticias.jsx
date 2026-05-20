import { useEffect, useState } from "react";
import api from "../services/api";

function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const response = await api.get("/noticias");
        setNoticias(response.data || []);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarNoticias();
  }, []);

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Noticias</h1>
          <p>Actualidad diaria del fútbol.</p>
        </div>

        {cargando ? (
          <div className="empty-state">
            Cargando noticias...
          </div>
        ) : noticias.length === 0 ? (
          <div className="empty-state">
            No hay noticias disponibles.
          </div>
        ) : (
          <div className="grid list-grid">
            {noticias.map((noticia, index) => (
              <a
                href={noticia.enlace}
                target="_blank"
                rel="noreferrer"
                className="card card-link"
                key={index}
              >
                <div className="card-icon">📰</div>

                <h3 className="card-title">
                  {noticia.titulo}
                </h3>

                <p className="card-text">
                  {noticia.descripcion?.slice(0, 160)}...
                </p>

                <div className="card-meta">
                  {noticia.fuente}
                </div>

                <div className="card-meta">
                  {noticia.fecha
                    ? new Date(noticia.fecha).toLocaleDateString("es-ES")
                    : "Fecha no disponible"}
                </div>

                <div className="tag">
                  Leer noticia
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Noticias;