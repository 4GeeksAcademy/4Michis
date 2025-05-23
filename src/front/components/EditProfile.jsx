import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
            // Realizar la solicitud PUT a tu API
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userData.id}`, {
                method: 'PUT', // Método HTTP para actualizar recursos
                headers: {
                    'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON
                    'Authorization': `Bearer ${token}` // Envía el token para autenticación
                },
                body: JSON.stringify(updatedData) // Convierte el objeto JavaScript a una cadena JSON
            });

            if (response.ok) {
                // Si la respuesta es exitosa (código 2xx)
                const data = await response.json();
                // Actualiza los datos del usuario en tu store global
                dispatch({ type: "set_user_data", payload: data.user });
                console.log("Perfil actualizado con éxito:", data);
                // Aquí podrías, por ejemplo, redirigir al usuario o refrescar la sección de "Mis Datos"
            } else {
                // Si la respuesta no fue exitosa (ej. 400, 401, 500)
                console.error("Error al actualizar el perfil:", response.status, await response.text());
            }
        } catch (err) {
            // Captura errores de red o cualquier otra excepción durante la solicitud
            console.error("Error de conexión al actualizar el perfil:", err);
        }
    }


    return (
        <div>
            <h1 className="text-center">COMPONENTE EDITAR USUARIO</h1>
            <form onSubmit={handleSubmit}>
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
                <div className="d-grid gap-2">
                    <button className="btn btn-primary m-5" type="submit">
                        Save
                    </button>
                </div>
            </form>

        </div>
    )
}