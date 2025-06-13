import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ContactModal from "../components/ContactModal";
import UploadCatProfilePicture from "../components/UploadCatProfilePicture";


const CatProfilePage = () => {
  const { catId } = useParams();
  const [cat, setCat] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");//-----
  const [messageType, setMessageType] = useState("info");//---------

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`);
        if (!response.ok) throw new Error("Error al obtener el gato");
        const data = await response.json();
        if (!data.cat || data.cat.is_active === false) {
          setCat(null); // ocultar si está inactivo
          return;
        }
        setCat(data.cat);
      } catch (error) {
        console.error("Error al cargar el gato:", error);
      }
    };
    fetchCat();
  }, [catId]);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCurrentUserId(data.user.id);
      } catch (err) {
        console.error("Error al obtener ID del usuario:", err);
      }
    };
    fetchUserId();
  }, []);

  const handleContact = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.owner) {
        setOwnerInfo(data.owner);
        setShowModal(true);
      } else {
        alert(data.error || "No se pudo contactar.");
      }
    } catch (err) {
      console.error("Error al contactar:", err);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${cat.id}/photos/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCat((prev) => ({
          ...prev,
          photos: prev.photos.filter((p) => p.id !== photoId),
        }));
        setActiveIndex(0);
      } else {
        const data = await res.json();
        alert("Error: " + data.error || "No se pudo eliminar la foto");
      }
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
    }
  };


  useEffect(() => {
    if (!cat || !cat.id) return;

    const el = document.getElementById(`catCarousel-${cat.id}`);
    if (el && window.bootstrap) {
      const carousel = bootstrap.Carousel.getOrCreateInstance(el);
      carousel.to(activeIndex);
    }
  }, [activeIndex, cat]);


  if (!cat) return <div className="text-center py-5">Cargando michi...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4 ">

        <div
          id={`catCarousel-${cat.id}`}
          className="carousel slide shadow rounded col-6 p-3"
          data-bs-ride="false"
        >
          <div
            id={`catCarousel-${cat.id}`}
            className="carousel slide shadow rounded"
            data-bs-ride="false"
          >
            <div className="carousel-inner">
              {cat.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`carousel-item ${index === activeIndex ? "active" : ""}`}
                >
                  <img
                    src={photo.foto}
                    className="d-block w-100 rounded"
                    alt={`Foto ${index + 1}`}
                    style={{ maxHeight: "520px", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

            {/* Controles opcionales */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#catCarousel-${cat.id}`}
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#catCarousel-${cat.id}`}
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>

          {/* MINIATURAS */}
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
            {cat.photos.map((photo, index) => (
              <div key={photo.id} className="position-relative">
                <img
                  src={photo.foto}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded border ${activeIndex === index ? "border-primary" : "border-secondary"
                    }`}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  alt={`Miniatura ${index + 1}`}
                />
                {currentUserId === cat.user_id && (
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{
                      transform: "translate(50%, -50%)",
                      padding: "4px 6px",
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>


          {/* Subir nuevas fotos */}
          {currentUserId === cat.user_id && (
            <div className="mt-4">
              <UploadCatProfilePicture
                catId={cat.id}
                onUploadSuccess={(photo) => {
                  setCat((prev) => ({
                    ...prev,
                    photos: [...prev.photos, photo],
                  }));
                }}
              />
            </div>
          )}
        </div>

        {/* Datos del gato */}
        <div className="col-lg-5 mt-4 mt-lg-0">
          <div className="p-4 bg-light rounded shadow">
            <h2 className="fw-bold text-capitalize text-center mb-4">{cat.name}</h2>
            <ul className="list-group list-group-flush fs-5">
              <li className="list-group-item"><strong>Edad:</strong> {cat.age} años</li>
              <li className="list-group-item"><strong>Raza:</strong> {cat.breed}</li>
              <li className="list-group-item"><strong>Peso:</strong> {cat.weight} kg</li>
              <li className="list-group-item"><strong>Color:</strong> {cat.color}</li>
              <li className="list-group-item"><strong>Sexo:</strong> {cat.sex === "male" ? "Macho" : "Hembra"}</li>
              {cat.description && (
                <li className="list-group-item"><strong>Descripción:</strong><br />{cat.description}</li>
              )}
            </ul>

            {currentUserId !== cat.user_id && (
              <div className="text-center mt-4">
                <button className="btn btn-success btn-lg" onClick={handleContact}>
                  Contactar para adoptar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactModal
        show={showModal}
        person={ownerInfo}
        title="Datos del dueño"
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default CatProfilePage;
