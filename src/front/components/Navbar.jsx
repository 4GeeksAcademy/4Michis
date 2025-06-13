import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';
import michisLogo from "../assets/img/michis.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
			<span><img className="michis-logo" src={michisLogo} /></span>
			<span className="d-flex">
				<Link className="nav-link" to="/">
					Inicio
				</Link>
			</span>

			<form onSubmit={handleSearch} className="d-flex">
				<input
					type="text"
					placeholder="Buscar michi..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="form-control"
				/>
				<button type="submit" className="btn  button-4michis chewy-font  ms-2">Buscar</button>
			</form>

			<div className="d-flex gap-2">
				{!isLoggedIn && !isOnRegisterPage && (
					<Link to="/register" className="btn button-4michis chewy-font btn-outline-dark">
						Register
					</Link>
				)}
				<AuthButton />
			</div>
		</nav>
	);
};
