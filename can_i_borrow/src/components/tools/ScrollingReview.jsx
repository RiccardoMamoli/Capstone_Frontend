import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const ScrollingReview = () => {
  const reviews = [
    { title: "La mia app preferita in assoluto!", author: "Simone" },
    { title: "Geniale! La consiglio a tutti!", author: "Riccardo" },
    { title: "Come ho fatto senza fino ad ora?", author: "Mattia" },
  ];

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="scrolling-words-container">
      <div className="scrolling-words-box">
        <motion.div
          key={currentReviewIndex} 
          className="review-item"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -50, 
          }}
          transition={{
            duration: 1, 
            ease: "easeInOut",
          }}
        >
          <p style={{color: "var(--white", fontSize: "23px"}}>{reviews[currentReviewIndex].title}</p>
          <span style={{color: "var(--white)", fontWeight: "300"}}>- {reviews[currentReviewIndex].author}</span>
        </motion.div>
      </div>
    </div>
  );
};


export default ScrollingReview;
