import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const obtenerLinkEntradas = (nombreEquipo) => {
  const enlacesOficiales = {
    "Real Madrid CF": "https://www.realmadrid.com/entradas",
    "FC Barcelona": "https://www.fcbarcelona.es/es/entradas/futbol",
    "Club Atlético de Madrid": "https://www.atleticodemadrid.com/atm/tickets",
    "Atlético de Madrid": "https://www.atleticodemadrid.com/atm/tickets",
    "Sevilla FC": "https://sevillafc.es/entradas",
    "Valencia CF": "https://www.valenciacf.com/es/club/entradas",
    "Manchester City FC": "https://www.mancity.com/tickets",
    "Liverpool FC": "https://www.liverpoolfc.com/tickets",
    "Arsenal FC": "https://www.arsenal.com/tickets",
    "Chelsea FC": "https://www.chelseafc.com/en/tickets",
    "Paris Saint-Germain FC": "https://billetterie.psg.fr",
    "FC Bayern München": "https://fcbayern.com/en/tickets"
  };

  return (
    enlacesOficiales[nombreEquipo] ||
    `https://www.google.com/search?q=${encodeURIComponent(
      `comprar entradas ${nombreEquipo}`
    )}`
  );
};

function Equipos() {
  const { liga } = useParams();

  const [equipos, setEquipos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        const response = await api.get(`/ligas/equipos/${liga}`);
        setEquipos(response.data.teams || []);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      }
    };

    const cargarFavoritos = async () => {
      try {
        const usuario = JSON.parse(
          localStorage.getItem("usuario")
        );

        if (!usuario || !usuario.id) return;

        const response = await api.get(
          `/favoritos?usuario_id=${usuario.id}`
        );

        setFavoritos(response.data || []);

      } catch (error) {
        console.error("Error cargando favoritos:", error);
      }
    };

    cargarEquipos();
    cargarFavoritos();

  }, [liga]);

  const agregarFavorito = async (equipo, e) => {
    e.preventDefault();
    e.stopPropagation();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para añadir favoritos.",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });

      return;
    }

    const yaExiste = favoritos.some(
      (fav) =>
        fav.referencia_id === equipo.id
    );

    if (yaExiste) {
      Swal.fire({
        icon: "info",
        title: "Ya añadido",
        text: "Este equipo ya está en favoritos ⭐",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });

      return;
    }

    try {
      await api.post("/favoritos", {
        usuario_id: usuario.id,
        tipo: "equipo",
        referencia_id: equipo.id,
        nombre: equipo.name
      });

      setFavoritos([
        ...favoritos,
        {
          referencia_id: equipo.id
        }
      ]);

      Swal.fire({
        icon: "success",
        title: "Añadido a favoritos",
        text: `${equipo.name} se añadió correctamente ⭐`,
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No se pudo guardar el favorito",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  const abrirEntradas = (equipo, e) => {
    e.preventDefault();
    e.stopPropagation();

    window.open(
      obtenerLinkEntradas(equipo.name),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="app-shell">
      <div className="container">
        <Link to="/ligas" className="back-link">
          ← Volver a ligas
        </Link>

        <div className="page-header">
          <h1>Equipos</h1>
          <p>Liga: {liga}</p>
        </div>

        {equipos.length === 0 ? (
          <div className="empty-state">
            No hay equipos.
          </div>
        ) : (
          <div className="grid list-grid">
            {equipos.map((equipo) => {
              const esFavorito = favoritos.some(
                (fav) =>
                  fav.referencia_id === equipo.id
              );

              return (
                <Link
                  to={`/jugadores/${equipo.id}/${liga}`}
                  className="card card-link"
                  key={equipo.id}
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
                    Estadio: {equipo.venue || "No disponible"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "14px"
                    }}
                  >
                   <button
  onClick={(e) =>
    agregarFavorito(equipo, e)
  }
  className={`btn ${
    esFavorito
      ? "btn-success"
      : "btn-primary"
  }`}
  type="button"
  disabled={esFavorito}
  style={{
    opacity: esFavorito ? 0.7 : 1,
    cursor: esFavorito
      ? "not-allowed"
      : "pointer"
  }}
>
  {esFavorito
    ? "✅ Ya en favoritos"
    : "⭐ Favorito"}
</button>

                    <button
                      onClick={(e) =>
                        abrirEntradas(equipo, e)
                      }
                      className="btn btn-primary"
                      type="button"
                    >
                      🎟 Entradas
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Equipos;