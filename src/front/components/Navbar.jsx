import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';
import michisLogo from "../assets/img/michis.png";

export const Navbar = () => {
	const location = useLocation();
	const isLoggedIn = !!localStorage.getItem('token');
	const isOnRegisterPage = location.pathname === '/register';

	return (
		<nav className="navbar navbar-dark bg-light px-4">
			<span><img className="michis-logo" src={michisLogo} /></span>
			<span className="d-flex">
				<Link className="nav-link" to="/">
					Inicio
				</Link>
			</span>

			<div className="d-flex gap-2">
				{!isLoggedIn && !isOnRegisterPage && (
					<Link to="/register" className="btn btn-outline-dark">
						Register
					</Link>
				)}
				<AuthButton />
			</div>
		</nav>
	);
};
