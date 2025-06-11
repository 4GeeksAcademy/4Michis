import React, { useState, useEffect, useCallback } from "react";
import { Favorites } from "../components/Favorites";
import { Ratings } from "../components/Ratings";
import { MyData } from "../components/MyData";
import { EditProfile } from "../components/EditProfile";
import MyCatCard from "../components/MyCatCard";
import AdoptedCatCard from "../components/AdoptedCatCard";
import ProfileMenu from "../components/ProfileMenu";
import { AgregarGato } from "../components/AgregarGato";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useLocation, useNavigate } from "react-router-dom";
import defaultProfilePlaceholder from '../assets/img/placeholder-perfil.jpg';


export const Profile = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [dataPhoto, setDataPhoto] = useState(null);
    const { store, dispatch } = useGlobalReducer();
    const { userData, myCats, adoptedCats, givenCatsWithAdoptant, sentReviews, receivedReviews } = store;
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const unadoptedCats = Array.isArray(myCats)
        ? myCats.filter(cat => !Array.isArray(cat.contacts) || !cat.contacts.some(c => c.is_selected))
        : [];

    const fetchGivenCats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/given-cats-with-adoptant`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                dispatch({ type: "set_given_cats_with_adoptant", payload: data });
            }
        } catch (err) {
            console.error("Error al actualizar gatos dados:", err);
        }
    };

    const handleAdoptSelect = async (catId, userId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/adopt/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: "update_cat_adoptant",
                    payload: { catId, contactorId: userId }
                });

                fetchGivenCats();
            } else {
                alert(data.error || "No se pudo marcar como adoptante");
            }
        } catch (err) {
            console.error("Error al marcar como adoptante:", err);
        }
    };

    const goToReview = (targetUserId, michiId) => {
        navigate(`/review?target=${targetUserId}&michi=${michiId}`);
    };

    const hasReviewed = (targetId, michiId) => {
        return sentReviews.some(review =>
            Number(review.target_user_id) === Number(targetId) &&
            Number(review.michi_id) === Number(michiId)
        );
    };

    const fetchUserFavorites = useCallback(async () => {
        if (!token) {
            dispatch({ type: "set_user_favorites", payload: [] });
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    dispatch({ type: "set_user_favorites", payload: [] });
                    navigate('/login');
                }
                return;
            }

            const favorites = await res.json();
            dispatch({ type: "set_user_favorites", payload: favorites });
        } catch (err) {
            console.error("Error cargando favoritos:", err);
        }
    }, [token, dispatch, navigate]);

    useEffect(() => { fetchUserFavorites(); }, [fetchUserFavorites]);

    useEffect(() => {
        const fetchAdoptionData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${token}` };

                const [adoptedRes, givenRes, sentRes, receivedRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/adopted-cats`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/given-cats-with-adoptant`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/sent-reviews`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userData.id}/reviews`, { headers })
                ]);

                dispatch({ type: "set_adopted_cats", payload: adoptedRes.ok ? await adoptedRes.json() : [] });
                dispatch({ type: "set_given_cats_with_adoptant", payload: givenRes.ok ? await givenRes.json() : [] });
                dispatch({ type: "set_sent_reviews", payload: sentRes.ok ? await sentRes.json() : [] });
                dispatch({ type: "set_received_reviews", payload: receivedRes.ok ? await receivedRes.json() : [] });
            } catch (err) {
                console.error("Error obteniendo adopciones y valoraciones:", err);
            }
        };

        if (userData?.id) fetchAdoptionData();
    }, [token, userData]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    dispatch({ type: "set_user_data", payload: data.user });
                    setDataPhoto(data.profilePicture);
                } else {
                    console.error("Error al obtener info usuario:", res.status, await res.text());
                }
            } catch (err) {
                console.error("Error red usuario:", err);
            }
        };

        fetchUserInfo();
    }, [token]);

    useEffect(() => {
        const section = new URLSearchParams(location.search).get("section");
        if (section) setActiveSection(section);
    }, [location]);

    useEffect(() => {
        const fetchMyCats = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats-contacted`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                dispatch({ type: "set_my_cats", payload: data });
            } catch (err) {
                console.error("Error cargando gatos del usuario:", err);
            }
        };


        fetchMyCats();
    }, [token]);

    return (
        <div className="container py-5">
            {token ? (
                <>
                    {activeSection === 'favorites' && <Favorites />}
                    {activeSection === 'ratings' && <Ratings sentReviews={sentReviews} receivedReviews={receivedReviews} />}
                    {activeSection === 'my-data' && <MyData onEditClick={() => setActiveSection('edit-profile')} />}
                    {activeSection === 'edit-profile' && <EditProfile />}
                    {activeSection === 'add-cat' && <AgregarGato />}
                    {activeSection === 'profile' && (
                        <div className="p-3 m-3">
                            <div className="d-flex justify-content-center">
                                <img
                                    src={userData.profile_picture ? userData.profile_picture : defaultProfilePlaceholder}
                                    alt="User Profile"
                                    className="rounded-circle ms-3"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <h1 className="m-3">Hola, {userData.name}</h1>
                            </div>
                            <hr />
                            <ProfileMenu onSelect={setActiveSection} />
                        </div>
                    )}

                    {activeSection === 'my-cats' && (
                        <>
                            <h2 className="text-center mt-4">Mis Michis sin adoptar</h2>
                            {unadoptedCats.filter(cat => cat.user_id === userData.id).length === 0 ? (
                                <p className="text-center text-muted">No tienes michis sin adoptar.</p>
                            ) : (
                                <div className="row">
                                    {unadoptedCats.map((cat) => (
                                        <div key={cat.cat_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                            <MyCatCard cat={cat} isOwner={true} onAdoptSelect={handleAdoptSelect} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {givenCatsWithAdoptant.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-center mb-3">Tus michis adoptados por otros</h3>
                                    <div className="row">
                                        {givenCatsWithAdoptant.map((cat) => (
                                            <div key={cat.cat_id} className="col-md-4 mb-4">
                                                <AdoptedCatCard
                                                    cat={cat}
                                                    userLabel="Adoptante"
                                                    onRate={() => goToReview(cat.adoptant_id, cat.cat_id)}
                                                    showRateButton={!hasReviewed(cat.adoptant_id, cat.cat_id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {adoptedCats.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-center mb-3">Has adoptado estos michis</h3>
                                    <div className="row">
                                        {adoptedCats.map((cat) => (
                                            <div key={cat.cat_id} className="col-md-4 mb-4">
                                                <AdoptedCatCard
                                                    cat={cat}
                                                    userLabel="Dueño anterior"
                                                    onRate={() => goToReview(cat.owner_id, cat.cat_id)}
                                                    showRateButton={!hasReviewed(cat.owner_id, cat.cat_id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <p className="text-danger">No tienes acceso. Inicia sesión primero.</p>
            )}
        </div>
    );
};
