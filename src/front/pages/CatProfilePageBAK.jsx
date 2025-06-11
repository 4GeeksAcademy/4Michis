import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CatInfoBox from "../components/CatInfoBox";
import CatPhoto from "../components/CatPhoto";
import ContactModal from "../components/ContactModal";
import UploadCatProfilePicture from "../components/UploadCatProfilePicture";

const CatProfilePage = () => {
  const { catId } = useParams();
  const [cat, setCat] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);


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

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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



  if (!cat) return <div className="text-center py-5">Cargando michi...</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          {/* Foto de perfil y nombre */}
          <div className="text-center mb-4">
            {cat.photos.length > 0 ? (
              <img
                src={cat.photos[cat.photos.length - 1].foto}
                alt={`Foto de ${cat.name}`}
                className="rounded-circle"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/120?text=Michi"
                alt="Sin foto"
                className="rounded-circle"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            )}
            <h2 className="mt-3 text-uppercase fw-bold">{cat.name}</h2>
          </div>
        </div>
      </div>

      {/* Info del gato y fotos */}
      <div className="row">
        <div className="col-md-9">
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

          <div className="mt-3 d-flex gap-2">
            {currentUserId !== cat.user_id && (
              <button className="btn btn-primary" onClick={handleContact}>
                Contactar
              </button>
            )}
          </div>

          {/* Formulario para subir foto si eres el dueño */}
          {currentUserId === cat.user_id && (
            <UploadCatProfilePicture
              catId={cat.id}
              onUploadSuccess={(photo) => {
                setCat(prev => ({
                  ...prev,
                  photos: [...prev.photos,photo]
                }));
              }}
            />
          )}
        </div>

        {/* Galería lateral */}
        <div className="col-md-3 d-flex flex-column gap-3">
          {cat.photos.map((photo, index) => (
            <CatPhoto key={index} photoUrl={photo.foto} />
          ))}
        </div>
      </div>

      {/* Modal contacto */}
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