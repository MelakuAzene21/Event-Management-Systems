// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSpinner } from 'react-icons/fa';
// import { useGetCategoriesQuery } from '../features/api/eventApi';

// const ExploreCategories = () => {
//     const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
//     const [itemsPerPage] = useState(8); // Number of categories per page
//     const [currentPage, setCurrentPage] = useState(1); // Track the current page

//     // Calculate the categories to display based on the current page
//     const displayedCategories = categories.slice(0, currentPage * itemsPerPage);
//     const totalPages = Math.ceil(categories.length / itemsPerPage);
//     const canViewMore = currentPage < totalPages;
//     const canViewLess = currentPage > 1;

//     // Handle View More
//     const handleViewMore = () => {
//         if (canViewMore) {
//             setCurrentPage((prevPage) => prevPage + 1);
//         }
//     };

//     // Handle View Less
//     const handleViewLess = () => {
//         if (canViewLess) {
//             setCurrentPage((prevPage) => prevPage - 1);
//         }
//     };

//     if (categoriesLoading) {
//         return (
//             <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
//                 <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto" />
//                 <p className="mt-3 text-lg font-medium text-gray-600">Loading categories...</p>
//             </div>
//         );
//     }

//     if (categoriesError) {
//         return (
//             <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
//                 <p className="text-lg font-medium text-red-500">Failed to load categories: {categoriesError.message}</p>
//             </div>
//         );
//     }

//     // Map category names to specific emojis/icons for fallback
//     const categoryIcons = {
//         business: '📈',
//         nightlife: '🌙',
//         'food & drink': '🍽️',
//         'science & tech': '🔬',
//         music: '🎵',
//         seasonal: '📅',
//         dating: '💬',
//         'film & media': '🎬',
//         'performing & visual arts': '🎭',
//         fashion: '👗',
//         health: '🩺',
//         'sports & fitness': '🏋️',
//     };

//     return (
//         <section className="py-16 bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 text-center">
//                     Explore Other Popular Categories
//                     <div className="mt-3 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
//                 </h2>
//                 {categories.length === 0 ? (
//                     <p className="text-center text-lg text-gray-600">No categories available.</p>
//                 ) : (
//                     <>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                             {displayedCategories.map((category) => (
//                                 <Link
//                                     key={category._id}
//                                     to={`/categories/${category._id}/events`}
//                                     className="group bg-white rounded-2xl shadow-lg p-5 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50"
//                                 >
//                                     {category.icon?.url ? (
//                                         <img
//                                             src={category.icon.url}
//                                             alt={category.name}
//                                             className="w-12 h-12 object-cover rounded-full transition-transform duration-300 group-hover:scale-110 border-2 border-blue-100"
//                                         />
//                                     ) : (
//                                         <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
//                                             <span className="text-2xl text-blue-600">
//                                                 {categoryIcons[category.name.toLowerCase()] || '🎉'}
//                                             </span>
//                                         </div>
//                                     )}
//                                     <span className="text-gray-800 font-semibold capitalize group-hover:text-blue-600 transition-colors text-base md:text-lg">
//                                         {category.name}
//                                     </span>
//                                 </Link>
//                             ))}
//                         </div>
//                         <div className="text-center mt-10 flex justify-center space-x-4">
//                             {canViewMore && (
//                                 <button
//                                     onClick={handleViewMore}
//                                     className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
//                                 >
//                                     View More
//                                 </button>
//                             )}
//                             {canViewLess && (
//                                 <button
//                                     onClick={handleViewLess}
//                                     className="inline-flex items-center bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors text-sm font-medium shadow-md"
//                                 >
//                                     View Less
//                                 </button>
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default ExploreCategories;



// src/components/ExploreCategories.jsx
import React, { useState, useCallback,useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetCategoriesQuery } from '../features/api/eventApi';
import PropTypes from 'prop-types';
// Category icons mapping (outside component for performance)
const categoryIcons = {
    business: '📈',
    nightlife: '🌙',
    'food & drink': '🍽️',
    'science & tech': '🔬',
    music: '🎵',
    seasonal: '📅',
    dating: '💬',
    'film & media': '🎬',
    'performing & visual arts': '🎭',
    fashion: '👗',
    health: '🩺',
    'sports & fitness': '🏋️',
};

