import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            const { exp } = jwtDecode(token);
            if (Date.now() >= exp * 1000) {
                localStorage.removeItem("token");
                navigate("/");
            }
        } catch (error) {
            localStorage.removeItem("token");
            navigate("/");
        }
    }, []);
    return (
        <div className="d-flex flex-column min-vh-100">
            <ScrollToTop />
            <Navbar />
            <main className="flex-fill">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}