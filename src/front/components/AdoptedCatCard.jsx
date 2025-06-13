import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const AdoptedCatCard = ({ cat, userLabel, onRate, showRateButton = true }) => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    if (!cat) return null;

    const handleClick = () => {
        navigate(`/cat/${cat.cat_id}`);
    };


    const nickname =
        userLabel.toLowerCase().includes("adoptante")
            ? cat.adoptant_nickname
            : cat.owner_nickname;

    return (
        <div className="card h-100 shadow-sm" style={{ height: "18rem", cursor: "pointer", position: "relative" }} onClick={handleClick}>
            <img
                src={cat.photo || "https://via.placeholder.com/400x300?text=Michi"}
                className="card-img-top"
                alt={`Foto de ${cat.cat_name}`}
                style={{ objectFit: "cover", height: "200px" }}
            />
            <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-center">{cat.cat_name}</h5>
                <p className="text-center mb-3">
                    <strong>{userLabel}:</strong> {nickname || "Desconocido"}
                </p>
                <div className="mt-auto">
                    {showRateButton ? (
                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRate();
                            }}
                        >
                            Valorar
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate("/private?section=ratings");
                            }}
                        >
                            Ir a valoraciones
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdoptedCatCard;

