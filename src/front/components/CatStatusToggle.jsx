import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const CatStatusToggle = ({ catId, onStatusChange, size = "sm" }) => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const token = localStorage.getItem("token");

  // Fetch el estado actual del gato
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`);
        if (!response.ok) throw new Error("No se pudo obtener el gato");
        const data = await response.json();
        setIsActive(data.cat.is_active);
      } catch (err) {
        console.error("Error al obtener estado del gato:", err);
      }
    };

    fetchStatus();
  }, [catId]);

  const handleToggle = async () => {
    if (isActive === null) return;
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Error al cambiar el estado del gato");
      }

      const data = await response.json();
      alert(data.msg);
      setIsActive(!isActive);
      if (onStatusChange) onStatusChange(!isActive);
    } catch (error) {
      console.error("Error al cambiar el estado del gato:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isActive === null) return null;

  return (
    <div className="text-center">
      <button
        onClick={handleToggle}
        className={`btn btn-outline-${isActive ? "danger" : "success"} btn-${size}`}
        disabled={loading}
      >
        {loading ? "..." : isActive ? <i className="fas fa-ban"></i> : <i className="fas fa-check"></i>}
      </button>

      {successMsg && (
        <div className="alert alert-info text-center mt-2 p-2">
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default CatStatusToggle;