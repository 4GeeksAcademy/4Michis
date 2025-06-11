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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/cats/${cat.id}`, {
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
    <div className="card mt-2 p-3">
      <h5>Editar gato: {cat.name}</h5>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="name" value={formData.name} onChange={handleChange} />
        <input className="form-control mb-2" name="breed" value={formData.breed} onChange={handleChange} />
        <input className="form-control mb-2" name="age" value={formData.age} onChange={handleChange} />
        <input className="form-control mb-2" name="weight" value={formData.weight} onChange={handleChange} />
        <textarea className="form-control mb-2" name="description" value={formData.description} onChange={handleChange} />
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="btn btn-success" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarGato;