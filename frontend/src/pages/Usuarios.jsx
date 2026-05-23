import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Usuarios() {
  const [editandoId, setEditandoId] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "usuario"
  });

  const cargarUsuario = async () => {
    try {
      const usuarioGuardado = JSON.parse(
        localStorage.getItem("usuario")
      );

      if (!usuarioGuardado) {
        window.location.href = "/login";
        return;
      }

      const response = await api.get(
        `/usuarios/${usuarioGuardado.id}`
      );

      const usuario = response.data;

      setFormulario({
        nombre: usuario.nombre,
        email: usuario.email,
        password: "",
        rol: usuario.rol
      });

      setEditandoId(usuario.id);

    } catch (error) {
      console.error("Error al cargar usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el perfil.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/usuarios/${editandoId}`, formulario);

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos se actualizaron correctamente.",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });

    } catch (error) {
      console.error("Error al actualizar usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No se pudo actualizar el perfil.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  const eliminarUsuario = async () => {
    const resultado = await Swal.fire({
      title: "¿Eliminar cuenta?",
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
      await api.delete(`/usuarios/${editandoId}`);

      localStorage.removeItem("usuario");

      Swal.fire({
        icon: "success",
        title: "Cuenta eliminada",
        text: "Tu cuenta se eliminó correctamente.",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      }).then(() => {
        window.location.href = "/login";
      });

    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No se pudo eliminar la cuenta.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Mi perfil</h1>
          <p>Gestiona tu cuenta de usuario</p>
        </div>

        <form
          onSubmit={guardarUsuario}
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
            👤 Mi cuenta
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
              placeholder="Nueva contraseña"
              value={formulario.password}
              onChange={manejarCambio}
              className="input"
            />

            <select
              name="rol"
              value={formulario.rol}
              onChange={manejarCambio}
              className="input"
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "24px"
            }}
          >
            <button type="submit" className="btn btn-primary">
              💾 Guardar cambios
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={eliminarUsuario}
            >
              🗑️ Eliminar cuenta
            </button>

            <button
              type="button"
              className="btn"
              onClick={cerrarSesion}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.16)"
              }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Usuarios;