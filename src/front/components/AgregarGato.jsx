import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Spinner } from "./spiner/Spinner";
import { useNavigate } from "react-router-dom";

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

  const [isLoading, setIsLoading] = useState("");

  const navigate = useNavigate();
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
    setIsLoading(true);

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
      navigate('/')
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
      setSubmitStatus("Error: al cargar el michi " + error.message); // ✅ mensaje de error
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      {isLoading && <Spinner />}
      <div className="p-4 rounded bg-light shadow" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center fw-bold mb-4 display-6">Agregar Gato</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre:</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Raza:</label>
            <input type="text" className="form-control" name="breed" value={formData.breed} onChange={handleChange} />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Peso:</label>
              <input type="number" className="form-control" name="weight" value={formData.weight} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Edad:</label>
              <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Color:</label>
            <input type="text" className="form-control" name="color" value={formData.color} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Sexo:</label>
            <select className="form-select" name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Seleccionar sexo</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Información adicional:</label>
            <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label">Foto de Perfil:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <div className="text-center">
            <button className="btn button-4michis chewy-font ms-2" type="submit">
              Agregar gato
            </button>
          </div>
        </form>

        {submitStatus && (
          <div className="alert alert-info mt-3 text-center">
            {submitStatus}
          </div>
        )}
      </div>
    </div>
  );
};