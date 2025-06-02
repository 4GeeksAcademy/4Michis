import React, { useEffect, useState } from "react";

export const Ratings = ({ sentReviews, receivedReviews }) => {
    const [tab, setTab] = useState("sent");
    const [userDetails, setUserDetails] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        const uniqueUserIds = new Set();
        sentReviews.forEach(r => uniqueUserIds.add(r.target_user_id));
        receivedReviews.forEach(r => uniqueUserIds.add(r.sender_user_id));

        const fetchUserDetails = async () => {
            const details = {};
            for (let id of uniqueUserIds) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        details[id] = {
                            nickname: data.nickname,
                            profile_picture: data.profile_picture
                        };
                    }
                } catch (e) {
                    console.error("Error fetching user details", e);
                }
            }
            setUserDetails(details);
        };

        if (token) fetchUserDetails();
    }, [sentReviews, receivedReviews]);

    const renderReviewItem = (review, isSent) => {
        const userId = isSent ? review.target_user_id : review.sender_user_id;
        const user = userDetails[userId] || {};

        return (
            <li key={review.id} className="list-group-item mb-3 shadow-sm rounded">
                <div className="d-flex align-items-center mb-2">
                    <img
                        src={user.profile_picture || "https://via.placeholder.com/40"}
                        alt="Perfil"
                        className="rounded-circle me-2"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                    />
                    <h6 className="mb-0">
                        {isSent ? "A:" : "De:"} <strong>{user.nickname || `Usuario #${userId}`}</strong>
                    </h6>
                </div>
                <p className="mb-1">Puntuación: <span className="badge bg-warning text-dark">{review.review?.rating}/5</span></p>
                {review.review?.comment && (
                    <p className="mb-0">Comentario: <em>"{review.review.comment}"</em></p>
                )}
            </li>
        );
    };

    return (
        <div className="container mt-5 col-6">
            <h2 className="text-center mb-4">Tus valoraciones</h2>
            <div className="d-flex justify-content-center mb-3">
                <button className={`btn btn-sm me-2 ${tab === "sent" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("sent")}>Hechas</button>
                <button className={`btn btn-sm ${tab === "received" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setTab("received")}>Recibidas</button>
            </div>
            <ul className="list-group">
                {(tab === "sent" ? sentReviews : receivedReviews).length === 0 ? (
                    <p className="text-center">No hay valoraciones {tab === "sent" ? "realizadas" : "recibidas"}.</p>
                ) : (
                    (tab === "sent" ? sentReviews : receivedReviews).map(r => renderReviewItem(r, tab === "sent"))
                )}
            </ul>
        </div>
    );
};