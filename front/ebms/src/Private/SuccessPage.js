// // import { useEffect, useState } from 'react';
// // import { useLocation, Link ,useNavigate} from 'react-router-dom';
// // import { useSelector, useDispatch } from 'react-redux';
// // import {setCurrentBooking,clearPendingBooking} from '../features/slices/bookingSlice';
// // import { useGetCurrentUserQuery } from "../features/api/authApi";
// // import { useCreateBookingMutation } from "../features/api/bookingApi";

// // const SuccessPage = () => {
// //     const location = useLocation();
// //     const [transactionData, setTransactionData] = useState(null);
// //     const [isLoading, setIsLoading] = useState(true);

// //     const dispatch = useDispatch();
// //     const navigate = useNavigate();
// //     const pendingBooking = useSelector((state) => state.booking.pendingBooking);
// //     const [createBooking, { isLoading1 }] = useCreateBookingMutation();
// //     const { data: userDetails } = useGetCurrentUserQuery();

// //     useEffect(() => {
// //         console.log("Pending booking:", pendingBooking);
// //         if (!pendingBooking) {
// //             navigate("/"); // Redirect if no pending booking exists
// //             return;
// //         }
// //     }, [pendingBooking, navigate]);
// //     const BASE_URL ='http://localhost:5000'; // Local development URL

// //     useEffect(() => {
// //         // Extract tx_ref from the query params
// //         const queryParams = new URLSearchParams(location.search);
// //         const txRef = queryParams.get("tx_ref");

// //         if (!txRef) {
// //             setTransactionData({ message: "Transaction reference not found." });
// //             setIsLoading(false);
// //             return; // Early return if txRef is null
// //         }

// //         // Fetch the message from the callback route
// //         const verifyTransaction = async () => {
// //             try {
// //                 const response = await fetch(`${BASE_URL}/api/payment/verify-transaction/${txRef}`, {
// //                     method: 'GET',
// //                     headers: {
// //                         'Content-Type': 'application/json',
// //                     }
// //                 });
// //                 const data = await response.json();

// //                 if (response.ok) {
                    
// //                         try {
// //                             const newBooking = { ...pendingBooking, tx_ref: txRef }; // Ensure tx_ref is set
// //                             console.log("Creating booking with data:", newBooking);
// //                             const response = await createBooking(newBooking).unwrap();
// //                             console.log("Booking created:", response);
// //                             dispatch(setCurrentBooking(response.booking)); // Store confirmed booking
// //                             dispatch(clearPendingBooking()); // Clear pending booking
// //                             // navigate(`/booking-summary/${response.booking._id}`);
// //                         } catch (error) {
// //                             console.error("Booking creation failed:", error);
// //                             alert("Payment successful, but booking failed. Please contact support.");
// //                         }

// //                     // Update this section to match the response structure
// //                     setTransactionData({
// //                         status: data.success ? 'success' : 'failed',
// //                         message: data.message,
// //                         // first_name: data.data.first_name,
// //                         // email: data.data.email,
// //                         // amount: data.data.amount,
// //                         // currency: data.data.currency
// //                     });
// //                 } else {
// //                     setTransactionData({ message: data.message || "Failed to process the transaction." });
// //                 }
// //             } catch (error) {
// //                 console.error("Error processing the callback:", error);
// //                 setTransactionData({ message: "Error processing the transaction." ,error});
// //             } finally {
// //                 setIsLoading(false);
// //             }
// //         };

// //         verifyTransaction();
// //     }, [location]);




   


// //     return (
// //         <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //             <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-md w-full">
// //                 <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
// //                     Payment Status Verification
// //                 </h1>
// //                 {isLoading ? (
// //                     <p className="text-center text-gray-500">Verifying...</p>
// //                 ) : (
// //                     <div className="space-y-4">
// //                         {transactionData ? (
// //                             <>
// //                                 <div className="border border-gray-200 p-4 rounded-md">
// //                                     <p className="text-lg font-semibold text-gray-700">
// //                                         Status: <span className={`text-${transactionData.status === 'success' ? 'green' : 'red'}-500`}>{transactionData.status}</span>
// //                                     </p>
// //                                 </div>
// //                                 <div className="border border-gray-200 p-4 rounded-md">
// //                                     <p className="text-gray-700">
// //                                         <strong>Message:</strong> {transactionData.message}
// //                                     </p>
// //                                 </div>
// //                                 <div>
// //                                     <Link
// //                                         to={'/'}
// //                                         className="  mt-10 ml-6 text-white bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
// //                                     >
// //                                      {isLoading1 ? 'create Booking...' : 'Go to Home Page'}
// //                                     </Link>
// //                                 </div>
                               
// //                             </>
// //                         ) : (
// //                             <p className="text-center text-gray-500">No transaction data found.</p>
// //                         )}
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default SuccessPage;




// import { useEffect, useState } from 'react';
// import { useLocation, Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { setCurrentBooking, clearPendingBooking } from '../features/slices/bookingSlice';
// import { useGetCurrentUserQuery } from "../features/api/authApi";
// import { useCreateBookingMutation } from "../features/api/bookingApi";

// const SuccessPage = () => {
//     const location = useLocation();
//     const [transactionData, setTransactionData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const pendingBooking = useSelector((state) => state.booking.pendingBooking);
//     const [createBooking, { isLoading1 }] = useCreateBookingMutation();
//     const { data: userDetails } = useGetCurrentUserQuery();

