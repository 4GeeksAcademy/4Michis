import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AgregarGato = () => {
  const { dispatch } = useGlobalReducer();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    weight: "",
    age: "",
    color: "",
    sex: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(""); // ✅ para mostrar mensaje

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Error al crear el gato: " + errorText);
      }

      const newCat = await response.json();
      const catId = newCat.id;

      if (selectedFile) {
        const photoForm = new FormData();
        photoForm.append("CAT_PROFILE", selectedFile);

        const uploadResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/profilepicture`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: photoForm,
        });

        if (!uploadResponse.ok) {
          const errText = await uploadResponse.text();
          throw new Error("Error al subir la foto: " + errText);
        }
      }

      // Obtener gato con la foto
      const updatedCatResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedCat = await updatedCatResponse.json();
      dispatch({ type: "add_cat", payload: updatedCat });

      setSubmitStatus("Gato y foto agregados correctamente."); // ✅ mensaje

      setFormData({
        name: "",
        breed: "",
        weight: "",
        age: "",
        color: "",
        sex: "",
        description: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error en el proceso:", error);
      setSubmitStatus("Error: " + error.message); // ✅ mensaje de error
    }
  };

  return (
    <div className="register-container d-flex flex-column justify-content-center align-items-center">
      <div className="register-form col-8 p-8 mt-5 mb-5">
        <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
          <h2 className="text-center">Agregar Gato</h2>
          <hr />

          <label className="form-label">Nombre</label>
          <input type="text" className="form-control mb-2" name="name" value={formData.name} onChange={handleChange} />

          <label className="form-label">Raza</label>
          <input type="text" className="form-control mb-2" name="breed" value={formData.breed} onChange={handleChange} />

          <label className="form-label">Peso</label>
          <input type="text" className="form-control mb-2" name="weight" value={formData.weight} onChange={handleChange} />

          <label className="form-label">Edad</label>
          <input type="text" className="form-control mb-2" name="age" value={formData.age} onChange={handleChange} />

          <label className="form-label">Color</label>
          <input type="text" className="form-control mb-2" name="color" value={formData.color} onChange={handleChange} />

          <label className="form-label">Sexo</label>
          <input type="text" className="form-control mb-2" name="sex" value={formData.sex} onChange={handleChange} />

          <label className="form-label">Información adicional</label>
          <input type="text" className="form-control mb-2" name="description" value={formData.description} onChange={handleChange} />

          <label className="form-label">Foto de Perfil</label>
          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            accept="image/*"
          />

          <div className="d-grid gap-2 justify-content-end">
            <button className="btn btn-primary mt-3" type="submit">
              Agregar gato
            </button>
          </div>
        </form>

        {/* ✅ Mensaje debajo del formulario */}
        {submitStatus && (
          <div className="mt-3 alert alert-info text-center">{submitStatus}</div>
        )}
      </div>
    </div>
  );
};