// import React, { useState } from 'react';
// import Autocomplete from 'react-autocomplete';

// const places = [
//     { name: 'Addis Ababa' },
//     { name: 'Dire Dawa' },
//     { name: 'Gondar' },
//     { name: 'Bahir Dar' },
//     { name: 'Mekele' },
//     { name: 'Adama' },
//     { name: 'Harar' },
//     { name: 'Dessie' },
//     { name: 'Kombolcha' },
//     { name: 'Wollo' },
//     { name: 'Nazret' },
//     { name: 'Shewa' },
//     { name: 'Adigrat' },
//     { name: 'Adwa' },
//     { name: 'Shire' },
//     { name: 'Semera' },
//     { name: 'Jimma' },
//     { name: 'Bishoftu' },
//     { name: 'Hawassa' },
//     { name: 'Fiche' },
//     { name: 'Asella' },
//     { name: 'Kibre Mengist' },
//     { name: 'Weldiya' },
//     { name: 'Kutaber' },
//     { name: 'Aksum' },
//     { name: 'Sodo' },
//     { name: 'Bure' },
//     { name: 'Negele Boran' },
//     { name: 'Goba' },
//     { name: 'Bule Hora' },
//     { name: 'Shashamene' },
//     { name: 'Wolaita Sodo' },
//     { name: 'Lalibela' },
//     { name: 'Dilla' },
//     { name: 'Bedele' },
//     { name: 'Mizan Teferi' },
//     { name: 'Gambela' },
//     { name: 'Kochi' },
//     { name: 'Buna' },
//     { name: 'Debre Zeyit' },
//     { name: 'Kembata' },
//     { name: 'Sidama' },
//     { name: 'Hadiya' },
//     { name: 'Gamo' },
//     { name: 'Jijiga' },
//     { name: 'Shenkora' },
//     { name: 'Mendi' },
//     { name: 'Kefa' },
//     { name: 'Tigray' },
//     { name: 'Alamata' },
//     { name: 'Dawro' },
//     { name: 'Gode' },
//     { name: 'Jinka' },
//     { name: 'Dembidolo' },
//     { name: 'Bale' },
//     { name: 'Assosa' },
//     { name: 'Gorobela' },
//     { name: 'Alge' },
//     // Add more Ethiopian cities...
// ];


// function EventLocationInput({ onSelect }) {
//     const [value, setValue] = useState('');
//     const [filteredPlaces, setFilteredPlaces] = useState(places);

//     // Handle input change and filter locations
//     const handleInputChange = (e) => {
//         const searchValue = e.target.value;
//         setValue(searchValue);

//         // Filter locations based on input
//         const filtered = places.filter((place) =>
//             place.name.toLowerCase().includes(searchValue.toLowerCase())
//         );
//         setFilteredPlaces(filtered);
//     };

//     return (
//         <Autocomplete
//             getItemValue={(item) => item.name}
//             items={filteredPlaces}
//             renderInput={(props) => (
//                 <input
//                     {...props}
//                     className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                     type="text"
//                     placeholder="Search for a location"
//                 />
//             )}
//             renderItem={(item, isHighlighted) => (
//                 <div
//                     key={item.name}
//                     style={{
//                         background: isHighlighted ? 'lightgray' : 'white',
//                         padding: '5px',
//                     }}
//                 >
//                     {item.name}
//                 </div>
//             )}
//             value={value}
//             onChange={handleInputChange}
//             onSelect={(val) => {
//                 setValue(val);
//                 onSelect(val); // Pass the selected value back to the parent component
//             }}
//         />
//     );
// }

// export default EventLocationInput;


import React, { useState } from 'react';
import Autocomplete from 'react-autocomplete';

const places = [
    'Addis Ababa',
    'Dire Dawa',
    'Gondar',
    'Bahir Dar',
    'Mekele',
    'Adama',
    'Harar',
    'Dessie',
    'Kombolcha',
    'Wollo',
    'Nazret',
    'Shewa',
    'Adigrat',
    'Adwa',
    'Shire',
    'Semera',
    'Jimma',
    'Bishoftu',
    'Hawassa',
    'Fiche',
    'Asella',
    'Kibre Mengist',
    'Weldiya',
    'Kutaber',
    'Aksum',
    'Sodo',
    'Bure',
    'Negele Boran',
    'Goba',
    'Bule Hora',
    'Shashamene',
    'Wolaita Sodo',
    'Lalibela',
    'Dilla',
    'Bedele',
    'Mizan Teferi',
    'Gambela',
    'Kochi',
    'Buna',
    'Debre Zeyit',
    'Kembata',
    'Sidama',
    'Hadiya',
    'Gamo',
    'Jijiga',
    'Shenkora',
    'Mendi',
    'Kefa',
    'Tigray',
    'Alamata',
    'Dawro',
    'Gode',
    'Jinka',
    'Dembidolo',
    'Bale',
    'Assosa',
    'Gorobela',
    'Alge',
    // Add more Ethiopian cities...
];

function EventLocationInput({ onSelect }) {
    const [value, setValue] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState(places);

    // Handle input change and filter locations
    const handleInputChange = (e) => {
        const searchValue = e.target.value;
        setValue(searchValue);

        // Filter locations based on input
        const filtered = places.filter((place) =>
            place.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredPlaces(filtered);
    };

    return (
        <Autocomplete
            getItemValue={(item) => item} // The value is just the name itself
            items={filteredPlaces}
            renderInput={(props) => (
                <input
                    {...props}
                    className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    placeholder="Search for a location"
                />
            )}
            renderItem={(item, isHighlighted) => (
                <div
                    key={item}
                    style={{
                        background: isHighlighted ? 'lightgray' : 'white',
                        padding: '5px',
                    }}
                >
                    {item} {/* Render the name only */}
                </div>
            )}
            value={value}
            onChange={handleInputChange}
            onSelect={(val) => {
                setValue(val);
                onSelect(val); // Pass only the name to the parent component
            }}
        />
    );
}

export default EventLocationInput;
