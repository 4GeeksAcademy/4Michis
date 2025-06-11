import React, { useEffect, useState } from "react";
import CatCard from "../components/CatCard";

export const CatGallery = () => {
  const [cats, setCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const catsPerPage = 9;

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/`);
        if (!response.ok) throw new Error("Error al obtener los gatos");

        const data = await response.json();
        const catsArray = Array.isArray(data) ? data : data.cats || [];
        setCats(catsArray);
      } catch (error) {
        console.error("Error al cargar los gatos:", error);
      }
    };

    fetchCats();
  }, []);

  // Filtrar solo gatos activos
  const activeCats = cats.filter((cat) => cat.is_active);
  const indexOfLastCat = currentPage * catsPerPage;
  const indexOfFirstCat = indexOfLastCat - catsPerPage;
  const currentCats = activeCats.slice(indexOfFirstCat, indexOfLastCat);
  
  const totalPages = Math.ceil(activeCats.length / catsPerPage);
 

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div
      className="container py-4 mt-5 mb-5"
      style={{
        backgroundImage: `url('https://i.pinimg.com/1200x/15/09/de/1509de0d8bdab65ad19e63f92b5934f0.jpg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-center mb-4 fw-bold fs-2">¡NUESTROS MICHIS!</h2>
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