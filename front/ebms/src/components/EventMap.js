import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MdLocationPin } from "react-icons/md";

const EventMap = ({ latitude, longitude }) => {
    return (
        <div className="w-full h-96 rounded-lg overflow-hidden z-10 relative">
            <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                className="w-full h-full"
                style={{ zIndex: 10 }} // Map has a z-index of 10
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>Event Location</Popup>
                </Marker>
            </MapContainer>

            {/* Get Directions Button */}
            <button
                className="absolute bottom-1 right-1 bg-white text-gray-700 font-medium py-2 px-4 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-100 transition z-20"
                onClick={() => {
                    // Open Google Maps with the event location
                    window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
                        '_blank'
                    );
                }}
            >
                                   <MdLocationPin className="w-6 h-6 text-gray-600" />
               
                Get Directions
            </button>
        </div>
    );
};

export default EventMap;