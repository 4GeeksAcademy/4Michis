import React, { useEffect, useState } from "react";
import CatCard from "../components/CatCard";

export const CatGallery = () => {
  const [cats, setCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const catsPerPage = 9;

  // Función para obtener los gatos desde la API
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/`);
        if (!response.ok) throw new Error("Error al obtener los gatos");

        const data = await response.json();

        // Asegura que el formato de la respuesta sea un arreglo
        const catsArray = Array.isArray(data) ? data : data.cats || [];
        setCats(catsArray);
      } catch (error) {
        console.error("Error al cargar los gatos:", error);
      }
    };

    fetchCats();
  }, []);

  const indexOfLastCat = currentPage * catsPerPage;
  const indexOfFirstCat = indexOfLastCat - catsPerPage;
  const currentCats = cats.slice(indexOfFirstCat, indexOfLastCat);
  const totalPages = Math.ceil(cats.length / catsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container py-4 mt-5 mb-5 cat-gallery">
      <h2 className="text-center mb-4 fw-bold chewy-font cat-gallery-title">¡Michis Esperando Hogar!</h2>
      <hr />

      <div className="row justify-content-center g-1">
        {currentCats.map((cat) => (
          <div key={cat.id} className="col-12 col-ms-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
            <CatCard cat={cat} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};