import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function EquiposCRUD() {
  const [equipos, setEquipos] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: "",
    liga: "",
    pais: "",
    estadio: "",
    fundacion: 0,
    escudo_url: "",
    puntos: 0,
    goles_favor: 0,
    goles_contra: 0,
    usuario_id:
      JSON.parse(localStorage.getItem("usuario"))?.id || 0
  });

  const cargarEquipos = async () => {
    try {

      const usuario = JSON.parse(
        localStorage.getItem("usuario")
      );

      const response =
        await api.get(
          `/equiposcrud?usuario_id=${usuario.id}`
        );

      setEquipos(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const crearEquipo = async (e) => {
    e.preventDefault();

    try {

      await api.post(
        "/equiposcrud",
        formulario
      );

      Swal.fire({
        icon: "success",
        title: "Equipo creado"
      });

      setFormulario({
        nombre: "",
        liga: "",
        pais: "",
        estadio: "",
        fundacion: 0,
        escudo_url: "",
        puntos: 0,
        goles_favor: 0,
        goles_contra: 0,
        usuario_id:
          JSON.parse(
            localStorage.getItem("usuario")
          )?.id || 0
      });

      cargarEquipos();

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error al crear equipo"
      });
    }
  };

  const editarEquipo = async (equipo) => {

    const { value: formValues } =
      await Swal.fire({
        title: "Editar equipo",

        html: `
          <input
            id="swal-nombre"
            class="swal2-input"
            placeholder="Nombre"
            value="${equipo.nombre || ""}"
          >

          <input
            id="swal-liga"
            class="swal2-input"
            placeholder="Liga"
            value="${equipo.liga || ""}"
          >

          <input
            id="swal-pais"
            class="swal2-input"
            placeholder="País"
            value="${equipo.pais || ""}"
          >

          <input
            id="swal-escudo"
            class="swal2-input"
            placeholder="URL Escudo"
            value="${equipo.escudo_url || ""}"
          >
        `,

        showCancelButton: true,

        preConfirm: () => {
          return {
            nombre:
              document.getElementById(
                "swal-nombre"
              ).value,

            liga:
              document.getElementById(
                "swal-liga"
              ).value,

            pais:
              document.getElementById(
                "swal-pais"
              ).value,

            escudo_url:
              document.getElementById(
                "swal-escudo"
              ).value
          };
        }
      });

    if (!formValues) return;

    try {

      await api.put(
        `/equiposcrud/${equipo.id}`,
        formValues
      );

      cargarEquipos();

      Swal.fire({
        icon: "success",
        title: "Equipo actualizado"
      });

    } catch (error) {

      console.log(error);

    }
  };

  const eliminarEquipo = async (id) => {

    const resultado =
      await Swal.fire({
        title: "¿Eliminar equipo?",
        icon: "warning",
        showCancelButton: true
      });

    if (!resultado.isConfirmed) return;

    try {

      await api.delete(
        `/equiposcrud/${id}`
      );

      cargarEquipos();

      Swal.fire({
        icon: "success",
        title: "Equipo eliminado"
      });

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="app-shell">

      <div className="container">

        <div className="page-header">
          <h1>CRUD Equipos ⚽</h1>
          <p>Gestión de equipos</p>
        </div>

        <form
          onSubmit={crearEquipo}
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
            name="liga"
            placeholder="Liga"
            className="input"
            value={formulario.liga}
            onChange={manejarCambio}
            required
          />

          <input
            type="text"
            name="pais"
            placeholder="País"
            className="input"
            value={formulario.pais}
            onChange={manejarCambio}
            required
          />

          <input
            type="text"
            name="escudo_url"
            placeholder="URL Escudo"
            className="input"
            value={formulario.escudo_url}
            onChange={manejarCambio}
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            ➕ Crear equipo
          </button>

        </form>

        <div className="grid list-grid">

          {equipos.map((equipo) => (

            <div
              key={equipo.id}
              className="card card-content"
            >

              {equipo.escudo_url && (
                <img
                  src={equipo.escudo_url}
                  alt={equipo.nombre}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "15px"
                  }}
                />
              )}

              <h3>{equipo.nombre}</h3>

              <p>
                <strong>Liga:</strong> {equipo.liga}
              </p>

              <p>
                <strong>País:</strong> {equipo.pais}
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
                    editarEquipo(equipo)
                  }
                >
                  ✏️ Editar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    eliminarEquipo(equipo.id)
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

export default EquiposCRUD;