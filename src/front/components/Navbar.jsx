import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';
import michisLogo from "../assets/img/michis.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchHelpModal from './SearchHelpModal';

export const Navbar = () => {
	const location = useLocation();
	const isLoggedIn = !!localStorage.getItem('token');
	const isOnRegisterPage = location.pathname === '/register';
	const [query, setQuery] = useState('');
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			navigate(`/search?q=${encodeURIComponent(query)}`);
		}
	};

	return (
		<nav className="navbar navbar-dark bg-light px-4">
			<div className="container">
				<Link className="nav-link mx-auto" to="/"><span><img className="michis-logo" src={michisLogo} /></span></Link>
				<div className="mx-auto p-2 col-4 p-md-4">
					<form onSubmit={handleSearch} className="d-flex">
						<input
							type="text"
							placeholder="Buscar por Raza, Color, Edad, Sexo"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="form-control"
						/>
						<button type="submit" className="btn button-4michis chewy-font ms-2">Buscar</button><SearchHelpModal />
					</form>

				</div>
				<div className="d-flex gap-2 mx-auto">
					{!isLoggedIn && !isOnRegisterPage && (
						<Link to="/register" className="btn button-4michis chewy-font">
							Registrarse
						</Link>
					)}
					<AuthButton />
				</div>
			</div>
		</nav>
	);
};
