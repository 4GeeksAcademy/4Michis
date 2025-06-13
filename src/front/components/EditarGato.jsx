import React, { useState } from "react";

const EditarGato = ({ cat, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...cat });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${cat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar el gato");

      const updatedCat = await response.json();
      onSave(updatedCat);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el gato");
    }
  };

   return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="col-12 col-md-8 col-lg-6 bg-body-tertiary p-4 rounded shadow">
        <h2 className="text-center fw-bold mb-4 display-6">Editar Gato</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del gato:</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Raza:</label>
            <input type="text" className="form-control" name="breed" value={formData.breed} onChange={handleChange} />
          </div>

          <div className="row">
            <div className="col mb-3">
              <label className="form-label">Edad:</label>
              <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="col mb-3">
              <label className="form-label">Peso:</label>
              <input type="number" className="form-control" name="weight" value={formData.weight} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Color:</label>
            <input type="text" className="form-control" name="color" value={formData.color} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Sexo:</label>
            <select className="form-select" name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Seleccionar</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Descripción:</label>
            <textarea className="form-control" rows="3" name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button type="submit" className="btn btn-success px-4">Guardar</button>
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarGato;