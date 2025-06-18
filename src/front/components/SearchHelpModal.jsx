import React from "react";

const SearchHelpModal = () => {
    return (
        <>
            {/* Botón con icono */}
            <button
                className="btn btn-outline-secondary btn-sm ms-2"
                data-bs-toggle="modal"
                data-bs-target="#searchHelpModal"
                title="¿Cómo buscar?"
            >
                <i className="fas fa-question-circle"></i>
            </button>

            {/* Modal */}
            <div
                className="modal fade"
                id="searchHelpModal"
                tabIndex="-1"
                aria-labelledby="searchHelpModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-3">
                        <div className="modal-header">
                            <h5 className="modal-title chewy-font h3" id="searchHelpModalLabel">
                                ¿Cómo buscar gatos?
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Cerrar"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>Nuestro buscador permite combinar varios filtros:</p>
                            <ul>
                                <li><strong>Edad exacta:</strong> 3 años, 5 años</li>
                                <li><strong>Rango de edad:</strong> entre 3 y 6 años, de 2 a 5 años</li>
                                <li><strong>Sexo:</strong> macho, hembra</li>
                                <li><strong>Color o raza:</strong> negro, siamés, etc.</li>
                                <li><strong>Combinaciones:</strong> siamés macho 4 años, naranja entre 2 y 6 años</li>
                            </ul>
                            <p><strong>Importante:</strong> No son excluyentes, si buscas "naranja 4 años", te mostrará todos los gatos naranjas tengan o no 4 años, <strong>nuestra filosofia cree que un michi puede encajar contigo tenga la edad o el color que tenga...</strong></p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn button-4michis chewy-font"
                                data-bs-dismiss="modal"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchHelpModal;