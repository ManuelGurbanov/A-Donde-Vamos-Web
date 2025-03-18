import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BackButton() {
    const [showButton, setShowButton] = useState(false);
    let touchStartX = 0;
    let touchEndX = 0;

    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const handleTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            const swipeDistance = touchEndX - touchStartX;
            if (swipeDistance > 100) { // Detecta un swipe rápido a la derecha
                setShowButton(true);
                setTimeout(() => setShowButton(false), 3000); // Oculta el botón después de 3 segundos
            }
        };

        const handleTap = (e) => {
            if (e.clientX < window.innerWidth * 0.15) { // Toca en el 15% izquierdo de la pantalla
                setShowButton(true);
                setTimeout(() => setShowButton(false), 3000);
            }
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("click", handleTap);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("click", handleTap);
        };
    }, []);

    return (
        <Link 
            to={"/home"}
            className={`fixed left-2 top-1/2 transform -translate-y-1/2 z-50 transition-opacity duration-300 ${
                showButton ? "opacity-100" : "opacity-0"
            }`}
        >
            <div className="flex items-center justify-center w-12 h-12 bg-c text-white font-bold text-lg rounded-full shadow-lg">
                <svg width="20px" height="20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#DB9F68">
                    <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"></path>
                </svg>
            </div>
        </Link>
    );
}
