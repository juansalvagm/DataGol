import { useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Usuarios() {

  const [editandoId, setEditandoId] =
    useState(null);

  const [formulario, setFormulario] =
    useState({
      nombre: "",
      email: "",
      password: "",
      rol: "usuario"
    });

  const manejarCambio = (e) => {

    setFormulario({
      ...formulario,
      [e.target.name]:
        e.target.value
    });
  };

  const crearUsuario = async (e) => {

    e.preventDefault();

    try {

      // FORZAR SIEMPRE USUARIO
      const datosUsuario = {
        ...formulario,
        rol: "usuario"
      };

      if (editandoId) {

        await api.put(
          `/usuarios/${editandoId}`,
          datosUsuario
        );

        Swal.fire({
          icon: "success",
          title:
            "Usuario actualizado",
          text:
            "Los datos se actualizaron correctamente.",
          confirmButtonColor:
            "#19e35f",
          background:
            "#07110b",
          color: "#ffffff"
        });

        setEditandoId(null);

      } else {

        await api.post(
          "/usuarios",
          datosUsuario
        );

        Swal.fire({
          icon: "success",
          title:
            "Usuario creado",
          text:
            "El usuario se registró correctamente.",
          confirmButtonColor:
            "#19e35f",
          background:
            "#07110b",
          color: "#ffffff"
        });
      }

      setFormulario({
        nombre: "",
        email: "",
        password: "",
        rol: "usuario"
      });

    } catch (error) {

      console.error(
        "Error al guardar usuario:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No se pudo guardar el usuario.",
        confirmButtonColor:
          "#ef4444",
        background:
          "#07110b",
        color: "#ffffff"
      });
    }
  };

  const volverLogin = () => {

    localStorage.removeItem(
      "usuario"
    );

    window.location.href =
      "/login";
  };

  return (
    <div className="app-shell">

      <div className="container">

        <div className="page-header">

          <h1>
            Crear usuario
          </h1>

          <p>
            Registra una nueva cuenta
            en DataGol
          </p>

        </div>

        <form
          onSubmit={crearUsuario}
          className="card card-content"
          style={{
            marginBottom: "50px",
            padding: "34px",
            borderRadius: "30px"
          }}
        >

          <h2
            style={{
              margin: "0 0 24px",
              fontSize: "2rem",
              fontWeight: 900
            }}
          >
            ➕ Nuevo usuario
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}
          >

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              className="input"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formulario.email}
              onChange={manejarCambio}
              className="input"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formulario.password}
              onChange={manejarCambio}
              className="input"
              required={!editandoId}
            />

          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "24px"
            }}
          >

            <button
              type="submit"
              className="btn btn-primary"
            >
              Crear usuario
            </button>

            <button
              type="button"
              className="btn"
              onClick={volverLogin}
              style={{
                background:
                  "rgba(255,255,255,0.08)",
                color: "white",
                border:
                  "1px solid rgba(255,255,255,0.16)"
              }}
            >
              ← Volver al login
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Usuarios;