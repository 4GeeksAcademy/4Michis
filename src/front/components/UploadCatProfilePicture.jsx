import React, { useState } from "react";

const UploadCatProfilePicture = ({ catId, onUploadSuccess }) => {
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!photoFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("CAT_PROFILE", photoFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/profilepicture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Foto subida correctamente.");
        onUploadSuccess(data.photo); // notificar al padre
      } else {
        alert("Error al subir la foto: " + data.msg);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de red al subir la foto");
    }
  };

  return (
    <div className="mt-4 p-3 border rounded bg-light">
      <h6 className="mb-2">📸 Añadir nueva foto</h6>
      <div className="input-group">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="form-control"
        />
        <button
          onClick={handleUpload}
          className="btn btn-success"
          disabled={!photoFile}
        >
          Subir
        </button>
      </div>
    </div>
  );
};

export default UploadCatProfilePicture;