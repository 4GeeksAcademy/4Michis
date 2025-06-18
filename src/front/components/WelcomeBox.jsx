import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg1 from "../assets/img/michibgwl_1.webp";
import bg2 from "../assets/img/michibgwl_2.webp";
import bg3 from "../assets/img/michibgwl_3.webp";
import bg4 from "../assets/img/michibgwl_4.webp";
import bg5 from "../assets/img/michibgwl_5.webp";
import bg6 from "../assets/img/michibgwl_6.webp";
import bg7 from "../assets/img/michibgwl_7.webp";
import bg8 from "../assets/img/michibgwl_8.webp";

const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8];

export const WelcomeBox = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [previousBg, setPreviousBg] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Precarga de imágenes
    backgroundImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setPreviousBg(currentBg);
      setFade(false);
      setTimeout(() => {
        setCurrentBg(prev => (prev + 1) % backgroundImages.length);
        setFade(true);
      }, 600); // muy corto, solo para preparar el cambio
    }, 5000);

    return () => clearInterval(interval);
  }, [currentBg]);

  return (
    <div className="position-relative bg-dark rounded shadow-md text-center max-w-2xl mx-auto welcome-box" style={{ height: "500px" }}>
      {/* Fondo anterior */}
      <div
        className="welcome-bg"
        style={{
          backgroundImage: `url('${backgroundImages[previousBg]}')`,
          opacity: fade ? 0 : 1,
          zIndex: 0,

        }}
      ></div>

      {/* Fondo nuevo */}
      <div
        className="welcome-bg"
        style={{
          backgroundImage: `url('${backgroundImages[currentBg]}')`,
          opacity: fade ? 1 : 0,
          zIndex: 1,

        }}
      ></div>

      {/* Contenido */}
      <div className="">
        <div className="welcome-box col-12 col-md-6">
          <h1 className="welcome-title"> ¡Bienvenido/a a nuestra página de adopción de Gatos!</h1>
          <p className="welcome-text">
            Descubre cientos de gatos adorables que buscan un nuevo hogar lleno de amor. ¡Tu mejor amigo te está esperando!
          </p>
          <a href="/register" className="welcome-cta chewy-font h4">¡Regístrate ahora!</a>
        </div>
      </div>
    </div>
  );
};
