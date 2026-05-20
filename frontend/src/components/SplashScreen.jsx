import { useEffect } from "react";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(180deg, #030604 0%, #07110b 52%, #030604 100%)",
        color: "white"
      }}
    >
      <div
        style={{
          fontSize: "5rem",
          marginBottom: "20px",
          animation: "pulse 1.5s infinite"
        }}
      >
        ⚽
      </div>

      <h1
        style={{
          fontSize: "4rem",
          fontWeight: 1000,
          letterSpacing: "-0.06em",
          margin: 0
        }}
      >
        DataGol
      </h1>

      <p
        style={{
          marginTop: "14px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "1.1rem"
        }}
      >
        Bienvenido a la experiencia futbolística
      </p>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default SplashScreen;