import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Favorites = () => {
    const { store, dispatch } = useGlobalReducer();
    const { userData, useFavorites } = store;
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const [favoriteCats, setFavoriteCats] = useState([]);




    useEffect(() => {
        const fetchLoadingFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No hay token de autenticación. Por favor, inicia sesión.");
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error(response.status, response.statusText);
                    return;
                }

                const favoritesData = await response.json();
                console.log("datos de favoritos", favoritesData);
                dispatch({ type: "set_user_favorites", payload: favoritesData });


            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchLoadingFavorites();
    }, []);

    const handleRemoveFavorite = async (catId) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("¿Estás seguro de que quieres eliminar este Michi de tus favoritos?")) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${catId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Error eliminando favorito:", response.statusText);
                return;
            }
            fetchLoadingFavorites();
            console.log("favorito eliminado con exito")
            // Eliminar el michi del estado local


        } catch (error) {
            console.error("Error eliminando favorito:", error);
        }
    };

    return (
        <div>
            <div className="container py-4">
                <h2 className="text-center mb-4 fw-bold fs-2">MIS FAVORITOS</h2>

                <div className="row justify-content-center">

                </div>
            </div>
        </div>
    );
};
