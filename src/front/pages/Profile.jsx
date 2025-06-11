import React, { useState, useEffect } from "react";
import { Favorites } from "../components/Favorites";
import { Ratings } from "../components/Ratings";
import { MyData } from "../components/MyData";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EditProfile } from "../components/EditProfile";
import { useLocation } from "react-router-dom";

export const Profile = () => {
    const [userName, setUserName] = useState("usuario")
    const [activeSection, setActiveSection] = useState('profile');

    const token = localStorage.getItem('token');

    const { store, dispatch } = useGlobalReducer();
    const { userData } = store;
    const [dataPhoto, setDataPhoto] = useState(null)
    console.log(dataPhoto)


    useEffect(() => {

        const fetchUserInfo = async () => {
            if (!token) {
                setUserName("Invitado");
                return;
            }

            try {

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.user.name);
                    dispatch({ type: "set_user_data", payload: data.user })
                    setDataPhoto(data.profilePicture)


                    console.log(data)


                } else {

                    console.error("Error al obtener la información del usuario:", response.status, await response.text());
                    setUserName("Error al cargar");
                }
            } catch (err) {

                console.error("Error de conexión al obtener la información del usuario:", err);
                setUserName("Error al cargar");
            }
        };

        fetchUserInfo();
    }, [token]);

    /* const handleShowFavorites = () => {
        setActiveSection('favorites');
    }; */
    /* const handleShowRatings = () => {
        setActiveSection('ratings');
    }; */
    const handleShowMyData = () => {
        setActiveSection('my-data');
    };
    const handleShowEditProfile = () => {
        setActiveSection('edit-profile');
    };

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get("section");

        if (section) {
            setActiveSection(section);
        }
    }, [location]);

    return (
        <div className="container py-5">
            {token ? (
                <div>
                    <div className="rounded bg-body-secondary p-3 m-3">
                        <div className="d-flex">
                            <img
                                src={dataPhoto}
                                alt="User Profile"
                                className="rounded-circle ms-3"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <h1 className="m-3">Hola, {userData.name}</h1>
                        </div>
                    </div>

                    {activeSection === 'favorites' && (
                        <div className="mt-5">
                            <Favorites />
                        </div>
                    )}
                    {activeSection === 'ratings' && (
                        <div className="mt-5">
                            <Ratings />
                        </div>
                    )}
                    {activeSection === 'my-data' && (
                        <div className="mt-5">
                            <MyData onEditClick={handleShowEditProfile} />
                        </div>
                    )}
                    {activeSection === 'edit-profile' && (
                        <div className="mt-5">
                            <EditProfile />
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-danger">No tienes acceso. Inicia sesión primero.</p>
            )}
        </div>
    );
};


