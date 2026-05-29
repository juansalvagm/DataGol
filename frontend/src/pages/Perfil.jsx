import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Perfil() {

  const [usuarioId, setUsuarioId] =
    useState(null);

  const [formulario, setFormulario] =
    useState({
      nombre: "",
      email: "",
      password: "",
      rol: "usuario"
    });

  const cargarPerfil = async () => {

    try {

      const usuarioGuardado =
        JSON.parse(
          localStorage.getItem(
            "usuario"
          )
        );

      if (!usuarioGuardado) {

        window.location.href =
          "/login";

        return;
      }

      setUsuarioId(
        usuarioGuardado.id
      );

      const response =
        await api.get(
          `/usuarios/${usuarioGuardado.id}`
        );

      const usuario =
        response.data;

      setFormulario({
        nombre:
          usuario.nombre,
        email:
          usuario.email,
        password: "",
        rol:
          usuario.rol
      });

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    cargarPerfil();

  }, []);

  const manejarCambio = (e) => {

    setFormulario({
      ...formulario,
      [e.target.name]:
        e.target.value
    });
  };

  const guardarCambios =
    async (e) => {

    e.preventDefault();

    if (!formulario.password.trim()) {

      Swal.fire({
        icon: "warning",
        title:
          "Contraseña obligatoria",
        text:
          "Debes introducir una contraseña para guardar los cambios.",
        confirmButtonColor:
          "#f59e0b",
        background:
          "#07110b",
        color:
          "#ffffff"
      });

      return;
    }

    try {

      await api.put(
        `/usuarios/${usuarioId}`,
        formulario
      );

      const usuarioActualizado = {
        ...JSON.parse(
          localStorage.getItem(
            "usuario"
          )
        ),
        nombre:
          formulario.nombre,
        email:
          formulario.email
      };

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          usuarioActualizado
        )
      );

      Swal.fire({
        icon: "success",
        title:
          "Perfil actualizado",
        text:
          "Tus datos se actualizaron correctamente.",
        confirmButtonColor:
          "#19e35f",
        background:
          "#07110b",
        color:
          "#ffffff"
      });

      setTimeout(() => {

        window.location.reload();

      }, 1000);

    } catch (error) {

      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "No se pudo actualizar el perfil.",
        confirmButtonColor:
          "#ef4444",
        background:
          "#07110b",
        color:
          "#ffffff"
      });
    }
  };

  const eliminarCuenta =
    async () => {

    const resultado =
      await Swal.fire({
        title:
          "¿Eliminar cuenta?",
        text:
          "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:
          "#ef4444",
        cancelButtonColor:
          "#19e35f",
        confirmButtonText:
          "Sí, eliminar",
        cancelButtonText:
          "Cancelar",
        background:
          "#07110b",
        color:
          "#ffffff"
      });

    if (
      !resultado.isConfirmed
    ) return;

    try {

      await api.delete(
        `/usuarios/${usuarioId}`
      );

      localStorage.removeItem(
        "usuario"
      );

      window.location.href =
        "/login";

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div className="app-shell">

      <div className="container">

        <div className="page-header">

          <h1>
            Mi perfil
          </h1>

          <p>
            Gestiona tu cuenta
          </p>

        </div>

        <form
          onSubmit={
            guardarCambios
          }
          className="card card-content"
          style={{
            padding: "34px",
            borderRadius: "28px"
          }}
        >

          <div
            style={{
              display: "grid",
              gap: "16px"
            }}
          >

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="input"
              value={
                formulario.nombre
              }
              onChange={
                manejarCambio
              }
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={
                formulario.email
              }
              onChange={
                manejarCambio
              }
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña obligatoria para guardar cambios"
              className="input"
              value={
                formulario.password
              }
              onChange={
                manejarCambio
              }
              required
            />

            <p
              style={{
                color: "#f59e0b",
                fontSize: "0.9rem",
                marginTop: "-6px"
              }}
            >
              ⚠️ Debes introducir una contraseña para poder guardar cualquier cambio.
            </p>

          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "24px",
              flexWrap: "wrap"
            }}
          >

            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={
                eliminarCuenta
              }
            >
              Eliminar cuenta
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Perfil;