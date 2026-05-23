import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Navbar() {
  const [busqueda, setBusqueda] = useState("");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleBuscar = (e) => {
    e.preventDefault();

    if (busqueda.trim() !== "") {
      navigate(`/buscar/${encodeURIComponent(busqueda.trim())}`);
      setBusqueda("");
    }
  };

  const cerrarSesion = async () => {
    const resultado = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#19e35f",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#07110b",
      color: "#ffffff"
    });

    if (!resultado.isConfirmed) return;

    localStorage.removeItem("usuario");

    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Has salido correctamente.",
      timer: 1200,
      showConfirmButton: false,
      background: "#07110b",
      color: "#ffffff"
    });

    setTimeout(() => {
      navigate("/login");
      window.location.reload();
    }, 1200);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-logo">⚽</div>

          <div className="brand-text">
            <span className="brand-title">DataGol</span>

            <span className="brand-subtitle">
              {usuario
                ? `Hola, ${usuario.nombre}`
                : "Football explorer"}
            </span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/ligas" className="nav-pill">
            Ligas
          </Link>

          <Link to="/noticias" className="nav-pill">
            Noticias
          </Link>

          <Link to="/favoritos" className="nav-pill">
            Favoritos
          </Link>

          <Link to="/perfil" className="nav-pill">
            Mi perfil
          </Link>

          {usuario?.rol === "admin" && (
            <Link to="/usuarios" className="nav-pill">
              Usuarios
            </Link>
          )}

          <button
            className="nav-pill"
            type="button"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
          </button>

          <button
            onClick={cerrarSesion}
            className="nav-pill"
            type="button"
          >
            Cerrar sesión
          </button>
        </nav>

        <form onSubmit={handleBuscar} className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar equipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}

export default Navbar;