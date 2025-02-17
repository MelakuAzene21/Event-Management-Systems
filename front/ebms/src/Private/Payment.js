import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { useGetCurrentUserQuery } from "../features/api/authApi";
import '../Overlay.css';
export default function PaymentPage() {
    const booking = useSelector((state) => state.booking.currentBooking);
    const [paymentMethod, setPaymentMethod] = useState('Chapa');
    const [loading, setLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const { data: userDetails } = useGetCurrentUserQuery();

    const transactionRef = uuidv4();
    const BASE_URL =
        process.env.NODE_ENV === 'production'
            ? 'https://e-market-fnu1.onrender.com'
            : 'http://localhost:5000';

    const handlePayment = async () => {
        if (!booking) {
            toast.error('No booking found. Please select a ticket first.');
            return;
        }

        if (!userDetails) {
            toast.error('User details not available. Please try again.');
            return;
        }

        setLoading(true);
        setShowOverlay(true);

        try {
            const paymentData = {
                amount: booking.totalAmount,
                currency: 'ETB',
                email: userDetails.email,
                firstName: userDetails.name,
                lastName: userDetails.name,
                tx_ref: transactionRef,
            };

            const response = await axios.post(`${BASE_URL}/api/payment/initialize`, paymentData, {
                withCredentials: true,
            });

            if (response.data && response.data.payment_url) {
                console.log('Redirecting to payment URL:', response.data.payment_url);
                window.location.href = response.data.payment_url;
            } else {
                throw new Error('Payment URL not received');
            }
        } catch (error) {
            console.error('Error initializing payment', error);
            toast.error('Error initializing payment. Please try again.');
            setShowOverlay(false);
        }
    };

    if (!booking) {
        return <div className="text-center p-8 text-red-500">No booking found. Please select a ticket first.</div>;
    }

    return (
        <div className="p-8">
            <div className="container mx-auto flex items-center justify-center min-h-screen bg-gray-100">
                {showOverlay && (
                    <div className="overlay">
                        <div className="spinner-container">
                            <div className="spinner"></div>
                            <p className="overlay-message">Please wait....</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row sm:mt-12 lg:mt-4">
                    <div className="lg:w-1/2 lg:ml-8 mt-8 lg:mt-0 bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                        {/* <p>Event: {booking.event?._id || 'N/A'}</p> */}
                        
                        <p>Full Name: {userDetails.name}  {userDetails.lastName}</p>  
                        <p>email: {userDetails.email}</p>
                        <p>Ticket Type: {booking.ticketType || 'N/A'}</p>
                        <p>Ticket Quantity: {booking.ticketCount || 'N/A'}</p>
                        <p>Total Amount: {booking.totalAmount.toFixed(2)} ETB</p>
                        <p>Payment Method: {paymentMethod}</p>
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



// import { useDispatch, useSelector } from "react-redux";
// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { v4 as uuidv4 } from 'uuid';
// import { useGetCurrentUserQuery } from "../features/api/authApi";
// export default function PaymentPage() {
//     const booking = useSelector((state) => state.booking.currentBooking);
//     const [paymentUrl, setPaymentUrl] = useState('');
//     const [paymentMethod, setPaymentMethod] = useState('Chapa');
//     const [loading, setLoading] = useState(false);
//     const [showOverlay, setShowOverlay] = useState(false); // state to control overlay visibility
//     // const dispatch = useDispatch();

//     const { data: userDetails } = useGetCurrentUserQuery();

//     const transactionRef = uuidv4();
//     const BASE_URL =
//         process.env.NODE_ENV === 'production'
//             ? 'https://e-market-fnu1.onrender.com'
//             : 'http://localhost:5000';

//     const handlePayment = async () => {
//         // Check if the booking is empty
//         if (!booking) {
//             return <div>No booking found. Please select a ticket first.</div>;
//         }

//         setLoading(true);
//         setShowOverlay(true); // Show the overlay



//         try {
//             // Initialize payment
//             const paymentData = {
//                 amount: booking.totalAmount,
//                 currency: 'ETB',
//                 email: userDetails.email,
//                 firstName: userDetails.name,
//                 lastName: userDetails.name,
//                 tx_ref: transactionRef,
//             };

//             const response = await axios.post(`${BASE_URL}/payment/initialize`, paymentData, {
//                 withCredentials: true,
//             });
//             if (response.data && response.data.payment_url) {
//                 setPaymentUrl(response.data.payment_url);
//                 console.log('Redirecting to payment URL:', response.data.payment_url);
//                 window.location.href = response.data.payment_url;

//                 // Empty the cart after redirecting to the payment page
//                 //dispatch(emptyCart());
//             } else {
//                 throw new Error('Payment URL not received');
//             }

//         } catch (error) {
//             console.error('Error initializing payment', error);
//             toast.error('Error initializing payment. Please try again.');
//             setShowOverlay(false); // Hide the overlay after payment initialization


//         };

//         if (!booking) {
//             return <div>No booking found. Please select a ticket first.</div>;
//         }

//         return (
//             <div className="p-8">

//                 <div className="container mx-auto  flex items-center justify-center min-h-screen bg-gray-100">
//                     {/* <Title title={"Shipping Info"} /> */}

//                     {/* Full-page overlay */}
//                     {showOverlay && (
//                         <div className="overlay">
//                             {/* <ClipLoader size={50} color="#ffffff" /> Spinner inside the overlay */}
//                             <div className="spinner-container">
//                                 <div className="spinner"></div> {/* Custom spinner */}
//                                 <p className="overlay-message"> Please wait....</p>
//                             </div>
//                         </div>
//                     )}

//                     <div className="flex flex-col lg:flex-row sm:mt-12 lg:mt-4">


//                         {/* Booking Summary */}
//                         <div className="lg:w-3/5  lg:ml-8 mt-8 lg:mt-0 bg-white p-6 rounded-lg shadow-lg">
//                             <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
//                             <p>Event: {booking.event._id}</p>
//                             <p>Ticket Type: {booking.ticketType}</p>
//                             <p>Ticket Quantity: {booking.ticketCount}</p>
//                             <p>Total Amount: {booking.price.toFixed(2)} ETB</p>
//                             <p>Payment Method: {paymentMethod}</p>
//                             <button
//                                 onClick={handlePayment}
//                                 disabled={loading}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
//                             >
//                                 {loading ? 'Processing...' : 'Proceed to Payment'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         );
//     }
// }