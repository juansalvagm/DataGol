import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const cambiar = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="page-header">
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta de DataGol.</p>
        </div>

        <form onSubmit={iniciarSesion} className="user-form">
          <h2 className="user-form-title">Bienvenido de nuevo</h2>

          <p className="user-form-subtitle">
            Introduce tus datos para continuar.
          </p>

          {error && (
            <div className="empty-state" style={{ marginBottom: "18px" }}>
              {error}
            </div>
          )}

          <div className="form-grid">
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={cambiar}
            />

            <input
              className="input"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={cambiar}
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Entrar
            </button>
          </div>

          {/* 🔥 BOTÓN CREAR USUARIO */}
          <div
            style={{
              marginTop: "18px",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <button
              type="button"
              className="btn"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)"
              }}
              onClick={() => navigate("/usuarios")}
            >
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;