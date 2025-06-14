import React, { useState } from "react";

const UploadCatProfilePicture = ({ catId, onUploadSuccess }) => {
  const [photoFile, setPhotoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

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
        setMessage("Foto subida correctamente.");
        setMessageType("success");
        onUploadSuccess(data.photo);
      } else {
        setMessage("Error al subir la foto: " + data.msg);
        setMessageType("danger");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Error de red al subir la foto");
      setMessageType("danger");
    }
  };

  return (
    <div className="mt-3">
      <h6>Subir nueva foto</h6>
      <input type="file" onChange={handleChange} className="form-control mb-2" />
      <button onClick={handleUpload} className="btn btn-sm btn-success">
        Subir Foto
      </button>

      {message && (
        <div className={`alert alert-${messageType} mt-3 text-center`} role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default UploadCatProfilePicture;