//     useEffect(() => {
//         console.log("Pending booking:", pendingBooking);
//         if (!pendingBooking) {
//             navigate("/"); // Redirect if no pending booking exists
//             return;
//         }
//     }, [pendingBooking, navigate]);

//     const BASE_URL = 'http://localhost:5000'; // Local development URL

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const txRef = queryParams.get("tx_ref");

//         if (!txRef) {
//             setTransactionData({ message: "Transaction reference not found." });
//             setIsLoading(false);
//             return;
//         }

//         const handleBookingCreationAndVerification = async () => {
//             try {
//                 // First, create the booking
//                 const newBooking = { ...pendingBooking, tx_ref: txRef }; // Ensure tx_ref is set
//                 console.log("Creating booking with data:", newBooking);
//                 const bookingResponse = await createBooking(newBooking).unwrap();
//                 console.log("Booking created:", bookingResponse);

//                 // Store confirmed booking and clear pending booking
//                 dispatch(setCurrentBooking(bookingResponse.booking));
//                 // dispatch(clearPendingBooking());

//                 // Now, verify the transaction
//                 const response = await fetch(`${BASE_URL}/api/payment/verify-transaction/${txRef}`, {
//                     method: 'GET',
//                     headers: { 'Content-Type': 'application/json' },
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     setTransactionData({
//                         status: data.success ? 'success' : 'failed',
//                         message: data.message,
//                     });
//                 } else {
//                     setTransactionData({ message: data.message || "Failed to process the transaction." });
//                 }
//             } catch (error) {
//                 console.error("Error processing the transaction:", error);
//                 setTransactionData({ message: "Error processing the transaction.", error });
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         handleBookingCreationAndVerification();
//     }, [location, pendingBooking, dispatch, createBooking, BASE_URL]);

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-md w-full">
//                 <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
//                     Payment Status Verification
//                 </h1>
//                 {isLoading ? (
//                     <p className="text-center text-gray-500">Verifying...</p>
//                 ) : (
//                     <div className="space-y-4">
//                         {transactionData ? (
//                             <>
//                                 <div className="border border-gray-200 p-4 rounded-md">
//                                     <p className="text-lg font-semibold text-gray-700">
//                                         Status: <span className={`text-${transactionData.status === 'success' ? 'green' : 'red'}-500`}>{transactionData.status}</span>
//                                     </p>
//                                 </div>
//                                 <div className="border border-gray-200 p-4 rounded-md">
//                                     <p className="text-gray-700">
//                                         <strong>Message:</strong> {transactionData.message}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <Link
//                                         to={'/'}
//                                         className="mt-10 ml-6 text-white bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
//                                     >
//                                         {isLoading1 ? 'Creating Booking...' : 'Go to Home Page'}
//                                     </Link>
//                                 </div>
//                             </>
//                         ) : (
//                             <p className="text-center text-gray-500">No transaction data found.</p>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SuccessPage;


import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentBooking } from '../features/slices/bookingSlice';
import { useGetCurrentUserQuery } from "../features/api/authApi";

const SuccessPage = () => {
    const location = useLocation();
    const [transactionData, setTransactionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const pendingBooking = useSelector((state) => state.booking.pendingBooking);
    const { data: userDetails } = useGetCurrentUserQuery();

    // useEffect(() => {
    //     if (!pendingBooking) {
    //         navigate("/"); // Redirect if no pending booking exists
    //         return;
    //     }
    // }, [pendingBooking, navigate]);

    const BASE_URL = 'http://localhost:5000'; // Local development URL

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const txRef = queryParams.get("tx_ref");
console.log('txRef in Success page',txRef)
        if (!txRef) {
            setTransactionData({ message: "Transaction reference not found." });
            setIsLoading(false);
            return;
        }

        const verifyTransaction = async () => {
            try {
                // Now, verify the transaction
                const response = await fetch(`${BASE_URL}/api/payment/verify-transaction/${txRef}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await response.json();

                if (response.ok) {
                    setTransactionData({
                        status: data.success ? 'success' : 'failed',
                        message: data.message,
                    });
                } else {
                    setTransactionData({ message: data.message || "Failed to process the transaction." });
                }
            } catch (error) {
                console.error("Error processing the transaction:", error);
                setTransactionData({ message: "Error processing the transaction.", error });
            } finally {
                setIsLoading(false);
            }
        };

        verifyTransaction();
    }, [location, BASE_URL]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
                    Payment Status Verification
                </h1>
                {isLoading ? (
                    <p className="text-center text-gray-500">Verifying...</p>
                ) : (
                    <div className="space-y-4">
                        {transactionData ? (
                            <>
                                <div className="border border-gray-200 p-4 rounded-md">
                                    <p className="text-lg font-semibold text-gray-700">
                                        Status: <span className={`text-${transactionData.status === 'success' ? 'green' : 'red'}-500`}>{transactionData.status}</span>
                                    </p>
                                </div>
                                <div className="border border-gray-200 p-4 rounded-md">
                                    <p className="text-gray-700">
                                        <strong>Message:</strong> {transactionData.message}
                                    </p>
                                </div>
                                <div>
                                    <Link
                                        to={'/'}
                                        className="mt-10 ml-6 text-white bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
                                    >
                                        Go to Home Page
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500">No transaction data found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuccessPage;
