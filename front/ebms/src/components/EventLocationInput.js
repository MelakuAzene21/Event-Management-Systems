
// import React, { useState } from 'react';
// import Autocomplete from 'react-autocomplete';

// const places = [
//     'Addis Ababa',
//     'Dire Dawa',
//     'Gondar',
//     'Bahir Dar',
//     'Mekele',
//     'Adama',
//     'Harar',
//     'Dessie',
//     'Kombolcha',
//     'Wollo',
//     'Nazret',
//     'Shewa',
//     'Adigrat',
//     'Adwa',
//     'Shire',
//     'Semera',
//     'Jimma',
//     'Bishoftu',
//     'Hawassa',
//     'Fiche',
//     'Asella',
//     'Kibre Mengist',
//     'Weldiya',
//     'Kutaber',
//     'Aksum',
//     'Sodo',
//     'Bure',
//     'Negele Boran',
//     'Goba',
//     'Bule Hora',
//     'Shashamene',
//     'Wolaita Sodo',
//     'Lalibela',
//     'Dilla',
//     'Bedele',
//     'Mizan Teferi',
//     'Gambela',
//     'Kochi',
//     'Buna',
//     'Debre Zeyit',
//     'Kembata',
//     'Sidama',
//     'Hadiya',
//     'Gamo',
//     'Jijiga',
//     'Shenkora',
//     'Mendi',
//     'Kefa',
//     'Tigray',
//     'Alamata',
//     'Dawro',
//     'Gode',
//     'Jinka',
//     'Dembidolo',
//     'Bale',
//     'Assosa',
//     'Gorobela',
//     'Alge',
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
//             place.toLowerCase().includes(searchValue.toLowerCase())
//         );
//         setFilteredPlaces(filtered);
//     };

//     return (
//         <Autocomplete
//             getItemValue={(item) => item} // The value is just the name itself
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
//                     key={item}
//                     style={{
//                         background: isHighlighted ? 'lightgray' : 'white',
//                         padding: '5px',
//                     }}
//                 >
//                     {item} {/* Render the name only */}
//                 </div>
//             )}
//             value={value}
//             onChange={handleInputChange}
//             onSelect={(val) => {
//                 setValue(val);
//                 onSelect(val); // Pass only the name to the parent component
//             }}
//         />
//     );
// }

// export default EventLocationInput;



import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function EventLocationInput({ onSelect }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [location, setLocation] = useState(null);

    // Initialize the map
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([9.03, 38.74], 13); // Default to Addis Ababa

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            // Handle map click
            mapRef.current.on('click', async (e) => {
                const { lat, lng } = e.latlng;

                // Remove existing marker
                if (markerRef.current) {
                    mapRef.current.removeLayer(markerRef.current);
                }

                // Add new marker
                markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

                // Reverse geocode to get location name
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
                    );
                    const data = await response.json();
                    const locationName = data.display_name || 'Unknown location';

                    const newLocation = {
                        type: 'Point',
                        coordinates: [lng, lat], // [longitude, latitude]
                        name: locationName,
                    };

                    setLocation(newLocation);
                    onSelect(newLocation); // Pass location to parent
                } catch (error) {
                    console.error('Error fetching location name:', error);
                    const newLocation = {
                        type: 'Point',
                        coordinates: [lng, lat],
                        name: 'Unknown location',
                    };
                    setLocation(newLocation);
                    onSelect(newLocation);
                }
            });
        }

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onSelect]);

    return (
        <div>
            <div id="map" style={{ height: '400px', width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
            {location && (
                <div className="mt-2 text-sm text-gray-700">
                    <p><strong>Selected Location:</strong> {location.name}</p>
                    <p><strong>Coordinates:</strong> [{location.coordinates[1]}, {location.coordinates[0]}]</p>
                </div>
            )}
        </div>
    );
}

export default EventLocationInput;