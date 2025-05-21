import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaFolderOpen,
  FaStar,
  FaPlus,
  FaMoneyBillWave,
  FaTimes,
} from "react-icons/fa"; // Import FaTimes for the X icon
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ closeSidebar }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSidebar]);

  const handlePortfolioClick = () => {
    setPortfolioVisible(!portfolioVisible);
  };

  const handleUploadPortfolio = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.click();
  };

  const handleCvClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.click();
  };

  const reviews = [
    { id: 1, rating: 5, comment: "Great service!" },
    { id: 2, rating: 4, comment: "Very professional." },
    { id: 3, rating: 3, comment: "Could be better." },
    { id: 4, rating: 5, comment: "Excellent work!" },
    { id: 5, rating: 4, comment: "Highly recommended." },
  ];

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <AnimatePresence>
      <motion.div
        ref={sidebarRef}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-50" // Solid white background
      >
        {/* Close Button (X icon) */}
        <button
          onClick={closeSidebar} // Close the sidebar when clicked
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <FaTimes className="text-xl" />
        </button>

        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <button
                onClick={handlePortfolioClick}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <FaFolderOpen className="text-gray-500" />
                <span>Portfolio</span>
              </button>
              {portfolioVisible && (
                <div className="mt-2 p-4 bg-gray-100 rounded-lg relative">
                  <p className="text-gray-600">
                    Previously uploaded portfolios will appear here.
                  </p>
                  <button
                    onClick={handleUploadPortfolio}
                    className="absolute top-2 right-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
                  >
                    <FaPlus />
                  </button>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <FaStar className="text-gray-500" />
                <div className="flex items-center justify-between w-full">
                  <span>Rating and Review</span>
                  <span className="text-sm text-gray-500">
                    {averageRating.toFixed(1)}/5
                  </span>
                </div>
              </button>
              {showReviews && (
                <div className="mt-2 pl-4">
                  <ul className="space-y-2">
                    {reviews.map((review) => (
                      <li key={review.id} className="text-sm text-gray-600">
                        <span className="font-medium">{review.rating}/5:</span>{" "}
                        {review.comment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={handleCvClick}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <FaPlus className="text-gray-500" />
                <span>Upload CV</span>
              </button>
            </li>
            <li>
              <Link
                to="/payment-history"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                <FaMoneyBillWave className="text-gray-500" />
                <span>Payment History</span>
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
