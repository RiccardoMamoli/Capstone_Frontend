import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoScontortnato from "../../assets/logos/Logo_Orange-Photoroom.png";
import { useNavigate } from "react-router-dom";

const AppLoader = ({ progress, isLoaded, setIsLoaded }) => {
    const [showWord, setShowWord] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => setIsLoaded(true), 300);
        }
    }, [progress]);


    useEffect(() => {
        const hideTimeout = setTimeout(() => {
            setShowWord(false);
        }, 4000); 

        return () => clearTimeout(hideTimeout); 
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const navigateTimeout = setTimeout(() => {
                navigate("/homepage/main");
            }, 500); 

            return () => clearTimeout(navigateTimeout);
        }
    }, [isLoaded, navigate]);

    return (
        <>
            <div style={{ position: "relative" }} className={`loader-container vh-100 ${isLoaded ? "hide-load" : ""}`}>
                <div className="circle-white" />

                <div className="box-logo-borrow">
                    <img src={logoScontortnato} alt="logoOrange" className="logo-borrow" />
                </div>



                <div className="loader-bar-full">
                    <div style={{ width: `${progress}%` }} className="loader-bar-progress" />
                </div>
                <div className="loader-text">
                    <AnimatePresence>
                        {showWord && (
                            <motion.p
                                className="text-light text-center"
                                style={{ fontWeight: "300", fontSize: "16px", width: "200px" }}
                                initial={{ x: -100, opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }}    
                                exit={{ x: 100, opacity: 0 }}      
                                transition={{ duration: 1, ease: "easeOut", delay: 2.1 }} 
                            >
                                Preparati, ci siamo quasi.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

export default AppLoader;
