import React from 'react'
import { useNavigate, Link } from 'react-router-dom';

export const AccountMenu = () => {
    const navigate = useNavigate();

    return (
        <div className="btn-group">
            <button type="button" className="btn btn-outline-dark"> <Link to="/private" className="nav-link" >
                Mi Cuenta
            </Link></button>
            <button type="button" className="btn btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/private?section=my-data">Mis Michis</Link></li>
                <li><Link className="dropdown-item" to="/private?section=favorites">Favoritos</Link></li>
                <li><Link className="dropdown-item" to="/private?section=ratings">Valoraciones</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/private?section=my-data">Mis Datos</Link></li>
                <li><Link className="dropdown-item" to="/private?section=edit-profile">Editar Perfil</Link></li>
            </ul>
        </div>
    )
}
