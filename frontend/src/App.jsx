import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen.jsx";

import Home from "./pages/Home";
import Ligas from "./pages/Ligas";
import Equipos from "./pages/Equipos";
import Jugadores from "./pages/Jugadores";
import Partidos from "./pages/Partidos";
import Clasificacion from "./pages/Clasificacion";
import Usuarios from "./pages/Usuarios";
import Favoritos from "./pages/Favoritos";
import Buscar from "./pages/Buscar";
import Login from "./pages/Login";
import Noticias from "./pages/Noticias";

function App() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [mostrarSplash, setMostrarSplash] = useState(true);

  useEffect(() => {
    const yaVisto = sessionStorage.getItem("splash");

    if (yaVisto) {
      setMostrarSplash(false);
    }
  }, []);

  const finalizarSplash = () => {
    sessionStorage.setItem("splash", "true");
    setMostrarSplash(false);
  };

  // 🔥 Splash screen
  if (mostrarSplash) {
    return <SplashScreen onFinish={finalizarSplash} />;
  }

  return (
    <BrowserRouter>
      {/* 🔒 Navbar solo si hay login */}
      {usuario && <Navbar />}

      <Routes>
        {/* 🔒 Si NO está logueado */}
        {!usuario ? (
          <>
            <Route path="*" element={<Login />} />

            {/* ✅ Permitir crear usuarios */}
            <Route path="/usuarios" element={<Usuarios />} />
          </>
        ) : (
          <>
            {/* ✅ App completa */}
            <Route path="/" element={<Home />} />
            <Route path="/ligas" element={<Ligas />} />
            <Route path="/equipos/:liga" element={<Equipos />} />
            <Route path="/jugadores/:idEquipo/:liga" element={<Jugadores />} />
            <Route path="/partidos/:liga" element={<Partidos />} />
            <Route path="/clasificacion/:liga" element={<Clasificacion />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/buscar/:texto" element={<Buscar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/noticias" element={<Noticias />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;