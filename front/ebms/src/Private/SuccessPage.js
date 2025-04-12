// import { useEffect, useState, useRef } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { QRCodeCanvas } from "qrcode.react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import Title from "../layout/Title";
// import { CheckCircle } from "lucide-react";

// const SuccessPage = () => {
//     const location = useLocation();
//     const [transactionData, setTransactionData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [booking, setBooking] = useState([]);

//     const BASE_URL = "http://localhost:5000";

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
//                     toast.success('Payment Successfully Completed')
//                     setTransactionData({
//                         status: "success",
//                         message: data.message,
//                         bookingId: data.bookingId,
//                     });

//                     const bookingResponse = await axios(`${BASE_URL}/api/bookings/booking/${data.bookingId}`, {
//                         withCredentials: true,
//                     });

//                     if (bookingResponse.status === 200) {
//                         setBooking(bookingResponse.data);
//                     }
//                 } else {
//                     setTransactionData({ message: data.message || "Transaction failed." });
//                 }
//             } catch (error) {
//                 console.error("Error processing transaction:", error);
//                 toast.error("Error processing transaction")
//                 setTransactionData({ message: "Error processing the transaction." });
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         verifyTransaction();
//     }, [location]);

//     // ✅ Single ref object to store multiple QR code refs
//     const qrCodeRefs = useRef({});

//     const downloadQRCode = (ticketNumber) => {
//         const canvas = qrCodeRefs.current[ticketNumber]; // Get the canvas ref
//         if (!canvas) return;

//         const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//         const downloadLink = document.createElement("a");
//         downloadLink.href = pngUrl;
//         downloadLink.download = `ticket_${ticketNumber}.png`;
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//         toast.success("QR-code Downloaded Successfully")
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6">
//            <Title title={"Payment Success page"}/>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//                 className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 max-w-4xl w-full"
//             >
//                 {isLoading ? (
//                     <p className="text-center text-gray-500 text-lg">Verifying your transaction...</p>
//                 ) : transactionData ? (
//                     <>
//                             <div className="flex flex-col items-center space-y-4 text-center">
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.8 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ duration: 0.6 }}
//                                 >
//                                     <CheckCircle className="w-16 h-16 text-green-500" />
//                                 </motion.div>

//                                 <motion.h1
//                                     initial={{ opacity: 0, y: -20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.6, delay: 0.3 }}
//                                     className="text-4xl font-bold text-green-600"
//                                 >
//                                     Payment Successful!
//                                 </motion.h1>

//                                 <p className="text-lg text-gray-600">
//                                     Thank you for your purchase! Your booking has been confirmed.
//                                 </p>

//                                 <p className="text-gray-500 italic">
//                                     Please present your QR code at the event for smooth entry.
//                                 </p>
//                             </div>


//                         {booking.length > 0 && (
//                             <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 {booking.map((ticket) => (
//                                     <motion.div
//                                         key={ticket.ticketNumber}
//                                         initial={{ opacity: 0, x: 50 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         transition={{ duration: 0.6, delay: 1 }}
//                                         className="bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col items-center"
//                                     >
//                                         <h2 className="text-lg font-semibold mb-2 text-gray-700">
//                                             Ticket #{ticket.ticketNumber}
//                                         </h2>
//                                         <QRCodeCanvas
//                                             value={ticket.qrCode}
//                                             size={200}
//                                             className="shadow-lg border border-gray-300 p-2 rounded-lg"
//                                             ref={(el) => (qrCodeRefs.current[ticket.ticketNumber] = el)} // ✅ Store ref dynamically
//                                         />
//                                         <button
//                                             className="mt-4 px-5 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
//                                             onClick={() => downloadQRCode(ticket.ticketNumber)}
//                                         >
//                                             Download QR Code
//                                         </button>
//                                     </motion.div>
//                                 ))}
//                             </div>
//                         )}

//                         <div className="mt-6 text-center">
//                             <Link
//                                 to="/"
//                                 className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
//                             >
//                                 Go to Home
//                             </Link>
//                         </div>
//                     </>
//                 ) : (
//                     <p className="text-center text-gray-500">No transaction data found.</p>
//                 )}
//             </motion.div>
//         </div>
//     );
// };

// export default SuccessPage;

import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Title from "../layout/Title";
import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useVerifyTransactionQuery,useGetBookingByIdQuery } from "../features/api/bookingApi";
const SuccessPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const txRef = queryParams.get("tx_ref");

    const {
        data: transactionData,
        isLoading: isVerifying,
        error: verifyError,
    } = useVerifyTransactionQuery(txRef, {
        skip: !txRef, // skip if no txRef
    });

    const {
        data: booking        
    } = useGetBookingByIdQuery(transactionData?.bookingId, {
        skip: !transactionData?.bookingId,
    });

    const qrCodeRefs = useRef({});

    useEffect(() => {
        if (transactionData?.success) {
            toast.success("Payment Successfully Completed");
        } else if (verifyError) {
            toast.error("Transaction failed.");
        }
    }, [transactionData, verifyError]);

    const downloadQRCode = (ticketNumber) => {
        const canvas = qrCodeRefs.current[ticketNumber];
        if (!canvas) return;

        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `ticket_${ticketNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR-code Downloaded Successfully");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6">
            <Title title={"Payment Success page"} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 max-w-4xl w-full"
            >
                {isVerifying ? (
                    <p className="text-center text-gray-500 text-lg">
                        Verifying your transaction...
                    </p>
                ) : transactionData?.success ? (
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

                        {booking && booking.length > 0 && (
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
                                            ref={(el) =>
                                                (qrCodeRefs.current[ticket.ticketNumber] = el)
                                            }
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
                    <p className="text-center text-gray-500">
                        {transactionData?.message || "No transaction data found."}
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default SuccessPage;
