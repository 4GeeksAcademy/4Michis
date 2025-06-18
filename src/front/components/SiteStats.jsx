import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const statsItems = [
    { key: "users", label: "Usuarios registrados", icon: "fas fa-users" },
    { key: "cats", label: "Michis registrados", icon: "fas fa-cat" },
    { key: "contacts", label: "Contactos entre usuarios", icon: "fas fa-comments" },
    { key: "adoptions", label: "Adopciones realizadas", icon: "fas fa-heart" },
];

const SiteStats = () => {
    const [stats, setStats] = useState({
        users: 0,
        cats: 0,
        contacts: 0,
        adoptions: 0
    });

    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);
    const controls = useAnimation();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stats`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    controls.start("visible");
                    setHasAnimated(true);
                }
            },
            { threshold: 0.4 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasAnimated, controls]);

    const counterVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6 }
        }),
    };

    return (
        <section className="site-stats-section" ref={ref}>
            <div className="container">
                <div className="row text-center">
                    {statsItems.map((item, index) => (
                        <motion.div
                            key={item.key}
                            className="col-md-3 col-6 mb-4"
                            custom={index}
                            initial="hidden"
                            animate={controls}
                            variants={counterVariants}
                        >
                            <div className="site-stats-icon">
                                <i className={`${item.icon}`}></i>
                            </div>
                            <h2 className="site-stats-number counter" data-target={stats[item.key]}>
                                {hasAnimated ? stats[item.key] : 0}
                            </h2>
                            <p className="site-stats-label">{item.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SiteStats;