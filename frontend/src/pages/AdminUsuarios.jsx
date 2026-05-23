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

  const eliminarUsuario = async (id) => {

    const resultado = await Swal.fire({
      title: "¿Eliminar usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {

      await api.delete(
        `/usuarios/${id}`
      );

      cargarUsuarios();

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado"
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

          ))}

        </div>

      </div>

    </div>
  );
}

export default AdminUsuarios;