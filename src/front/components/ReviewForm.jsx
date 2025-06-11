import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ReviewForm = () => {
    const { store, dispatch } = useGlobalReducer();
    const [searchParams] = useSearchParams();
    const targetUserId = searchParams.get("target");
    const michiId = searchParams.get("michi");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [alert, setAlert] = useState({ type: "", message: "" });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${targetUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setRecipientName(data.nickname || "Usuario");
                } else {
                    console.error("Respuesta no válida al obtener usuario:", res.status);
                }
            } catch (err) {
                console.error("Error obteniendo nombre del usuario:", err);
            }
        };

        if (targetUserId) fetchUserName();
    }, [targetUserId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!michiId) {
            setAlert({ type: "danger", message: "Falta el ID del michi para enviar la valoración." });
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${targetUserId}/${michiId}/review`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating, comment }),
            });

            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: "add_sent_review",
                    payload: {
                        id: data.id,
                        target_user_id: targetUserId,
                        sender_user_id: store.userData.id, // Asume que está guardado
                        review: {
                            rating: rating,
                            comment: comment
                        }
                    }
                });

                setAlert({ type: "success", message: "¡Valoración enviada con éxito!" });
                setTimeout(() => navigate("/private?section=ratings"), 2000);
            } else {
                setAlert({ type: "danger", message: data.msg || "Error al enviar la valoración" });
            }
        } catch (err) {
            console.error("Error al enviar valoración:", err);
            setAlert({ type: "danger", message: "Error de red al enviar la valoración" });
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center">Valorar a {recipientName}</h2>

            {alert.message && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" onClick={() => setAlert({ type: "", message: "" })}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "600px" }}>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Puntuación</label>
                    <select
                        id="rating"
                        className="form-select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num} estrella{num > 1 ? "s" : ""}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comentario</label>
                    <textarea
                        id="comment"
                        className="form-control"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="¿Qué tal fue la experiencia?"
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Enviar valoración</button>
            </form>
        </div>
    );
};

export default ReviewForm;
