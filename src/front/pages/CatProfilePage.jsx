import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CatInfoBox from "../components/CatInfoBox";
import CatPhoto from "../components/CatPhoto";

const CatProfilePage = () => {
  const { catId } = useParams();
  const [cat, setCat] = useState(null);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`);
        if (!response.ok) throw new Error("Error al obtener el gato");

        const data = await response.json();
        setCat(data.cat);
      } catch (error) {
        console.error("Error al cargar el gato:", error);
      }
    };

    fetchCat();
  }, [catId]);

  if (!cat) return <div className="text-center py-5">Cargando michi...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        {/* Columna de fotos */}
        <div className="col-12 col-md-3 d-flex flex-column gap-3">
          {cat.photos.length > 0 ? (
            cat.photos.map((photo, index) => (
              <CatPhoto key={index} photoUrl={photo.url} />
            ))
          ) : (
            <CatPhoto photoUrl="https://via.placeholder.com/300x200?text=Sin+foto" />
          )}
        </div>

        {/* Columna de info */}
        <div className="col-12 col-md-9">
          <h2 className="text-uppercase fw-bold mb-3">{cat.name}</h2>
          <div className="border border-primary p-3 bg-light">
            <CatInfoBox
              name={cat.name}
              breed={cat.breed}
              weight={cat.weight}
              age={cat.age}
              color={cat.color}
              sex={cat.sex}
              extra={cat.description}
            />
          </div>

          {/* Botones */}
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-secondary">Contactar</button>
            <button className="btn btn-outline-danger">♡</button>
            <button className="btn btn-outline-warning">★</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatProfilePage;