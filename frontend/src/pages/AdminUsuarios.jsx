import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function AdminUsuarios() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  // SOLO ADMIN
  if (!usuario || usuario.rol !== "admin") {

    return (
      <div className="container">
        <h1>Acceso denegado 🚫</h1>
      </div>
    );
  }

  const [usuarios, setUsuarios] =
    useState([]);

  const cargarUsuarios = async () => {

    try {

      const response =
        await api.get("/usuarios");

      setUsuarios(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    cargarUsuarios();

  }, []);

  // EDITAR USUARIO
  const editarUsuario =
    async (usuario) => {

    const { value: formValues } =
      await Swal.fire({

        title:
          "Editar usuario",

        html: `

          <input
            id="swal-nombre"
            class="swal2-input"
            placeholder="Nombre"
            value="${usuario.nombre}"
          >

          <input
            id="swal-email"
            class="swal2-input"
            placeholder="Email"
            value="${usuario.email}"
          >

          <select
            id="swal-rol"
            class="swal2-input"
          >

            <option
              value="usuario"
              ${usuario.rol === "usuario"
                ? "selected"
                : ""}
            >
              Usuario
            </option>

            <option
              value="admin"
              ${usuario.rol === "admin"
                ? "selected"
                : ""}
            >
              Admin
            </option>

          </select>

          <input
            id="swal-password"
            class="swal2-input"
            placeholder="Contraseña obligatoria"
            type="password"
          >

        `,

        focusConfirm: false,

        showCancelButton: true,

        confirmButtonText:
          "Guardar",

        cancelButtonText:
          "Cancelar",

        footer:
          "⚠️ Debes introducir una contraseña para guardar los cambios del usuario.",

        preConfirm: () => {

          const password =
            document.getElementById(
              "swal-password"
            ).value;

          if (!password.trim()) {

            Swal.showValidationMessage(
              "Debes introducir una contraseña para guardar los cambios"
            );

            return false;
          }

          return {

            nombre:
              document.getElementById(
                "swal-nombre"
              ).value,

            email:
              document.getElementById(
                "swal-email"
              ).value,

            rol:
              document.getElementById(
                "swal-rol"
              ).value,

            password
          };
        }
      });

    if (!formValues) return;

    try {

      await api.put(
        `/usuarios/${usuario.id}`,
        formValues
      );

      cargarUsuarios();

      Swal.fire({
        icon: "success",
        title:
          "Usuario actualizado"
      });

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title:
          "Error actualizando usuario"
      });
    }
  };

  // ELIMINAR USUARIO
  const eliminarUsuario =
    async (id) => {

    const resultado =
      await Swal.fire({
        title:
          "¿Eliminar usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Eliminar",
        cancelButtonText:
          "Cancelar"
      });

    if (
      !resultado.isConfirmed
    ) return;

    try {

      await api.delete(
        `/usuarios/${id}`
      );

      cargarUsuarios();

      Swal.fire({
        icon: "success",
        title:
          "Usuario eliminado"
      });

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="app-shell">

      <div className="container">

        <div className="page-header">

          <h1>
            Usuarios 👑
          </h1>

          <p>
            Gestión de usuarios del sistema
          </p>

        </div>

        <div className="grid list-grid">

          {usuarios.map((usuario) => (

            <div
              className="card card-content"
              key={usuario.id}
            >

              <h3>
                {usuario.nombre}
              </h3>

              <p>
                {usuario.email}
              </p>

              <p>
                Rol:
                <strong>
                  {" "}
                  {usuario.rol}
                </strong>
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "18px"
                }}
              >

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    editarUsuario(
                      usuario
                    )
                  }
                >
                  ✏️ Editar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    eliminarUsuario(
                      usuario.id
                    )
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

export default AdminUsuarios;