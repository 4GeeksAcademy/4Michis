import React, { useState } from "react";
import ContactModal from "./ContactModal";
import defaultProfileImg from "../assets/img/default_profile.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import CatStatusToggle from "./CatStatusToggle";
import { useNavigate } from "react-router-dom";

const MyCatCard = ({ cat, isOwner, onAdoptSelect, onRefresh }) => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const alreadyHasAdoptant =
        Array.isArray(cat.contacts) && cat.contacts.some(c => c.is_selected);

    const handleOpenModal = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedContact(null);
        setShowModal(false);
    };

    const handleMarkAsAdoptant = (contactorId) => {
        if (onAdoptSelect) onAdoptSelect(cat.cat_id, contactorId);
    };

    const recentContacts = Array.isArray(cat.contacts)
        ? [...cat.contacts]
            .sort((a, b) => new Date(b.contacted_at) - new Date(a.contacted_at))
            .slice(0, 3)
        : [];

    return (
        <div className="card h-100 text-center">
            {/* Cabecera con nombre y botones */}
            <div className="card-header d-flex flex-column align-items-center">
                <h6 className="text-uppercase fw-bold mb-2">{cat.cat_name}</h6>
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn btn-sm btn-outline-primary px-2 py-0"
                        style={{ fontSize: "0.75rem", height: "28px" }}
                        onClick={() => navigate(`/edit-cat/${cat.cat_id}`)}
                        title="Editar gato"
                    >
                        🖊️
                    </button>
                    <CatStatusToggle
                        catId={cat.cat_id}
                        onStatusChange={onRefresh}
                        size="sm"
                    />
                </div>
            </div>

            {/* Cuerpo con contactos */}
            <div className="card-body">
                {recentContacts.length === 0 ? (
                    <p className="text-muted">Ningún interesado aún.</p>
                ) : (
                    <ul className="list-group list-group-flush">
                        {recentContacts.map((contact, index) => (
                            <li key={contact.contactor_id || index} className="list-group-item">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={contact.profile_picture || defaultProfileImg}
                                            alt="Foto de perfil"
                                            className="rounded-circle"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <strong>{contact.nickname}</strong>
                                        {contact.is_selected && (
                                            <span className="badge bg-success ms-2">Adoptante</span>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleOpenModal(contact)}
                                            title="Ver Datos de usuario"
                                        >
                                            <i className="fas fa-address-card"></i>
                                        </button>
                                        {isOwner && !alreadyHasAdoptant && !contact.is_selected && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleMarkAsAdoptant(contact.contactor_id)}
                                                title="Marcar como adoptante"
                                            >
                                                <i className="fas fa-handshake"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {Array.isArray(cat.contacts) && cat.contacts.length > 3 && (
                    <div className="text-end mt-2">
                        <small className="text-muted">
                            +{cat.contacts.length - 3} contactos más en el perfil del michi
                        </small>
                    </div>
                )}
            </div>

            <ContactModal
                show={showModal}
                person={selectedContact}
                title="Información del contacto"
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default MyCatCard;