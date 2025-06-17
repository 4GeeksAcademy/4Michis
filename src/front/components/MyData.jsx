import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import defaultMichiPlaceholder from '../assets/img/default_profile.png';


const defaultProfilePlaceholder = "https://via.placeholder.com/100?text=No+Foto";
const backImagePlaceholder = defaultMichiPlaceholder;

export const MyData = ({ onEditClick }) => {
    const { store } = useGlobalReducer();
    const { userData } = store;

    const [isFlipped, setIsFlipped] = useState(true);

    useEffect(() => {
        const initialFlipTimer = setTimeout(() => {
            setIsFlipped(false);
        }, 200);
        // Limpieza: Asegura que los temporizadores se limpien si el componente se desmonta
        return () => {
            clearTimeout(initialFlipTimer);

        };
    }, []);

    const handleFlip = () => {
        setIsFlipped(prev => !prev);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 chewy-font">Datos de Usuario</h2>
            <div
                className={`flip-card-container mx-auto ${isFlipped ? 'flipped' : ''}`}
                style={{ maxWidth: '600px', cursor: 'pointer' }}
                onClick={handleFlip}
            >
                {/* El "inner" de la tarjeta, que es el que realmente rota */}
                <div className="flip-card-inner">
                    <div className="flip-card-front card shadow-sm p-4 d-flex">
                        <div className="row g-3">
                            <div className="col-sm-8 order-sm-1 order-2">
                                <p><strong>Nombre:</strong> {userData.name} {userData.lastname}</p>
                                <p><strong>Nickname:</strong> {userData.nickname}</p>
                                <p><strong>DNI:</strong> {userData.dni}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p><strong>Teléfono:</strong> {userData.phone}</p>
                                <p><strong>Dirección:</strong> {userData.direction}</p>
                            </div>
                            <div className="col-sm-4 d-flex justify-content-sm-end justify-content-center order-sm-2 order-1">
                                <img
                                    src={userData.profile_picture ? userData.profile_picture : defaultProfilePlaceholder}
                                    alt="User Profile"
                                    className="rounded-circle ms-3"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>

                        <button
                            className="btn button-4michis chewy-font mt-3"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditClick();
                            }}
                        >
                            Editar Mis Datos
                        </button>
                    </div>
                    <div className="flip-card-back card shadow-sm p-4 d-flex align-items-center justify-content-center">
                        <img
                            src={backImagePlaceholder}
                            alt="Imagen de Reverso"
                            className="img-fluid"

                        />
                    </div>
                </div>
            </div>
        </div>
    );
};