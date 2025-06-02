import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Favorites = () => {
    const { store, dispatch } = useGlobalReducer();
    const { userData } = store;
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const [favoriteCats, setFavoriteCats] = useState([]);




    useEffect(() => {
        const fetchLoadingFavorites = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtén el token aquí
                if (!token) {
                    setError("No hay token de autenticación. Por favor, inicia sesión.");
                    setLoading(false);
                    navigate('/login'); // Redirigir a login si no hay token
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
            dispatch({
                type: "set_user_favorites",
                payload: userFavorites.filter(fav => fav.michi_id !== michiId)
            });

        } catch (error) {
            console.error("Error eliminando favorito:", error);
        }
    };

    return (
        <div>
            <h3>COMPONENTE FAVORITOS</h3>
            <div className="text-center">
                {favoriteCats.length === 0 ? (
                    <p>No tienes ningún favorito</p>
                ) : (
                    <h2>Tus Michis favoritos</h2>
                )}
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                {favoriteCats.map(cat => (
                    <div key={cat.id} className="col">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={cat.photos && cat.photos.length > 0 ? cat.photos[0].foto : 'https://via.placeholder.com/200?text=Michi'}
                                className="card-img-top"
                                alt={`Foto de ${cat.name}`}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column justify-content-end">
                                <h5 className="card-title text-center mb-0">{cat.name}</h5>
                                <button
                                    onClick={() => handleRemoveFavorite(cat.id)}
                                    className="btn btn-danger btn-sm mt-3"
                                >
                                    Eliminar de Favoritos
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
