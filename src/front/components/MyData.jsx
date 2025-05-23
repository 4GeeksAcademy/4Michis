import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyData = ({ onEditClick }) => {

    const { store, dispatch } = useGlobalReducer();
    const { userData } = store
    console.log(store)

    const token = localStorage.getItem('token');


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
                <p><strong>Rol:</strong> {userData.rol}</p>

                <button
                    className="btn btn-primary mt-3"
                    onClick={onEditClick}
                >
                    Editar Mis Datos
                </button>


            </div>

        </div>
    );
};