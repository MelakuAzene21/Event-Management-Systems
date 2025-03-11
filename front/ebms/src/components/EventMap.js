import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const EventMap = ({ latitude, longitude }) => {
    return (
        <div className="w-[500px] h-96 flex justify-end items-end mr-0 z-10">
            <MapContainer
                center={[latitude, longitude]}
                zoom={13}
                className="w-[500px] h-full "
                style={{ marginRight: 0 }} // Ensure no extra margin
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>Event Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default EventMap;
