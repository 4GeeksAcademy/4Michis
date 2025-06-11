import React from "react";
import { Link } from "react-router-dom";

export const WelcomeBox = () => {
  return (
    <div className="bg-white p-6 rounded shadow-md text-center max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        ¡Bienvenido/a a nuestra página de adopción de Gatos!
      </h1>
      <p className="mb-2">
        Aquí encontrarás a tu futuro compañero felino.
      </p>
      <p className="mb-2">
        Creemos que cada gato merece un hogar lleno de amor, y estamos aquí para ayudarte a encontrar la pareja perfecta.
      </p>
      <p className="mb-4">
        Explora los perfiles de <strong>nuestros adorables gatos</strong>, listos para ronronear en sus nuevas vidas.
      </p>
      <p className="mb-6">
        ¿Estás listo/a para abrir tu corazón y tu hogar a uno de ellos?
      </p>
      <Link to="/register" className="btn btn-primary">
        ¡Regístrate!
      </Link>
    </div>
  );
};