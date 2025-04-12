// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { IoMdArrowBack } from "react-icons/io";
// import { Link, useParams } from 'react-router-dom';
// import SkeletonLoader from '../layout/SkeletonLoader';
// import { v4 as uuidv4 } from 'uuid';
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import { useGetCurrentUserQuery } from "../features/api/authApi";
// import '../Overlay.css';
// import Title from '../layout/Title';
// export default function BookingSummary() {

//     const { id } = useParams();
//     const [event, setEvent] = useState(null);
//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const booking = useSelector((state) => state.booking.pendingBooking);
//     const [load, setLoad] = useState(false);
//     const [showOverlay, setShowOverlay] = useState(false);
//     const { data: userDetails } = useGetCurrentUserQuery();
//     console.log('user detals', userDetails);
//     const transactionRef = uuidv4();
//     const BASE_URL =
//         process.env.NODE_ENV === 'production'
//             ? 'https://e-market-fnu1.onrender.com'
//             : 'http://localhost:5000';

//     useEffect(() => {
//         if (!id) {
//             return;
//         }
//         axios.get(`${BASE_URL}/api/events/${id}`).then(response => {
//             setEvent(response.data)
//             setLoading(false)
//         }).catch((error) => {
//             console.error("Error fetching events:", error);
//             setLoading(false)
//         });
//     }, [id, BASE_URL])

//     // Handle checkbox change
//     const handleCheckboxChange = (e) => {
//         setIsCheckboxChecked(e.target.checked)
//     }

//     // Show a loading skeleton while fetching event data
//     if (loading) {
//         return (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {[...Array(8)].map((_, i) => (
//                     <SkeletonLoader key={i} />
//                 ))}
//             </div>
//         );
//     }

//     // Handle case where event data isn't loaded
//     if (!event) {
//         return <div>No Order Summary found.</div>;
//     }

//     if (!booking) {
//         return <div className="text-center p-8 text-red-500">No booking found. Please select a ticket first.</div>;
//     }

//     const handlePayment = async () => {
//         if (!booking) {
//             console.error('No booking found. Please select a ticket first.');
//             toast.error('No booking found. Please select a ticket first');

//             return;
//         }

//         if (!userDetails) {
//             toast.error('User details not available. Please try again.');
//             return;
//         }

//         setLoad(true);
//         setShowOverlay(true);

//         try {
//             // Step 1: Create the booking first
//             const newBooking = { ...booking, tx_ref: transactionRef }; // Ensure tx_ref is set
//             const bookingResponse = await axios.post(`${BASE_URL}/api/bookings/create-booking`, newBooking, {
//                 withCredentials: true
//             });
//  //go to payment if only booking is successful
//             if (bookingResponse) {
//                 console.log('Booking successfully created:', bookingResponse.data);
//                 toast.success('Booking successfully created')
//                 // Step 2: Proceed to payment initialization if booking is successful
//                 const paymentData = {
//                     amount: booking.totalAmount,
//                     currency: 'ETB',
//                     email: userDetails.email,
//                     firstName: userDetails.firstName,
//                     lastName: userDetails.lastName,
//                     tx_ref: transactionRef,
//                 };

//                 const paymentResponse = await axios.post(`${BASE_URL}/api/payment/initialize`, paymentData, {
//                     withCredentials: true,
//                 });

//                 if (paymentResponse.data && paymentResponse.data.payment_url) {
//                     console.log('Redirecting to payment URL:', paymentResponse.data.payment_url);
//                     toast.success('Redirecting to Chapa Payment')
//                     window.location.href = paymentResponse.data.payment_url;
//                 } else {
//                     throw new Error('Payment URL not received');
//                 }
//             } else {
//                 throw new Error('Booking creation failed');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error('Error processing. Please try again.');
//             setShowOverlay(false);
//         }
//     };

//     return (
//         <div>
//             <Link to={`/events/${event._id}`}>
//                 <button
//                     className='inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-md'
//                 >
//                     <IoMdArrowBack className='font-bold w-6 h-6 gap-2' />
//                     Back
//                 </button>
//             </Link>
//             <Title  title={"Booking Summary"}/>
//             {showOverlay && (
//                 <div className="overlay">
//                     <div className="spinner-container">
//                         <div className="spinner"></div>
//                         <p className="overlay-message">Please wait....</p>
//                     </div>
//                 </div>
//             )}
//             <div className='flex flex-col bg-gray-50 rounded-lg shadow-lg p-4'>
//                 <div className='inline-flex gap-2 mt-8'>
//                     <div className="p-4 ml-12 bg-gray-50 rounded-2xl shadow-lg w-3/4 mb-12">
//                         <h2 className='text-left font-bold'>Terms & Conditions</h2>
//                         <ul className="custom-list list-disc pl-5">
//                             <li>Tickets are non-refundable under any circumstances.</li>
//                             <li>Tickets will be delivered to your registered email address as e-tickets.</li>
//                             <li>You are allowed a maximum of 2 tickets per event.</li>
//                             <li>In the rare event of cancellation or postponement, attendees will be notified.</li>
//                         </ul>
//                     </div>

