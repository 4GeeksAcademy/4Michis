import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./spiner/Spinner";



export const EditProfile = () => {

    const { store, dispatch } = useGlobalReducer();
    const { userData } = store;
    console.log(store);

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [nickname, setNickname] = useState("");
    const [dni, setDni] = useState("");
    const [phone, setPhone] = useState("");
    const [direction, setDirection] = useState("");
    const [isLoading, setIsLoading] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (userData) {
            setName(userData.name || ""); /* || "" usamos esto por si hay algun campo que no esta definido ( si user.data no esta definido usa una cadena vacia) */
            setLastname(userData.lastname || "");
            setNickname(userData.nickname || "");
            setDni(userData.dni || "");
            setPhone(userData.phone || "");
            setDirection(userData.direction || "");

        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "lastname":
                setLastname(value);
                break;
            case "nickname":
                setNickname(value);
                break;
            case "dni":
                setDni(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "direction":
                setDirection(value);
                break;

            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        const updatedData = {
            name,
            lastname,
            nickname,
            dni,
            phone,
            direction,
        };


        try {

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "set_user_data", payload: data });
                console.log("Perfil actualizado con éxito:", data);
                navigate('/private?section=my-data')

            } else {
                console.error("Error al actualizar el perfil:", response.status, await response.text());
            }
        } catch (err) {
            console.error("Error de conexión al actualizar el perfil:", err);
        }
    }

    const handleChangeProfilePicture = async (e) => {
        e.preventDefault()
        setIsLoading(true);

        const formData = new FormData(e.target) /* elemento del DOM que desencadena el evento */



        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profilepicture`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const responseData = await response.json()
                const newProfilePictureUrl = responseData.profilePicture[0]
                console.log(newProfilePictureUrl)
                const updatedUserData = {
                    ...userData,
                    profile_picture: newProfilePictureUrl
                }
                dispatch({ type: "set_user_data", payload: updatedUserData });
                navigate('/private?section=profile')
                console.log("Foto de perfil actualizada y store global actualizado:", updatedUserData);
                return;

            } else {
                console.error("Error al actualizar la foto de perfil:", response.status, await response.text());
            }

        } catch (err) {
            console.error("Error de conexión al actualizar la foto de perfil:", err);
        } finally {
            setIsLoading(false);
            /* // Este bloque se ejecuta siempre, ya sea que la operación fue exitosa o falló.
            // Usamos setTimeout para que el spinner dure al menos 3 segundos.
            setTimeout(() => {
                setIsLoading(false); // ¡Desactiva el spinner después del retardo!
            }, 3000); // 3000 milisegundos = 3 segundos */
        }


    }


    return (
        <div className="register-container d-flex flex-column justify-content-center align-items-center ">
            {isLoading && <Spinner />}
            <div className="register-form col-8 p-8 mt-5 mb-5">

                <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
                    <h2 className="text-center">Datos de Usuario</h2>
                    <hr />
                    <div>
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastname" className="form-label">Lastname</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastname"
                            name="lastname"
                            value={lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="dni" className="form-label">DNI</label>
                        <input
                            type="text"
                            className="form-control"
                            id="dni"
                            name="dni"
                            value={dni}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="nickname" className="form-label">Nickname</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nickmame"
                            name="nickname"
                            value={nickname}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="direction" className="form-label">Direction</label>
                        <input
                            type="text"
                            className="form-control"
                            id="direction"
                            name="direction"
                            value={direction}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-grid gap-2 justify-content-end">
                        <button className="btn btn-primary m-5" type="submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
            <div className="register-form col-8 p-8">
                <form className="p-4 bg-light rounded shadow" onSubmit={handleChangeProfilePicture}>
                    <h2 className="text-center">Foto de Perfil</h2>
                    <hr />
                    <input type="file" name="PERFIL FEDE" className="form-control" />
                    <div className="d-grid justify-content-end">
                        <button className="btn btn-primary m-5" type="submit">Guardar</button>
                    </div>
                </form>
            </div>

        </div >
    )
}