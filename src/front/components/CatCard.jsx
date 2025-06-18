import React from "react";
import { useNavigate } from "react-router-dom";
import { AddFavorite } from "./AddFavorite";
import defaultMichiPlaceholder from '../assets/img/default_profile.png';

const CatCard = ({ cat }) => {
  const navigate = useNavigate();

  // Función para redirigir al perfil del gato
  const handleClick = () => {
    navigate(`/cat/${cat.id}`);
  };

  const imageUrl =
    cat.photos?.[0]?.foto || defaultMichiPlaceholder;

  return (
    <div
      className="card m-2 shadow-sm cat-card-container cat-card-hover-effect"
      style={{ width: "14rem", height: "350px", cursor: "pointer", position: "relative", backgroundColor: '#F8F8F7' }}
      onClick={handleClick}
    >
      <div className="p-1" style={{ overflow: "hidden" }}>
        <img
          src={imageUrl}
          className="d-block w-100"
          alt={`Foto de ${cat.name}`}
          style={{ height: "160px", objectFit: "cover" }}
        />
      </div>

      <div className="card-body text-center p-2 position-relative">
        <h6 className="card-title text-uppercase fw-bold mb-1 " >{cat.name}</h6>
        <hr />
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
        <div
          className="position-absolute"
          style={{
            bottom: "10px",
            right: "10px",

          }}
          onClick={(e) => e.stopPropagation()}
        >
          <AddFavorite michiId={cat.id} />
        </div>
      </div>

    </div>
  );
};

export default CatCard;