// Utility function to format category name
const formatCategoryName = (name) => (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unknown');

// Styles for maintainability
const styles = {
    section: 'py-10 sm:py-12 lg:py-16 bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100',
    container: 'container mx-auto px-4 sm:px-6 lg:px-8',
    heading: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-8 sm:mb-10 text-center',
    underline: 'mt-2 sm:mt-3 h-1 w-20 sm:w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto',
    loading: 'text-center py-10 sm:py-12 bg-gradient-to-r from-blue-50 to-indigo-50',
    spinner: 'animate-spin text-blue-600 text-4xl sm:text-5xl mx-auto',
    loadingText: 'mt-2 sm:mt-3 text-base sm:text-lg font-medium text-gray-600',
    empty: 'text-center text-base sm:text-lg text-gray-600',
    grid: 'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 sm:gap-6',
    card: 'group bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50',
    icon: 'w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full transition-transform duration-300 group-hover:scale-110 border-2 border-blue-100',
    fallbackIcon: 'w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center',
    emoji: 'text-xl sm:text-2xl text-blue-600',
    label: 'text-sm sm:text-base font-semibold capitalize group-hover:text-blue-600 transition-colors',
    buttonContainer: 'text-center mt-8 sm:mt-10 flex justify-center space-x-3 sm:space-x-4',
    viewMoreButton: 'inline-flex items-center bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium shadow-md',
    viewLessButton: 'inline-flex items-center bg-gray-200 text-gray-800 px-4 sm:px-6 py-2 rounded-full hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium shadow-md',
};

// Component
const ExploreCategories = React.memo(() => {
    const { data: categories = [], isLoading, isError, error } = useGetCategoriesQuery();
    const [currentPage, setCurrentPage] = useState(1);

    // Dynamic items per page based on screen size
    const itemsPerPage = useMemo(() => {
        if (window.innerWidth < 640) return 6; // Mobile
        if (window.innerWidth < 768) return 9; // Small tablet
        if (window.innerWidth < 1024) return 12; // Tablet
        return 15; // Desktop
    }, []);

    // Memoized calculations
    const { displayedCategories, totalPages, canViewMore, canViewLess } = useMemo(() => {
        const total = Math.ceil(categories.length / itemsPerPage);
        const displayed = categories.slice(0, currentPage * itemsPerPage);
        return {
            displayedCategories: displayed,
            totalPages: total,
            canViewMore: currentPage < total,
            canViewLess: currentPage > 1,
        };
    }, [categories, currentPage, itemsPerPage]);

    // Handle View More
    const handleViewMore = useCallback(() => {
        if (canViewMore) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [canViewMore]);

    // Handle View Less
    const handleViewLess = useCallback(() => {
        if (canViewLess) {
            setCurrentPage((prev) => prev - 1);
        }
    }, [canViewLess]);

    return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.heading}>
                        Explore Other Popular Categories
                        <div className={styles.underline}></div>
                    </h2>
                    {categories.length === 0 ? (
                        <p className={styles.empty}>No categories available.</p>
                    ) : (
                        <>
                            <div className={styles.grid} role="list" aria-label="Event categories">
                                {displayedCategories.map((category) => (
                                    <Link
                                        key={category._id}
                                        to={`/categories/${category._id}/events`}
                                        className={styles.card}
                                        role="listitem"
                                        aria-label={`Explore ${formatCategoryName(category.name)} events`}
                                    >
                                        {category.icon?.url ? (
                                            <img
                                                src={category.icon.url}
                                                srcSet={`${category.icon.url} 1x, ${category.icon.url.replace('.jpg', '-small.jpg')} 0.5x`}
                                                alt={formatCategoryName(category.name)}
                                                className={styles.icon}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={styles.fallbackIcon}>
                                                <span className={styles.emoji} aria-hidden="true">
                                                    {categoryIcons[category.name.toLowerCase()] || '🎉'}
                                                </span>
                                            </div>
                                        )}
                                        <span className={styles.label}>{formatCategoryName(category.name)}</span>
                                    </Link>
                                ))}
                            </div>
                            {(canViewMore || canViewLess) && (
                                <div className={styles.buttonContainer}>
                                    {canViewMore && (
                                        <button
                                            onClick={handleViewMore}
                                            className={styles.viewMoreButton}
                                            aria-label="View more categories"
                                        >
                                            View More
                                        </button>
                                    )}
                                    {canViewLess && (
                                        <button
                                            onClick={handleViewLess}
                                            className={styles.viewLessButton}
                                            aria-label="View fewer categories"
                                        >
                                            View Less
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        
    );
});

ExploreCategories.displayName = 'ExploreCategories';

// PropTypes for type safety
ExploreCategories.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            icon: PropTypes.shape({
                url: PropTypes.string,
            }),
        })
    ),
};

export default ExploreCategories;