import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CatFoundCard from "./CatFoundCard";
import useGlobalReducer from "../hooks/useGlobalReducer";

const SearchResults = () => {
    const { store, dispatch } = useGlobalReducer();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/search?q=${query}`);
                const data = await res.json();
                dispatch({ type: "set_search_results", payload: data });
            } catch (err) {
                console.error("Error al buscar michis", err);
            }
        };

        if (query) fetchResults();
    }, [query, dispatch]);

    return (
        <div className="container mt-5">
            <h2>Resultados para "{query}"</h2>
            <div className="row">
                {store.searchResults.length === 0 ? (
                    <p>No se encontraron michis.</p>
                ) : (
                    store.searchResults.map(cat => (
                        <div key={cat.id} className="col-md-4 mb-4">
                            <CatFoundCard cat={cat} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchResults;