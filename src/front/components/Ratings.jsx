import React, { useState, useEffect } from "react";
export const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user/sent-reviews`;
                const token = localStorage.getItem("token");
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                });

                if (!response.ok) {
                    const errorDetails = await response.text();
                    console.error(`Error HTTP: ${response.status} - ${response.statusText}. Detalles: ${errorDetails}`);
                    setErrorMessage(`Error al cargar las valoraciones: ${response.status}.`);
                    setRatings([]);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setRatings(Array.isArray(data.valoraciones) ? data.valoraciones : []);
                setErrorMessage(null);
                setLoading(false);
                console.log("Datos de valoraciones obtenidos:", data);
            } catch (error) {
                console.error("Error al obtener las valoraciones:", error);
                setErrorMessage("Error de conexión al cargar las valoraciones.");
                setRatings([]);
                setLoading(false);
            }
        };

        fetchRatings();
    }, []);
    if (loading) {
        return <p className="text-center">Cargando valoraciones...</p>;
    }
    if (errorMessage) {
        return <p className="text-center text-danger">Error: {errorMessage}</p>;
    }
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Valoraciones de Otros Usuarios</h2>
            {ratings.length === 0 ? (
                <p className="text-center">Aún no hay valoraciones para mostrar.</p>
            ) : (
                <ul className="list-group">
                    {ratings.map(rating => (
                        <li key={rating.id} className="list-group-item mb-3 shadow-sm rounded">
                            <div className="d-flex w-100 justify-content-between">
                                <h6 className="mb-1">Por: <strong className="text-primary">{rating.usuario}</strong></h6>
                                <small className="text-muted">Fecha: {new Date(rating.fecha).toLocaleDateString()}</small>
                            </div>
                            <p className="mb-1">Puntuación: <span className="badge bg-warning text-dark">{rating.puntuacion}/5</span></p>
                            {rating.comentario && <p className="mb-0">Comentario: <em>"{rating.comentario}"</em></p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};