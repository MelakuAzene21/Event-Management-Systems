// import React from 'react';
// import { FaMusic } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const CategoryTags = ({ categories, selectedCategory, onCategorySelect }) => {
//     const navigate = useNavigate();

//     const handleCategoryClick = (categoryId) => {
//         onCategorySelect(categoryId);
//         navigate(`/categories/${categoryId}/events`);
//     };

//     return (
//         <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Categories</h2>
//             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                 {categories.map((category) => (
//                     <button
//                         key={category.id}
//                         onClick={() => handleCategoryClick(category.id)}
//                         className={`group flex flex-col items-center p-4 rounded-lg transition-all duration-200 min-w-[120px] ${selectedCategory === category.id
//                                 ? 'bg-blue-600 text-white shadow-md'
//                                 : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md'
//                             }`}
//                     >
//                         <div
//                             className={`mb-2 p-3 rounded-full flex items-center justify-center ${selectedCategory === category.id
//                                     ? 'bg-blue-700'
//                                     : 'bg-gray-100 group-hover:bg-blue-100'
//                                 }`}
//                         >
//                             {category.icon?.url ? (
//                                 <img
//                                     src={category.icon.url}
//                                     alt={category.name}
//                                     className="w-8 h-8 object-cover rounded"
//                                 />
//                             ) : (
//                                 <FaMusic className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
//                             )}
//                         </div>
//                         <span className="text-sm font-medium capitalize">{category.name}</span>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default CategoryTags;









// src/components/CategoryTags.jsx
import React, { useCallback } from 'react';
import { FaMusic } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Utility function to format category name
const formatCategoryName = (name) => (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Unknown');

// Styles for maintainability
const styles = {
    container: 'mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8',
    heading: 'text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 text-center',
    scrollArea:
        'flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory',
    button:
        'group flex flex-col items-center p-3 sm:p-4 rounded-lg transition-all duration-200 w-[30vw] sm:w-28 md:w-32 lg:w-36',
    buttonSelected: 'bg-blue-600 text-white shadow-md',
    buttonDefault: 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md',
    iconWrapper:
        'mb-2 p-2 sm:p-3 rounded-full flex items-center justify-center',
    iconWrapperSelected: 'bg-blue-700',
    iconWrapperDefault: 'bg-gray-100 group-hover:bg-blue-100',
    icon: 'w-6 h-6 sm:w-8 sm:h-8 object-cover rounded',
    defaultIcon: 'w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors',
    label: 'text-xs sm:text-sm font-medium capitalize',
};

// Component
const CategoryTags = React.memo(({ categories, selectedCategory, onCategorySelect }) => {
    const navigate = useNavigate();

    const handleCategoryClick = useCallback(
        (categoryId) => {
            onCategorySelect(categoryId);
            navigate(`/categories/${categoryId}/events`);
        },
        [onCategorySelect, navigate]
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Explore Categories</h2>
            <div className={styles.scrollArea} role="tablist" aria-label="Event categories">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`${styles.button} ${selectedCategory === category.id ? styles.buttonSelected : styles.buttonDefault
                            }`}
                        role="tab"
                        aria-selected={selectedCategory === category.id}
                        aria-label={`Select ${formatCategoryName(category.name)} category`}
                    >
                        <div
                            className={`${styles.iconWrapper} ${selectedCategory === category.id ? styles.iconWrapperSelected : styles.iconWrapperDefault
                                }`}
                        >
                            {category.icon?.url ? (
                                <img
                                    src={category.icon.url}
                                    alt={formatCategoryName(category.name)}
                                    className={styles.icon}
                                    loading="lazy"
                                />
                            ) : (
                                <FaMusic className={styles.defaultIcon} aria-hidden="true" />
                            )}
                        </div>
                        <span className={styles.label}>{formatCategoryName(category.name)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});

CategoryTags.displayName = 'CategoryTags';

// PropTypes for type safety
CategoryTags.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            icon: PropTypes.shape({
                url: PropTypes.string,
            }),
        })
    ).isRequired,
    selectedCategory: PropTypes.string,
    onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryTags;