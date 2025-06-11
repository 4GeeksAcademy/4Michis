import React from "react";
import favsImg from "../assets/img/favs.png";
import mimichisImg from "../assets/img/mimichis.png";
import ratingImg from "../assets/img/rating.png";
import dataImg from "../assets/img/data.png";
import editdaImg from "../assets/img/editda.png";
import michiAddImg from "../assets/img/editda.png";

const ProfileMenu = ({ onSelect }) => {
    const sections = [

        { key: 'favorites', label: 'Favoritos', icon: favsImg },
        { key: 'ratings', label: 'Valoraciones', icon: ratingImg },
        { key: 'my-data', label: 'Mis datos', icon: dataImg },
        { key: 'edit-profile', label: 'Editar perfil', icon: editdaImg },
        { key: 'my-cats', label: 'Mis Michis', icon: mimichisImg },
        { key: 'add-cat', label: 'Agregar Michi', icon: michiAddImg },
    ];

    return (
        <div className="row d-flex justify-content-center">
            {sections.map(({ key, label, icon }) => (
                <div key={key} className="col-md-2 mb-3 profile-menu-card ">

                    <div
                        className="card h-100 shadow-sm "
                        onClick={() => onSelect(key)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="profile-menu-img text-center"><img src={icon} /></div>
                        <div className="card-body text-center">
                            <h5 className="card-title">{label}</h5>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileMenu;