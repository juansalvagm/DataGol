import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");

  const cargarFavoritos = async () => {
    try {
      const usuario = JSON.parse(
        localStorage.getItem("usuario")
      );

      console.log(usuario);

      const response = await api.get(
        `/favoritos?usuario_id=${usuario.id}`
      );

      setFavoritos(response.data || []);

    } catch (error) {
      console.error("Error al cargar favoritos:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los favoritos.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const iniciarEdicion = (favorito) => {
    setEditandoId(favorito.id);
    setNuevoNombre(favorito.nombre);
  };

  const guardarEdicion = async (id) => {
    try {
      await api.put(`/favoritos/${id}`, {
        nombre: nuevoNombre
      });

      setFavoritos(
        favoritos.map((favorito) =>
          favorito.id === id
            ? { ...favorito, nombre: nuevoNombre }
            : favorito
        )
      );

      setEditandoId(null);

      Swal.fire({
        icon: "success",
        title: "Favorito actualizado",
        text: "El favorito se modificó correctamente ⭐",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });

    } catch (error) {
      console.error("Error al actualizar favorito:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el favorito.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  const eliminarFavorito = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar favorito?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#19e35f",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#07110b",
      color: "#ffffff"
    });

    if (!resultado.isConfirmed) return;

    try {
      await api.delete(`/favoritos/${id}`);

      setFavoritos(
        favoritos.filter((favorito) => favorito.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Favorito eliminado",
        text: "El favorito se eliminó correctamente ⭐",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });

    } catch (error) {
      console.error("Error al eliminar favorito:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el favorito.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Favoritos ⭐</h1>
          <p>Equipos guardados por el usuario</p>
        </div>

        {favoritos.length === 0 ? (
          <div className="empty-state">
            No hay favoritos.
          </div>
        ) : (
          <div className="grid list-grid">
            {favoritos.map((favorito) => (
              <div
                className="card card-content"
                key={favorito.id}
              >
                <div className="team-row">
                  <img
                    src={`https://crests.football-data.org/${favorito.referencia_id}.png`}
                    alt={favorito.nombre}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                      backgroundColor: "white",
                      borderRadius: "10px",
                      padding: "5px"
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/50";
                    }}
                  />

                  <div className="team-info">
                    {editandoId === favorito.id ? (
                      <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(e) =>
                          setNuevoNombre(e.target.value)
                        }
                        className="input"
                        style={{
                          marginBottom: "10px"
                        }}
                      />
                    ) : (
                      <h3>{favorito.nombre}</h3>
                    )}

                    <p>Tipo: {favorito.tipo}</p>
                  </div>
                </div>

                <div className="card-meta">
                  ID equipo: {favorito.referencia_id}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "14px"
                  }}
                >
                  {editandoId === favorito.id ? (
                    <>
                      <button
                        onClick={() =>
                          guardarEdicion(favorito.id)
                        }
                        className="btn btn-primary"
                      >
                        💾 Guardar
                      </button>

                      <button
                        onClick={() => {
                          setEditandoId(null);
                          setNuevoNombre("");
                        }}
                        className="btn"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        iniciarEdicion(favorito)
                      }
                      className="btn btn-primary"
                    >
                      ✏️ Editar
                    </button>
                  )}

                  <button
                    onClick={() =>
                      eliminarFavorito(favorito.id)
                    }
                    className="btn btn-danger"
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;