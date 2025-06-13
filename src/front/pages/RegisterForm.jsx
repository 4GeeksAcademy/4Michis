import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        dni: '',
        nickname: '',
        direction: '',
        email: '',
        phone: '',
        is_active: true,
        rol: 1,
        password: '',
        profile_picture: '',
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateDNI = (dni) => {
        const dniRegex = /^(\d{8})([A-HJ-NP-TV-Z])$/i;
        const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        if (!dniRegex.test(dni)) return false;
        const [, number, letter] = dni.match(dniRegex);
        return letters[number % 23] === letter.toUpperCase();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }
        if (!validateDNI(formData.dni)) {
            newErrors.dni = 'DNI inválido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setSubmitStatus(`Usuario registrado: ${result.email}`);

                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                const error = await response.json();
                setSubmitStatus(`Error: ${error.msg || 'No se pudo registrar'}`);
            }
        } catch (err) {
            setSubmitStatus('Error de conexión con el servidor');
        }
    };

    const fields = [
        { name: 'name', label: 'Nombre' },
        { name: 'lastname', label: 'Apellidos' },
        { name: 'dni', label: 'DNI (Ej: 00000000A)' },
        { name: 'nickname', label: 'Apodo' },
        { name: 'direction', label: 'Dirección' },
        { name: 'email', label: 'Email' },
        { name: 'phone', label: 'Teléfono' },
        { name: 'password', label: 'Contraseña' },
    ];

    return (
        <div className="register-container d-flex justify-content-center">
            <div className="col-12 col-md-5 p-4 mt-5 mb-5">
                <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
                    <h2 className="chewy-font text-center">Registro como Michi Lover</h2>
                    <hr></hr>
                    <p>Te estás registrando en el sistema de distribución de gatos más adorable de la red, no te vas a arrepentir de esta gran decisión</p>


                    {fields.map(({ name, label }) => (
                        <div key={name} className="mb-3">
                            <label htmlFor={name} className="form-label">{label}</label>
                            <input
                                type={name === 'password' ? 'password' : 'text'}
                                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                                id={name}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                        </div>
                    ))}


                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn button-4michis chewy-font">Registrar</button>
                    </div>

                    {submitStatus && (
                        <div className="mt-3 alert alert-info">{submitStatus}</div>
                    )}
                </form>
            </div>
        </div>
    );
};
