import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCatForm = () => {
  const { catId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(""); // ✅ Nuevo estado
  const [formData, setFormData] = useState({
    cat_name: "",
    breed: "",
    age: "",
    weight: "",
    description: "",
    color: "",
    sex: "",
  });

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener los datos del gato");

        const data = await res.json();
        const cat = data.cat || data;

        setFormData({
          cat_name: cat.name || "",
          breed: cat.breed || "",
          age: cat.age?.toString() || "",
          weight: cat.weight?.toString() || "",
          description: cat.description || "",
          color: cat.color || "",
          sex: cat.sex || "",
        });
      } catch (err) {
        console.error(err);
        setSubmitStatus("Error al cargar el gato."); // ❌ Reemplaza alert
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [catId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.cat_name,
      breed: formData.breed,
      age: Number(formData.age) || 0,
      weight: Number(formData.weight) || 0,
      description: formData.description,
      color: formData.color,
      sex: formData.sex,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Error al actualizar el gato");
      }

      setSubmitStatus("Gato actualizado con éxito.");

      setTimeout(() => {
        navigate("/private?section=my-cats");
      }, 2000);
    } catch (err) {
      console.error(err);
      setSubmitStatus("Error: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="p-4 rounded bg-light shadow" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center fw-bold mb-4 display-6">Editar Gato</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del gato:</label>
            <input
              type="text"
              className="form-control"
              name="cat_name"
              value={formData.cat_name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Raza:</label>
            <input
              type="text"
              className="form-control"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Edad (años):</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Peso (kg):</label>
              <input
                type="number"
                className="form-control"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción:</label>
            <textarea
              className="form-control"
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Color:</label>
            <input
              type="text"
              className="form-control"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Sexo:</label>
            <select
              className="form-select"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Seleccionar sexo</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
          </div>

          <div className="text-center">
            <button type="submit" className="btn button-4michis chewy-font ms-2">
              Guardar
            </button>
            <button
              type="button"
              className="btn button-cancel-4michis chewy-font ms-2 px-4"
              onClick={() => navigate("/private?section=my-cats")}
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* ✅ Mensaje de estado */}
        {submitStatus && (
          <div className="alert alert-info mt-3 text-center">
            {submitStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCatForm;