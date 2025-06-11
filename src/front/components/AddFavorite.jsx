import React, { useState, useEffect } from "react";
import useGlobalReducer from '../hooks/useGlobalReducer'; // Ajusta la ruta si es necesario
import { useNavigate } from 'react-router-dom';



export const AddFavorite = ({ michiId }) => {
    const { store, dispatch } = useGlobalReducer();
    const { userFavorites } = store;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(false);

    useEffect(() => {
        // Verifica si el michiId actual está en la lista de favoritos del store
        const alreadyIsFavorite = userFavorites.some(fav => fav.michi_details && fav.michi_details.id === michiId);
        setIsCurrentlyFavorite(alreadyIsFavorite);
    }, [userFavorites, michiId]); // Se re-ejecuta cada vez que userFavorites o michiId cambian



    const handleToggleFavorite = async (e) => {
        e.stopPropagation(); // Evita que se propague el evento de clic, útil si está en una tarjeta clicable
        setError(null); // Reinicia cualquier error previo
        setLoading(true); // Activa el estado de carga


        const token = localStorage.getItem('token');

        if (!token) {
            alert("Necesitas iniciar sesión para agregar favoritos.");
            navigate('/login');
            setLoading(false); // Quita el loading si no hay token
            return;
        }

        let url;
        let method;
        let body = null;
        let successMsg = "";
        let dispatchType = "";
        let dispatchPayload = null;

        if (isCurrentlyFavorite) {
            // Lógica para QUITAR de favoritos
            url = `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${michiId}`; // URL para DELETE
            method = 'DELETE';
            successMsg = "Michi eliminado de favoritos.";
            dispatchType = "remove_user_favorite";
            dispatchPayload = michiId; // Para DELETE, el payload es solo el ID del michi
        } else {
            // Lógica para AÑADIR a favoritos
            url = `${import.meta.env.VITE_BACKEND_URL}/api/favorites`; // URL para POST
            method = 'POST';
            body = JSON.stringify({ michi_id: michiId }); // Cuerpo para POST
            successMsg = "Michi añadido a favoritos.";
            dispatchType = "add_new_favorite";
            // Para POST, el payload se establecerá después de recibir `data.favorite` del backend
        }

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json(); // Siempre intenta leer la respuesta JSON

            if (!response.ok) {
                // Manejo específico para el caso de conflicto (409) al añadir
                if (response.status === 409) {
                    alert(data.msg || "Este michi ya está en tus favoritos.");
                    setError(data.msg || "Este michi ya está en tus favoritos.");
                    // Si el backend te devuelve el favorito existente, podrías usarlo para actualizar el estado
                    if (data.favorite) {
                        setIsCurrentlyFavorite(true); // Asegura que el botón se muestre como favorito
                    }
                    return; // No es un error crítico, salimos de la función
                }
                // Otros errores HTTP (400, 500, etc.)
                setError(data.msg || `Error de la API: ${response.status} ${response.statusText}`);
                console.error("Error en la operación de favorito:", response.status, data);
                if (response.status === 401) { // Si el token es inválido/expirado
                    navigate('/login');
                }
                return;
            }

            // Si la operación fue exitosa (response.ok es true)
            console.log(successMsg, data);


            // Actualizar el estado global (store) y el estado local del botón
            if (isCurrentlyFavorite) {
                // Si eliminamos, despachamos la acción de remover
                dispatch({ type: dispatchType, payload: dispatchPayload });
                setIsCurrentlyFavorite(false); // Actualizamos el estado local a "no favorito"
            } else {
                // Si añadimos, despachamos la acción de añadir con el objeto favorito completo
                dispatch({ type: dispatchType, payload: data.favorite });
                setIsCurrentlyFavorite(true); // Actualizamos el estado local a "favorito"
            }

        } catch (netError) {
            // Errores de red (sin conexión, DNS, etc.)
            console.error("Error de conexión al gestionar favorito:", netError);
            setError("Error de conexión con el servidor. Intenta de nuevo.");
            alert("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false); // Desactiva el estado de carga al finalizar la operación
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            className={`btn btn-sm ${isCurrentlyFavorite ? "btn-light" : "btn-outline-danger"}`}
            disabled={loading} // El botón se deshabilita mientras la operación está en curso
            title={isCurrentlyFavorite ? "Quitar de favoritos" : "Añadir a favoritos"} // Título al pasar el mouse
        >
            {loading ? (
                // Muestra un spinner mientras carga
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
                // Muestra el corazón lleno o vacío según el estado
                <i className={`fa${isCurrentlyFavorite ? "s" : "r"} fa-heart`}
                    style={{ color: isCurrentlyFavorite ? 'red' : 'inherit' }} // Pinta el corazón de rojo
                ></i>
            )}
        </button>
    );
};


