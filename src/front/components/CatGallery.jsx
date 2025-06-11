import React, { useEffect, useState } from "react";
import CatCard from "../components/CatCard";

export const CatGallery = () => {
  const [cats, setCats] = useState([]);

  // Función para obtener los gatos desde la API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/`);
        if (!response.ok) throw new Error("Error al obtener los gatos");

        const data = await response.json();

        // Asegura que el formato de la respuesta sea un arreglo
        const catsArray = Array.isArray(data) ? data : data.cats || [];
        setCats(catsArray);
      } catch (error) {
        console.error("Error al cargar los gatos:", error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold fs-2">¡NUESTROS MICHIS!</h2>
      
      <div className="row justify-content-center">
        {cats.map((cat) => (
          <div key={cat.id} className="col-6 col-md-4 d-flex justify-content-center">
            <CatCard cat={cat} />
          </div>
        ))}
      </div>
    </div>
  );
};