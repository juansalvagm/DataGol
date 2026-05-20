import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app-shell">
      <div className="container">

        {/* HERO POTENTE */}
        <section className="hero">
          <h1>
            Vive el fútbol <span style={{ color: "#19e35f" }}>en directo</span>
          </h1>

          <p>
            Descubre ligas de todo el mundo, explora equipos, analiza jugadores
            y guarda tus favoritos. Todo en una experiencia rápida, moderna
            y visual.
          </p>

          <div className="hero-stats">
            <div className="stat-box">
              <strong>🌍 Global</strong>
              <span>Ligas internacionales</span>
            </div>

            <div className="stat-box">
              <strong>⚡ Live</strong>
              <span>Datos en tiempo real</span>
            </div>

            <div className="stat-box">
              <strong>⭐ Personal</strong>
              <span>Favoritos y usuarios</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN */}
        <div className="page-header">
          <h1>Explorar</h1>
          <p>Elige una sección y empieza a descubrir.</p>
        </div>

        {/* CARDS PRO */}
        <div className="grid home-grid">

          <Link to="/ligas" className="card card-link">
            <div className="card-icon">🏆</div>

            <h3 className="card-title">Ligas</h3>

            <p className="card-text">
              Explora competiciones, consulta clasificaciones y accede a todos
              los equipos disponibles.
            </p>

            <span className="tag">Explorar ligas →</span>
          </Link>


          <Link to="/usuarios" className="card card-link">
            <div className="card-icon">👥</div>

            <h3 className="card-title">Usuarios</h3>

            <p className="card-text">
              Gestiona usuarios, crea nuevos perfiles y administra el sistema.
            </p>

            <span className="tag">Gestionar usuarios →</span>
          </Link>


          <Link to="/favoritos" className="card card-link">
            <div className="card-icon">⭐</div>

            <h3 className="card-title">Favoritos</h3>

            <p className="card-text">
              Accede rápidamente a tus equipos y jugadores guardados.
            </p>

            <span className="tag">Ver favoritos →</span>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Home;