import { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "usuario"
  });

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const editarUsuario = (usuario) => {
    setFormulario({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol
    });

    setEditandoId(usuario.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, formulario);

        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "Los datos se actualizaron correctamente.",
          confirmButtonColor: "#19e35f",
          background: "#07110b",
          color: "#ffffff"
        });

        setEditandoId(null);
      } else {
        await api.post("/usuarios", formulario);

        Swal.fire({
          icon: "success",
          title: "Usuario creado",
          text: "El usuario se registró correctamente.",
          confirmButtonColor: "#19e35f",
          background: "#07110b",
          color: "#ffffff"
        });
      }

      setFormulario({
        nombre: "",
        email: "",
        password: "",
        rol: "usuario"
      });

      cargarUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No se pudo guardar el usuario.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  const eliminarUsuario = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar usuario?",
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
      await api.delete(`/usuarios/${id}`);

      cargarUsuarios();

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El usuario se eliminó correctamente.",
        confirmButtonColor: "#19e35f",
        background: "#07110b",
        color: "#ffffff"
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No se pudo eliminar el usuario.",
        confirmButtonColor: "#ef4444",
        background: "#07110b",
        color: "#ffffff"
      });
    }
  };

  const volverLogin = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Usuarios</h1>
          <p>Gestión de usuarios del sistema</p>
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
            {editandoId ? "✏️ Editar usuario" : "➕ Crear usuario"}
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
              placeholder="Contraseña"
              value={formulario.password}
              onChange={manejarCambio}
              className="input"
              required={!editandoId}
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
              {editandoId ? "Guardar cambios" : "Crear usuario"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEditandoId(null);

                  setFormulario({
                    nombre: "",
                    email: "",
                    password: "",
                    rol: "usuario"
                  });
                }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.16)"
                }}
              >
                Cancelar edición
              </button>
            )}

            <button
              type="button"
              className="btn"
              onClick={volverLogin}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.16)"
              }}
            >
              ← Volver al login
            </button>
          </div>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: 900
            }}
          >
            👥 Usuarios registrados
          </h2>
        </div>

        {usuarios.length === 0 ? (
          <div className="empty-state">No hay usuarios.</div>
        ) : (
          <div
            className="grid list-grid"
            style={{
              gap: "28px"
            }}
          >
            {usuarios.map((usuario) => (
              <div
                className="card card-content"
                key={usuario.id}
                style={{
                  borderRadius: "28px",
                  padding: "28px"
                }}
              >
                <div
                  className="user-row"
                  style={{
                    marginBottom: "18px"
                  }}
                >
                  <div
                    className="user-badge"
                    style={{
                      width: "68px",
                      height: "68px",
                      fontSize: "1.55rem"
                    }}
                  >
                    👤
                  </div>

                  <div className="user-info">
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: "1.55rem",
                        fontWeight: 900
                      }}
                    >
                      {usuario.nombre}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        opacity: 0.78,
                        fontSize: "1rem"
                      }}
                    >
                      {usuario.email}
                    </p>
                  </div>
                </div>

                <div className="card-meta">
                  <strong>Rol:</strong> {usuario.rol}
                </div>

                <div className="card-meta">
                  <strong>Fecha:</strong>{" "}
                  {usuario.fecha_creacion
                    ? new Date(usuario.fecha_creacion).toLocaleDateString()
                    : "No disponible"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "18px"
                  }}
                >
                  <button
                    onClick={() => editarUsuario(usuario)}
                    className="btn btn-primary"
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => eliminarUsuario(usuario.id)}
                    className="btn btn-danger"
                  >
                    Eliminar usuario
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

export default Usuarios;