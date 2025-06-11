import React from 'react';
import logoImage from './huellaCat.png'; // ¡Asegúrate de que esta ruta sea correcta!


import './Spinner.css';

// Componente funcional Spinner
export const Spinner = () => {
    return (
        // Este es el contenedor principal que cubre la pantalla
        <div id="loader-container">
            {/* Este div será el círculo que rota */}
            <div className="spinner-rotation-effect"></div>

            {/* Este div contendrá la imagen y solo hará el efecto de aparecer/desaparecer */}
            <div className="spinner-logo-container">
                <img src={logoImage} alt="Logo de Michis" className="spinner-logo" />
            </div>
        </div>
    );
};