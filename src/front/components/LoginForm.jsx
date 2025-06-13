import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }
        if (!formData.password) {
            newErrors.password = 'Contraseña requerida';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('Login exitoso');

                localStorage.setItem('token', data.token);

                navigate('/private');
            } else {
                setSubmitStatus(data.msg || 'Credenciales incorrectas');
            }
        } catch (error) {
            setSubmitStatus('Error al conectar con el servidor');
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="col-12 col-md-5 p-4 mt-5 mb-5">
                <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
                    <h2 className="chewy-font text-center">Iniciar Sesión</h2>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn button-4michis chewy-font">Entrar</button>
                    </div>

                    {submitStatus && <div className="mt-3 alert alert-info">{submitStatus}</div>}
                </form>

            </div >
        </div >
    );
};