//                     <div className="w-1/4 pl-4 h-1/4 mr-12 bg-gray-100 rounded-2xl shadow-lg">
//                         <h2 className='mt-4 font-bold'>Booking Summary</h2>
//                         <div className='text-sm'>
//                             <div className='text-left mt-5'>Your Name: {userDetails.name} </div>
//                             <div className='text-left mt-5'>Your Email: {userDetails.email}</div>
//                             <div className='text-left mt-5'>Event Name: {event.title}</div>
//                             <div className='text-left mt-5'>Ticket Type: {booking.ticketType}</div>
//                             <div className='text-left mt-5'>Total Ticket: {booking.ticketCount}</div>
//                            <hr className="my-2 pt-2 border-gray-300" />
//                             <div className='text-left mt-5'>Total Price: {booking.totalAmount} ETB</div>
//                         </div>
//                         <hr className="my-2 pt-2 border-gray-300" />
//                         <div className='flex justify-between'>
//                             <input className='h-5' type='checkbox' onChange={handleCheckboxChange} />
//                             <div className='px-2 text-sm'>
//                                 I have verified the event details and accept the terms and conditions
//                             </div>
//                         </div>

//                         <div className='mb-5'>
//                             <button
//                                 onClick={handlePayment}
//                                 className={`mt-5 p-3 ml-2 w-36 text-gray-100 items-center ${isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'} gap-2 rounded-md`}
//                                 disabled={!isCheckboxChecked}
//                             >
//                                 {load ? 'Processing...' : 'Proceed to Payment'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Overlay */}
//             {showOverlay && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
//                         <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                         </svg>
//                         <p className="text-gray-700">Processing your booking...</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }



import {  useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { IoMdArrowBack } from "react-icons/io";
import { useGetEventDetailsQuery } from '../features/api/eventApi';
import { useCreateBookingMutation, useInitializePaymentMutation } from '../features/api/bookingApi';

import { useGetCurrentUserQuery } from "../features/api/authApi";
import SkeletonLoader from '../layout/SkeletonLoader';
import Title from '../layout/Title';
import '../Overlay.css';

export default function BookingSummary() {
    const { id } = useParams();
    const booking = useSelector((state) => state.booking.pendingBooking);
    const { data: userDetails } = useGetCurrentUserQuery();

    const { data: event, isLoading: isEventLoading } = useGetEventDetailsQuery(id);
    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
    const [initializePayment] = useInitializePaymentMutation();

    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const transactionRef = uuidv4();

    const handleCheckboxChange = (e) => setIsCheckboxChecked(e.target.checked);

    const handlePayment = async () => {
        if (!booking || !userDetails || !event) {
            toast.error('Missing booking or user data.');
            return;
        }

        setShowOverlay(true);

        try {
            const newBooking = { ...booking, tx_ref: transactionRef };
            await createBooking(newBooking).unwrap();

            toast.success("Booking created successfully");

            const paymentPayload = {
                amount: booking.totalAmount,
                currency: 'ETB',
                email: userDetails.email,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                tx_ref: transactionRef,
            };

            const paymentRes = await initializePayment(paymentPayload).unwrap();

            if (paymentRes?.payment_url) {
                toast.success("Redirecting to Chapa...");
                window.location.href = paymentRes.payment_url;
            } else {
                throw new Error("Payment URL not received");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Payment failed. Try again.");
            setShowOverlay(false);
        }
    };

    if (isEventLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => <SkeletonLoader key={i} />)}
            </div>
        );
    }

    if (!event) {
        return <div>No event details found.</div>;
    }

    if (!booking) {
        return <div className="text-center p-8 text-red-500">No booking found. Please select a ticket first.</div>;
    }

    return (
        <div>
            <Link to={`/events/${event._id}`}>
                <button className='inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 text-blue-700 font-bold rounded-md'>
                    <IoMdArrowBack className='w-6 h-6' />
                    Back
                </button>
            </Link>
            <Title title="Booking Summary" />
            {showOverlay && (
                <div className="overlay">
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <p className="overlay-message">Please wait....</p>
                    </div>
                </div>
            )}
            <div className='flex flex-col bg-gray-50 rounded-lg shadow-lg p-4'>
                <div className='inline-flex gap-2 mt-8'>
                    <div className="p-4 ml-12 bg-gray-50 rounded-2xl shadow-lg w-3/4 mb-12">
                        <h2 className='text-left font-bold'>Terms & Conditions</h2>
                        <ul className="custom-list list-disc pl-5">
                            <li>Tickets are non-refundable under any circumstances.</li>
                            <li>Tickets will be delivered to your registered email address as e-tickets.</li>
                            <li>You are allowed a maximum of 2 tickets per event.</li>
                            <li>In the rare event of cancellation or postponement, attendees will be notified.</li>
                        </ul>
                    </div>

                    <div className="w-1/4 pl-4 mr-12 bg-gray-100 rounded-2xl shadow-lg">
                        <h2 className='mt-4 font-bold'>Booking Summary</h2>
                        <div className='text-sm mt-5'>
                            <div>Your Name: {userDetails?.name}</div>
                            <div>Your Email: {userDetails?.email}</div>
                            <div>Event Name: {event.title}</div>
                            <div>Ticket Type: {booking.ticketType}</div>
                            <div>Total Ticket: {booking.ticketCount}</div>
                            <hr className="my-2 pt-2 border-gray-300" />
                            <div>Total Price: {booking.totalAmount} ETB</div>
                        </div>
                        <hr className="my-2 pt-2 border-gray-300" />
                        <div className='flex justify-between'>
                            <input type='checkbox' className='h-5' onChange={handleCheckboxChange} />
                            <p className='px-2 text-sm'>
                                I have verified the event details and accept the terms and conditions
                            </p>
                        </div>
                        <div className='mb-5'>
                            <button
                                onClick={handlePayment}
                                className={`mt-5 p-3 ml-2 w-36 text-white ${isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'} rounded-md`}
                                disabled={!isCheckboxChecked || isBookingLoading}
                            >
                                {isBookingLoading ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
