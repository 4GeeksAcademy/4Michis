import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyData = ({ onEditClick }) => {

    const { store, dispatch } = useGlobalReducer();
    const { userData } = store
    console.log(store)

    const token = localStorage.getItem('token');

    const handleChangephotomichi = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target) /* elemento del DOM que desencadena el evento */
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/photomichi`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const photomichi = await response.json()
        
        

    }
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mis Datos de Usuario</h2>

            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
                <p><strong>Nombre:</strong> {userData.name} {userData.lastname}</p>
                <p><strong>Nickname:</strong> {userData.nickname}</p>
                <p><strong>DNI:</strong> {userData.dni}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Teléfono:</strong> {userData.phone}</p>
                <p><strong>Dirección:</strong> {userData.direction}</p>

                <button
                    className="btn btn-primary mt-3"
                    onClick={onEditClick}
                >
                    Editar Mis Datos
                </button>


            </div>
            <div className="register-form col-8 p-8">
                <form className="p-4 bg-light rounded shadow" onSubmit={handleChangephotomichi} >
                    <h2 className="text-center">EDITAR FOTO PERFIL</h2>
                    <hr />
                    <input type="file" name="PERFIL FEDE" className="form-control"/>
                    <div className="d-grid">
                        <button className="btn btn-primary m-5" type="submit">GUARDAR</button>
                    </div>
                </form>
            </div>
        </div>
    );
};