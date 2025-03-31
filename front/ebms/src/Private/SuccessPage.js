// import { useEffect, useState,useRef } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";
// import axios from "axios";
// import {motion} from "framer-motion";
// const SuccessPage = () => {
//     const location = useLocation();
//     const [transactionData, setTransactionData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [booking, setBooking] = useState(null);

//     const BASE_URL = "http://localhost:5000"; // Local development URL
//     const qrRef = useRef(null); //  Create ref for QR Code

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const txRef = queryParams.get("tx_ref");

//         if (!txRef) {
//             setTransactionData({ message: "Transaction reference not found." });
//             setIsLoading(false);
//             return;
//         }

//         const verifyTransaction = async () => {
//             try {
//                 const response = await fetch(`${BASE_URL}/api/payment/verify-transaction/${txRef}`);
//                 const data = await response.json();

//                 if (response.ok && data.success && data.bookingId) {
//                     setTransactionData({
//                         status: "success",
//                         message: data.message,
//                         bookingId: data.bookingId, // ✅ Use this to fetch booking
//                     });

//                     // Fetch booking details with QR code
//                     const bookingResponse = await axios(`${BASE_URL}/api/bookings/booking/${data.bookingId}`, {
//                         withCredentials: true,
//                     });

//                     // Use .data to access the response payload
//                     const bookingData = bookingResponse.data;

//                     if (bookingResponse.status === 200) {
//                         setBooking(bookingData);
//                     }

//                 } else {
//                     setTransactionData({ message: data.message || "Transaction failed." });
//                 }
//             } catch (error) {
//                 console.error("Error processing transaction:", error);
//                 setTransactionData({ message: "Error processing the transaction." });
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         verifyTransaction();
//     }, [location]);

    
    
//     // New method for downloading the QR code
//     const downloadQRCode = () => {
//         if (qrRef.current) {
//             const canvas = qrRef.current.querySelector("canvas"); // ✅ Select the canvas element inside QRCodeCanvas
//             if (!canvas) {
//                 console.error("Canvas not found! Ensure QRCodeCanvas renders correctly.");
//                 return;
//             }

//             const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//             let downloadLink = document.createElement("a");
//             downloadLink.href = pngUrl;
//             downloadLink.download = "ticket_qr.png";
//             document.body.appendChild(downloadLink);
//             downloadLink.click();
//             document.body.removeChild(downloadLink);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100">
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//                 className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 max-w-3xl w-full flex flex-col md:flex-row items-center"
//             >
//                 {isLoading ? (
//                     <p className="text-center text-gray-500 text-lg">Verifying your transaction...</p>
//                 ) : transactionData ? (
//                     <>
//                         {/* Success Animation */}
//                         <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
//                             <motion.div
//                                 initial={{ scale: 0, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 transition={{ duration: 0.6, ease: "easeOut" }}
//                                 className="flex justify-center md:justify-start"
//                             >
//                                 <div className="w-20 h-20 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                     </svg>
//                                 </div>
//                             </motion.div>

//                             <motion.h1
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.6, delay: 0.3 }}
//                                 className="text-4xl font-bold text-green-600"
//                             >
//                                 Payment Successful!
//                             </motion.h1>
//                             <motion.p
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.6, delay: 0.5 }}
//                                 className="text-lg text-gray-600"
//                             >
//                                 Thank you for your purchase! Your booking has been confirmed, and your digital ticket is ready.
//                             </motion.p>
//                             <motion.p
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.6, delay: 0.7 }}
//                                 className="text-gray-500 italic"
//                             >
//                                 Please present your QR code at the event for smooth entry.
//                             </motion.p>
//                             <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.6, delay: 0.9 }}
//                             >
//                                 <Link
//                                     to="/"
//                                     className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
//                                 >
//                                     Go to Home
//                                 </Link>
//                             </motion.div>
//                         </div>

//                         {booking && (
//                             <motion.div
//                                 initial={{ opacity: 0, x: 50 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.6, delay: 1 }}
//                                 className="w-full md:w-1/2 flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg"
//                             >
//                                 <h2 className="text-lg font-semibold mb-2 text-gray-700">Your Digital Ticket</h2>
//                                 {/* <QRCodeCanvas id="qrCodeCanvas" value={booking.qrCode} size={180} className="shadow-lg border border-gray-300 p-2 rounded-lg" /> */}
                            
//                                     {/* ✅ Use ref to get the QR code canvas */}
//                                     <div ref={qrRef}>
//                                         {booking ? (
//                                             booking.map((ticket) => (
//                                                 <QRCodeCanvas key={ticket.ticketNumber} value={ticket.qrCode} size={200} />
//                                             ))
//                                         ) : (
//                                             <p>Loading QR Code...</p>
//                                         )}
//                                     </div>


//                                     {/* // if it in image  it can't show details of booking*/}
//                                     {/* {booking && booking.qrCode ? (
//                                         <img src={booking.qrCode} alt="QR Code" className="shadow-lg border border-gray-300 p-2 rounded-lg" />
//                                     ) : (
//                                         <p>Loading QR Code...</p>
//                                     )} */}

//                                     <button
//                                     className="mt-4 px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
//                                     onClick={downloadQRCode}
//                                 >
//                                     Download QR Code
//                                 </button>
//                             </motion.div>
//                         )}
//                     </>
//                 ) : (
//                     <p className="text-center text-gray-500">No transaction data found.</p>
//                 )}
//             </motion.div>
//         </div>
//     );
// };

// export default SuccessPage;

import { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Title from "../layout/Title";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
    const location = useLocation();
    const [transactionData, setTransactionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [booking, setBooking] = useState([]);

    const BASE_URL = "http://localhost:5000";

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const txRef = queryParams.get("tx_ref");

        if (!txRef) {
            setTransactionData({ message: "Transaction reference not found." });
            setIsLoading(false);
            return;
        }

        const verifyTransaction = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/payment/verify-transaction/${txRef}`);
                const data = await response.json();

                if (response.ok && data.success && data.bookingId) {
                    toast.success('Payment Successfully Completed')
                    setTransactionData({
                        status: "success",
                        message: data.message,
                        bookingId: data.bookingId,
                    });

                    const bookingResponse = await axios(`${BASE_URL}/api/bookings/booking/${data.bookingId}`, {
                        withCredentials: true,
                    });

                    if (bookingResponse.status === 200) {
                        setBooking(bookingResponse.data);
                    }
                } else {
                    setTransactionData({ message: data.message || "Transaction failed." });
                }
            } catch (error) {
                console.error("Error processing transaction:", error);
                toast.error("Error processing transaction")
                setTransactionData({ message: "Error processing the transaction." });
            } finally {
                setIsLoading(false);
            }
        };

        verifyTransaction();
    }, [location]);

    // ✅ Single ref object to store multiple QR code refs
    const qrCodeRefs = useRef({});

    const downloadQRCode = (ticketNumber) => {
        const canvas = qrCodeRefs.current[ticketNumber]; // Get the canvas ref
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `ticket_${ticketNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR-code Downloaded Successfully")
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6">
           <Title title={"Payment Success page"}/>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 max-w-4xl w-full"
            >
                {isLoading ? (
                    <p className="text-center text-gray-500 text-lg">Verifying your transaction...</p>
                ) : transactionData ? (
                    <>
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="text-4xl font-bold text-green-600"
                                >
                                    Payment Successful!
                                </motion.h1>

                                <p className="text-lg text-gray-600">
                                    Thank you for your purchase! Your booking has been confirmed.
                                </p>

                                <p className="text-gray-500 italic">
                                    Please present your QR code at the event for smooth entry.
                                </p>
                            </div>


                        {booking.length > 0 && (
                            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                {booking.map((ticket) => (
                                    <motion.div
                                        key={ticket.ticketNumber}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 1 }}
                                        className="bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col items-center"
                                    >
                                        <h2 className="text-lg font-semibold mb-2 text-gray-700">
                                            Ticket #{ticket.ticketNumber}
                                        </h2>
                                        <QRCodeCanvas
                                            value={ticket.qrCode}
                                            size={200}
                                            className="shadow-lg border border-gray-300 p-2 rounded-lg"
                                            ref={(el) => (qrCodeRefs.current[ticket.ticketNumber] = el)} // ✅ Store ref dynamically
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

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Go to Home
                            </Link>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">No transaction data found.</p>
                )}
            </motion.div>
        </div>
    );
};

export default SuccessPage;
