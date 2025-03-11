import React, { useState } from 'react';
import Autocomplete from 'react-autocomplete';

// Example list of Ethiopian cities
const places = [
    { name: 'Addis Ababa' },
    { name: 'Dire Dawa' },
    { name: 'Gondar' },
    { name: 'Bahir Dar' },
    { name: 'Mekele' },
    { name: 'Adama' },
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
            place.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredPlaces(filtered);
    };

    return (
        <Autocomplete
            getItemValue={(item) => item.name}
            items={filteredPlaces}
            renderItem={(item, isHighlighted) => (
                <div
                    key={item.name}
                    style={{ background: isHighlighted ? 'lightgray' : 'white', padding: '5px' }}
                >
                    {item.name}
                </div>
            )}
            value={value}
            onChange={handleInputChange}
            onSelect={(val) => {
                setValue(val);
                onSelect(val); // Pass the selected value back to the parent component
            }}
        />
    );
}

export default EventLocationInput;
