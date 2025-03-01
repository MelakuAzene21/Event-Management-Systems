import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Title from "../layout/Title";

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const qrCodeRefs = useRef({});

    const BASE_URL = "http://localhost:5000"; // Change to your backend URL

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/tickets/user`, { withCredentials: true });
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                if (error.response && error.response.status === 404) {
                    setError("You have not purchased any tickets yet. Please explore events and get your tickets!");
                } else {
                    setError("Failed to load tickets. Please try again later.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const downloadQRCode = (ticketNumber) => {
        const canvas = qrCodeRefs.current[ticketNumber];
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `ticket_${ticketNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-6">
            <Title title={"Ticket Page"}/>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 max-w-5xl w-full"
            >
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Your Tickets</h1>
                {isLoading ? (
                    <p className="text-center text-gray-500 text-lg">Loading tickets...</p>
                ) : error ? (
                    <div className="text-center">
                        <p className="text-gray-500">{error}</p>
                        <Link to="/" className="text-blue-600 font-semibold underline">
                            Browse Events & Get Tickets
                        </Link>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-500">You have no purchased tickets.</p>
                        <Link to="/" className="text-blue-600 font-semibold underline">
                            Explore Events & Buy Tickets
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-200"
                            >
                                <h2 className="text-xl font-semibold text-blue-600 mb-4">Ticket Details</h2>
                                <p className="text-gray-600">Event Name: <span className="font-bold">{ticket.event?.title}</span></p>

                                <p className="text-gray-600">Amount Paid: <span className="font-bold">{ticket.booking?.totalAmount}ETB</span></p>
                                <p className="text-gray-600">Ticket Type: <span className="font-bold">{ticket.booking?.ticketType}</span></p>

                                <p className="text-gray-600 mb-4 italic">
                                    Ticket ID: <span className="font-bold">{ticket.ticketNumber}</span>
                                </p>

                                <QRCodeCanvas
                                    value={ticket.qrCode}
                                    size={200}
                                    className="shadow-lg border border-gray-300 p-2 rounded-lg"
                                    ref={(el) => (qrCodeRefs.current[ticket.ticketNumber] = el)}
                                />
                                <button
                                    className="mt-4 px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                                    onClick={() => downloadQRCode(ticket.ticketNumber)}
                                >
                                    Download QR Code
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default UserTickets;
