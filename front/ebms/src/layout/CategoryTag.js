// components/CategoryTags.jsx
import React from "react";
import { FaMusic, FaCocktail, FaTheaterMasks, FaCalendarAlt, FaHeart, FaGamepad, FaBriefcase, FaPizzaSlice } from "react-icons/fa"; // Icons for categories

const CategoryTags = ({ categories, selectedCategory, onCategorySelect }) => {
    // Map category names to their respective icons
    const categoryIcons = {
        music: <FaMusic className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        nightlife: <FaCocktail className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        "performing & visual arts": <FaTheaterMasks className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        holidays: <FaCalendarAlt className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        dating: <FaHeart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        hobbies: <FaGamepad className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        business: <FaBriefcase className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
        "food & drink": <FaPizzaSlice className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />,
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Categories</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategorySelect(category)}
                        className={`group flex flex-col items-center p-4 rounded-lg transition-all duration-200 min-w-[120px] ${selectedCategory === category
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md"
                            }`}
                    >
                        <div
                            className={`mb-2 p-3 rounded-full ${selectedCategory === category ? "bg-blue-700" : "bg-gray-100 group-hover:bg-blue-100"
                                }`}
                        >
                            {categoryIcons[category.toLowerCase()] || (
                                <FaMusic className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                            )}
                        </div>
                        <span className="text-sm font-medium capitalize">{category}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTags;