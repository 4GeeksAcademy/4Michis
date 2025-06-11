import React, { useState, useEffect, useCallback } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { AddFavorite } from "./AddFavorite";
import defaultMichiPlaceholder from '../assets/img/default_profile.png';
import { Spinner } from "./spiner/Spinner";

export const Favorites = () => {
    const { store, dispatch } = useGlobalReducer();
    const { userFavorites } = store;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true); // Asume que carga al inicio
    const [error, setError] = useState(null);


    const defaultMichiImg = defaultMichiPlaceholder;



    const fetchLoadingFavorites = useCallback(async () => {
        setLoading(true);

        const token = localStorage.getItem("token"); // Obtén el token aquí

        if (!token) {
            setError("No hay token de autenticación. Por favor, inicia sesión.");
            setLoading(false);
            navigate('/login'); // Redirigir a login si no hay token
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error(response.status, response.statusText);
                if (response.status === 401) {
                    navigate('/login');
                }
                return;
            }

            const favoritesData = await response.json();
            console.log("Datos de favoritos refrescados después de una acción:", favoritesData);
            dispatch({ type: "set_user_favorites", payload: favoritesData });

        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            // Este bloque se ejecuta SIEMPRE, ya sea que try o catch ocurran.
            // Es crucial para ocultar el spinner.
            setLoading(false);
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        fetchLoadingFavorites();
    }, [fetchLoadingFavorites]);


    return (
        <div>
            {loading && <Spinner />}

            {!loading && (
                <div className="container mt-5">
                    <h1 className="text-center mb-4">Mis Michis Favoritos</h1>
                    <div className="text-center">
                        {userFavorites.length === 0 ? (
                            <p>Aún no tienes ningún Michi en tus favoritos. <Link to="/" className="btn btn-link">Explorar Michis</Link></p>
                        ) : (
                            <h2>Aquí están tus Michis favoritos</h2>
                        )}
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 justify-content-center">
                        {userFavorites.map(favorite => {
                            const michi = favorite.michi_details;
                            // Usando el operador de encadenamiento opcional para mayor seguridad
                            const imageUrl = michi?.photos?.[0]?.foto || defaultMichiImg;

                            return (
                                <div key={favorite.id} className="col mb-4">
                                    <div className="card h-100 shadow-sm p-1"
                                        style={{ backgroundColor: '#F8F8F7' }}>
                                        <img
                                            src={imageUrl}
                                            className="mt-2"
                                            alt={`Foto de ${michi.name}`}
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="card-title text-center mb-2">{michi.name || `Michi ID: ${michi.id}`}</h5>
                                                <hr />
                                                {michi.breed && <p className="card-text">Raza: {michi.breed}</p>}
                                                {michi.age && <p className="card-text">Edad: {michi.age} años</p>}
                                                {michi.description && <p className="card-text text-muted small">{michi.description}</p>}
                                            </div>
                                            <div className="d-grid gap-2 mt-auto">
                                                <div
                                                    className="position-absolute"
                                                    style={{
                                                        bottom: "10px",
                                                        right: "10px",
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <AddFavorite michiId={michi.id} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};