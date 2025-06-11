import React from "react";
import { useNavigate } from "react-router-dom";

const CatCard = ({ cat }) => {
  const navigate = useNavigate();

  // Función para redirigir al perfil del gato
  const handleClick = () => {
    navigate(`/cat/${cat.id}`);
  };

  // Imagen del gato (o placeholder si no hay fotos)
  const imageUrl =
    cat.photos?.[0]?.url || "https://via.placeholder.com/300x200?text=Sin+foto";

  return (
    <div
      className="card m-2 shadow-sm border-0"
      style={{ width: "14rem", cursor: "pointer", position: "relative" }}
      onClick={handleClick}
    >
      {/* Imagen con borde azul */}
      <div style={{ border: "3px solid #00aaff", borderRadius: "10px", overflow: "hidden" }}>
        <img
          src={imageUrl}
          className="card-img-top"
          alt={`Foto de ${cat.name}`}
          style={{ height: "160px", objectFit: "cover" }}
        />
      </div>

      {/* Información del gato */}
      <div className="card-body text-center p-2 position-relative">
        <h6 className="card-title text-uppercase fw-bold mb-1">{cat.name}</h6>
        <p className="mb-1" style={{ fontSize: "0.85rem" }}>
          <strong>Raza:</strong> {cat.breed || "No especificada"}
        </p>
        <p className="mb-1" style={{ fontSize: "0.85rem" }}>
          <strong>Color:</strong> {cat.color || "No especificado"}
        </p>
        <p className="mb-1" style={{ fontSize: "0.85rem" }}>
          <strong>Edad:</strong> {cat.age} años
        </p>
        <p className="mb-0" style={{ fontSize: "0.85rem" }}>
          <strong>Sexo:</strong> {cat.sex === "male" ? "Macho" : "Hembra"}
        </p>

        {/* Icono de corazón (decorativo por ahora) */}
        <span
          className="position-absolute"
          style={{
            bottom: "10px",
            right: "10px",
            color: "#bbb",
            fontSize: "18px"
          }}
        >
          ♡
        </span>
      </div>
    </div>
  );
};

export default CatCard;