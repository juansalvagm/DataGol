import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function JugadoresCRUD() {
  const [jugadores, setJugadores] = useState([]);

  const usuario =
    JSON.parse(localStorage.getItem("usuario")) || {};

  const [formulario, setFormulario] = useState({
    nombre: "",
    posicion: "",
    nacionalidad: "",
    equipo_id: "",
    usuario_id: usuario.id || 0
  });

  const cargarJugadores = async () => {
    try {
      const response = await api.get("/jugadorescrud");
      setJugadores(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarJugadores();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const crearJugador = async (e) => {
    e.preventDefault();

    try {
      await api.post("/jugadorescrud", formulario);

      Swal.fire({
        icon: "success",
        title: "Jugador creado",
        background: "#ffffff",
        color: "#000000"
      });

      setFormulario({
        nombre: "",
        posicion: "",
        nacionalidad: "",
        equipo_id: "",
        usuario_id: usuario.id || 0
      });

      cargarJugadores();
    } catch (error) {
      console.log(error);
    }
  };

  const editarJugador = async (jugador) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar jugador",

      html: `
        <input
          id="swal-nombre"
          class="swal2-input"
          value="${jugador.nombre || ""}"
          placeholder="Nombre"
        >

        <input
          id="swal-posicion"
          class="swal2-input"
          value="${jugador.posicion || ""}"
          placeholder="Posición"
        >

        <input
          id="swal-nacionalidad"
          class="swal2-input"
          value="${jugador.nacionalidad || ""}"
          placeholder="Nacionalidad"
        >

        <input
          id="swal-equipo"
          class="swal2-input"
          value="${jugador.equipo_id || ""}"
          placeholder="ID Equipo"
        >
      `,

      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",

      preConfirm: () => ({
        nombre:
          document.getElementById(
            "swal-nombre"
          ).value,

        posicion:
          document.getElementById(
            "swal-posicion"
          ).value,

        nacionalidad:
          document.getElementById(
            "swal-nacionalidad"
          ).value,

        equipo_id: Number(
          document.getElementById(
            "swal-equipo"
          ).value
        ),

        usuario_id:
          jugador.usuario_id
      })
    });

    if (!formValues) return;

    try {
      await api.put(
        `/jugadorescrud/${jugador.id}`,
        formValues
      );

      Swal.fire({
        icon: "success",
        title: "Jugador actualizado",
        background: "#ffffff",
        color: "#000000"
      });

      cargarJugadores();

    } catch (error) {
      console.log(error);
    }
  };

  const eliminarJugador = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar jugador?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      color: "#000000"
    });

    if (!resultado.isConfirmed) return;

    try {
      await api.delete(`/jugadorescrud/${id}`);

      Swal.fire({
        icon: "success",
        title: "Jugador eliminado",
        background: "#ffffff",
        color: "#000000"
      });

      cargarJugadores();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>CRUD Jugadores ⚽</h1>
          <p>Gestión de jugadores</p>
        </div>

        <form
          onSubmit={crearJugador}
          className="card card-content"
          style={{ marginBottom: "30px" }}
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="input"
            value={formulario.nombre}
            onChange={manejarCambio}
            required
          />

          <input
            type="text"
            name="posicion"
            placeholder="Posición"
            className="input"
            value={formulario.posicion}
            onChange={manejarCambio}
            required
          />

          <input
            type="text"
            name="nacionalidad"
            placeholder="Nacionalidad"
            className="input"
            value={formulario.nacionalidad}
            onChange={manejarCambio}
            required
          />

          <input
            type="number"
            name="equipo_id"
            placeholder="ID Equipo"
            className="input"
            value={formulario.equipo_id}
            onChange={manejarCambio}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            ➕ Crear jugador
          </button>
        </form>

        <div className="grid list-grid">
          {jugadores.map((jugador) => (
            <div
              key={jugador.id}
              className="card card-content"
            >
              <h3>{jugador.nombre}</h3>

              <p>Posición: {jugador.posicion}</p>

              <p>
                Nacionalidad: {jugador.nacionalidad}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px"
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    editarJugador(jugador)
                  }
                >
                  ✏️ Editar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    eliminarJugador(jugador.id)
                  }
                >
                  ❌ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JugadoresCRUD;