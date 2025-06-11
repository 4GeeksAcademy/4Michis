import React from "react";
import { Link } from "react-router-dom";

export const WelcomeBox = () => {
  return (
    <div className="bg-white rounded shadow-md text-center max-w-2xl mx-auto welcome-box"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1619326229465-1942c876e17c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ3fHxjYXRvcyUyMHklMjBwZXJvc25hc3xlbnwwfHwwfHx8MA%3D%3D')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <h1 className="text-2xl font-bold mb-4 text-white chewy-font">
        ¡Bienvenido/a a nuestra página de adopción de Gatos!
      </h1>
      <p className="mb-2 text-white">
        Aquí encontrarás a tu futuro compañero felino.
      </p>
      <p className="mb-2 text-white">
        Creemos que cada gato merece un hogar lleno de amor, y estamos aquí para ayudarte a encontrar la pareja perfecta.
      </p>
      <p className="mb-4 text-white">
        Explora los perfiles de <strong>nuestros adorables gatos</strong>, listos para ronronear en sus nuevas vidas.
      </p>
      <p className="mb-6 text-white">
        ¿Estás listo/a para abrir tu corazón y tu hogar a uno de ellos?
      </p>
      <Link to="/register" className="btn btn-primary mb-4">
        ¡Regístrate!
      </Link>
    </div>
  );
};