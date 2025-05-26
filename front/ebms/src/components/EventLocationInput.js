

// import React, { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for Leaflet default marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//     iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// function EventLocationInput({ onSelect }) {
//     const mapRef = useRef(null);
//     const markerRef = useRef(null);
//     const [location, setLocation] = useState(null);

//     // Initialize the map
//     useEffect(() => {
//         if (!mapRef.current) {
//             mapRef.current = L.map('map').setView([9.03, 38.74], 13); // Default to Addis Ababa

//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//             }).addTo(mapRef.current);

//             // Handle map click
//             mapRef.current.on('click', async (e) => {
//                 const { lat, lng } = e.latlng;

//                 // Remove existing marker
//                 if (markerRef.current) {
//                     mapRef.current.removeLayer(markerRef.current);
//                 }

//                 // Add new marker
//                 markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

//                 // Reverse geocode to get location name
//                 try {
//                     const response = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
//                     );
//                     const data = await response.json();
//                     const locationName = data.display_name || 'Unknown location';

//                     const newLocation = {
//                         type: 'Point',
//                         coordinates: [lng, lat], // [longitude, latitude]
//                         name: locationName,
//                     };

//                     setLocation(newLocation);
//                     onSelect(newLocation); // Pass location to parent
//                 } catch (error) {
//                     console.error('Error fetching location name:', error);
//                     const newLocation = {
//                         type: 'Point',
//                         coordinates: [lng, lat],
//                         name: 'Unknown location',
//                     };
//                     setLocation(newLocation);
//                     onSelect(newLocation);
//                 }
//             });
//         }

//         // Cleanup on unmount
//         return () => {
//             if (mapRef.current) {
//                 mapRef.current.remove();
//                 mapRef.current = null;
//             }
//         };
//     }, [onSelect]);

//     return (
//         <div>
//             <div id="map" style={{ height: '400px', width: '100%', borderRadius: '8px', marginBottom: '10px' }} />
//             {location && (
//                 <div className="mt-2 text-sm text-gray-700">
//                     <p><strong>Selected Location:</strong> {location.name}</p>
//                     <p><strong>Coordinates:</strong> [{location.coordinates[1]}, {location.coordinates[0]}]</p>
//                 </div>
//             )}
//         </div>
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
    const mapContainerRef = useRef(null); // Ref for the map container DOM element
    const markerRef = useRef(null);
    const [location, setLocation] = useState(null);

    // Initialize the map
    useEffect(() => {
        // Only initialize the map if the container exists and map hasn't been initialized
        if (mapContainerRef.current && !mapRef.current) {
            try {
                mapRef.current = L.map(mapContainerRef.current, {
                    center: [8.5, 38.5], // Ethiopia's approximate geographic center
                    zoom: 6, // Zoom level to show most of Ethiopia
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        }

        // Cleanup on unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.off(); // Remove all event listeners
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [onSelect]);

    return (
        <div>
            <div
                ref={mapContainerRef} // Attach ref to the map container
                id="map"
                style={{
                    height: '400px',
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    zIndex: '10', // Set z-index lower than header (z-50)
                }}
            />
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