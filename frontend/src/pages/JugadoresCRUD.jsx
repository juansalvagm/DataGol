import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function JugadoresCRUD() {
  const [jugadores, setJugadores] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: "",
    posicion: "",
    nacionalidad: "",
    equipo_id: "",
    usuario_id:
      JSON.parse(
        localStorage.getItem("usuario")
      )?.id || 0
  });

  const cargarJugadores = async () => {
    try {
      const response = await api.get(
        "/jugadorescrud"
      );

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
      [e.target.name]:
        e.target.value
    });
  };

  const crearJugador = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/jugadorescrud",
        formulario
      );

      Swal.fire({
        icon: "success",
        title: "Jugador creado"
      });

      setFormulario({
        nombre: "",
        posicion: "",
        nacionalidad: "",
        equipo_id: "",
        usuario_id:
          JSON.parse(
            localStorage.getItem("usuario")
          )?.id || 0
      });

      cargarJugadores();

    } catch (error) {
      console.log(error);
    }
  };

  const eliminarJugador = async (id) => {
    try {
      await api.delete(
        `/jugadorescrud/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Jugador eliminado"
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
          <h1>
            CRUD Jugadores ⚽
          </h1>
          <p>
            Gestión de jugadores
          </p>
        </div>

        <form
          onSubmit={crearJugador}
          className="card card-content"
          style={{
            marginBottom: "30px"
          }}
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
          {jugadores.map(
            (jugador) => (
              <div
                key={jugador.id}
                className="card card-content"
              >
                <h3>
                  {jugador.nombre}
                </h3>

                <p>
                  Posición:
                  {" "}
                  {jugador.posicion}
                </p>

                <p>
                  Nacionalidad:
                  {" "}
                  {jugador.nacionalidad}
                </p>

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
            )
          )}
        </div>

      </div>
    </div>
  );
}

export default JugadoresCRUD;