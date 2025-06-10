import React, { useState } from "react";
import { FaPaw } from "react-icons/fa";
import useGlobalReducer from "../hooks/useGlobalReducer";


const CatStatusToggle = ({ catId, isActive, onStatusChange }) => {
  const { store } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const handleToggle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ "is_active": !isActive })  // ✅ campo correcto y bien formateado
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al cambiar el estado del gato");
      }

      const data = await response.json();
      console.log("Estado actualizado:", data);
      onStatusChange(!isActive); // notificar al componente padre
    } catch (error) {
      console.error("Error al cambiar el estado del gato:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`btn btn-outline-${isActive ? "danger" : "success"}`}
      disabled={loading}
    >
      <FaPaw className={`text-${isActive ? "danger" : "secondary"}`} />
      {loading ? "Cambiando..." : isActive ? "Desactivar" : "Activar"}
    </button>
  );
};

export default CatStatusToggle;