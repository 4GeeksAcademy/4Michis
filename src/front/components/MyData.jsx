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
            <h2 className="text-center mb-4 chewy-font">Datos de Usuario</h2>


            <div className="card shadow-sm d-flex p-4 mx-auto " style={{ maxWidth: '600px' }}>
        <div className="row g-3">
                
                <div className="col-sm-8 order-sm-1 order-2">
                    <p><strong>Nombre:</strong> {userData.name} {userData.lastname}</p>
                    <p><strong>Nickname:</strong> {userData.nickname}</p>
                    <p><strong>DNI:</strong> {userData.dni}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Teléfono:</strong> {userData.phone}</p>
                    <p><strong>Dirección:</strong> {userData.direction}</p>

                </div>
                <div className="col-sm-4 d-flex justify-content-sm-end justify-content-center order-sm-2 order-1">
                    <img
                        src={userData.profile_picture ? userData.profile_picture : defaultProfilePlaceholder}
                        alt="User Profile"
                        className="rounded-circle ms-3"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                </div>
                </div>
                


                <button
                    className="btn button-4michis chewy-font mt-3"
                    onClick={onEditClick}
                >
                    Editar Mis Datos
                </button>


            </div>

        </div>
    );
};