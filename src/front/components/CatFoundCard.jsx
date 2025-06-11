import React from "react";
import defaultCatImg from "../assets/img/default_profile.png";

import { useNavigate } from "react-router-dom";

const CatFoundCard = ({ cat }) => {
    const profilePhoto = Array.isArray(cat.photos) && cat.photos.length > 0
        ? cat.photos[0].foto
        : defaultCatImg;

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/cat/${cat.id}`);
    };
    return (
        <div className="card text-center shadow-sm" style={{ height: "18rem", cursor: "pointer", position: "relative" }} onClick={handleClick}>
            <img
                src={profilePhoto}
                alt={`Foto de ${cat.name}`}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
                <h5 className="card-title">{cat.name}</h5>
            </div>
        </div>
    );
};

export default CatFoundCard;
