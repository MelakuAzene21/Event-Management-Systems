// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { IoMdArrowBack } from "react-icons/io";
// import { Link, useParams } from 'react-router-dom';
// import SkeletonLoader from '../layout/SkeletonLoader';
// import { v4 as uuidv4 } from 'uuid';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { useGetCurrentUserQuery } from "../features/api/authApi";
// import '../Overlay.css';


// export default function BookingSummary() {

//     const { id } = useParams();
//     const [event, setEvent] = useState(null);
//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
//     const [loading, setLoading] = useState(true)
    
    
//     const booking = useSelector((state) => state.booking.pendingBooking);
//     const [paymentMethod, setPaymentMethod] = useState('Chapa');
//     const [load, setLoad] = useState(false);
//     const [showOverlay, setShowOverlay] = useState(false);

//     const { data: userDetails } = useGetCurrentUserQuery();

//     const transactionRef = uuidv4();
//     const BASE_URL =
//         process.env.NODE_ENV === 'production'
//             ? 'https://e-market-fnu1.onrender.com'
//             : 'http://localhost:5000';
    
//     useEffect(() => {
//         if (!id) {
//             return;
//         }
//         axios.get(`http://localhost:5000/api/events/${id}`).then(response => {
//             setEvent(response.data)
//             setLoading(false)
//         }).catch((error) => {
//             console.error("Error fetching events:", error);
//             setLoading(false)
//         });
//     }, [id])

//     //! Handle checkbox change
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
//             toast.error('No booking found. Please select a ticket first.');
//             return;
//         }

//         if (!userDetails) {
//             toast.error('User details not available. Please try again.');
//             return;
//         }

//         setLoad(true);
//         setShowOverlay(true);

//         try {
//             const paymentData = {
//                 amount: booking.totalAmount,
//                 currency: 'ETB',
//                 email: userDetails.email,
//                 firstName: userDetails.name,
//                 lastName: userDetails.name,
//                 tx_ref: transactionRef,
//             };

//             const response = await axios.post(`${BASE_URL}/api/payment/initialize`, paymentData, {
//                 withCredentials: true,
//             });

//             if (response.data && response.data.payment_url) {
//                 console.log('Redirecting to payment URL:', response.data.payment_url);
//                 window.location.href = response.data.payment_url;
//             } else {
//                 throw new Error('Payment URL not received');
//             }
//         } catch (error) {
//             console.error('Error initializing payment', error);
//             toast.error('Error initializing payment. Please try again.');
//             setShowOverlay(false);
//         }
//     };

//     return (
//         <div>


//             <Link to={'/event/' + event._id}>
//                 <button
//                     // onClick={handleBackClick}
//                     className='
//               inline-flex
//               mt-12
//               gap-2
//               p-3
//               ml-12
//               bg-gray-100
//               justify-center
//               items-center
//               text-blue-700
//               font-bold
//               rounded-md'
//                 >
//                     <IoMdArrowBack
//                         className='
//             font-bold
//             w-6
//             h-6
//             gap-2'/>
//                     Back
//                 </button>
//             </Link>
//             {showOverlay && (
//                 <div className="overlay">
//                     <div className="spinner-container">
//                         <div className="spinner"></div>
//                         <p className="overlay-message">Please wait....</p>
//                     </div>
//                 </div>
//             )}
//             <div className='flex flex-col'>
//                 <div className='inline-flex gap-5 mt-8'>
//                     <div className="
//                       p-4
//                       ml-12
//                       bg-gray-100
//                       w-3/4
//                       mb-12"
//                     >
//                         <h2
//                             className='
//                             text-left
//                             font-bold
//                             '>
//                             Terms & Conditions </h2>
//                         <br />

//                         <div>
//                             <ul className="custom-list list-disc pl-5">
//                                 <li>Tickets are non-refundable under any circumstances. Please ensure your availability before making a purchase.</li>

//                                 <li>Tickets will be delivered to your registered email address as e-tickets. You can print the e-ticket or show it on your mobile device for entry to the event.</li>

//                                 <li>Each individual is allowed to purchase a maximum of 2 tickets for this event to ensure fair distribution.</li>

//                                 <li>In the rare event of cancellation or postponement, attendees will be notified via email. Tickets for canceled events will not be refunded but may be rescheduled for a future date.</li>

//                                 <li>Tickets for postponed events will remain valid for the new event date and cannot be refunded.</li>

//                                 <li>Your privacy is important to us. Our privacy policy outlines how we collect, use, and protect your personal information. By using our app, you agree to our privacy policy.</li>

//                                 <li>Before proceeding with your ticket purchase, please review and accept our terms and conditions, which govern the use of our app and ticketing services.</li>
//                             </ul>


//                             <br />
//                         </div>

//                     </div>

//                     <div className="
//                       w-1/4
//                       pl-4
//                       h-1/4
//                       mr-12
//                       bg-blue-100
//                     "
//                     >
//                         <h2 className='
//                             mt-4
//                             font-bold
//                         '>Booking Summary
//                         </h2>
//                         <div className='text-sm ' >
//                             <div className='text-left mt-5'>Your Name :{userDetails.firstName}  { userDetails.lastName}</div>
//                             <div className='text-left mt-5'>Your Email :{userDetails.email}</div>

//                             <div className='text-left mt-5'>Event Name :{event.title}</div>
//                             <div className='text-left mt-5 '> Ticket Type:{booking.ticketType}  </div>
//                             <div className='text-left mt-5 '> Total Ticket:{booking.ticketCount}  </div>
//                             <div className='text-left mt-5 '>Total Price: {booking.totalAmount}  ETB</div>
//                             <div className='text-left mt-5 '>Payment Method: {paymentMethod}  </div>



//                         </div>

//                         <hr className=" my-2 pt-2 border-gray-300" />
                       
//                         <div className='flex justify-between'>
//                             <input className='h-5 ' type='checkbox' onChange={handleCheckboxChange} />
//                             <div className='px-2 text-sm'>
//                                 I have verified the Event name, date and time before proceeding to payment. I accept terms and conditions.
//                             </div>
//                         </div>

//                         <div className='mb-5'>
//                             <button
//                                 onClick={handlePayment}
//                                     className={`mt-5 p-3 ml-2 w-36 text-gray-100 items-center ${isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'} gap-2 rounded-md`}
//                                     disabled={!isCheckboxChecked}
//                                 >
//                                 {load ? 'Processing...' : 'Proceed to Payment'}

//                                 </button>
                           
//                         </div>

//                     </div>
//                 </div>

//             </div>

//         </div>

//     );
// }

import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import SkeletonLoader from '../layout/SkeletonLoader';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateBookingMutation } from "../features/api/bookingApi";
import { useGetCurrentUserQuery } from "../features/api/authApi";
import '../Overlay.css';

export default function BookingSummary() {

    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
    const [loading, setLoading] = useState(true)
    const booking = useSelector((state) => state.booking.pendingBooking);
    const [paymentMethod, setPaymentMethod] = useState('Chapa');
    const [load, setLoad] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [createBooking, { isLoading1 }] = useCreateBookingMutation();
    const { data: userDetails } = useGetCurrentUserQuery();

    const transactionRef = uuidv4();
    const BASE_URL =
        process.env.NODE_ENV === 'production'
            ? 'https://e-market-fnu1.onrender.com'
            : 'http://localhost:5000';

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`${BASE_URL}/api/events/${id}`).then(response => {
            setEvent(response.data)
            setLoading(false)
        }).catch((error) => {
            console.error("Error fetching events:", error);
            setLoading(false)
        });
    }, [id])

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked)
    }

    // Show a loading skeleton while fetching event data
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <SkeletonLoader key={i} />
                ))}
            </div>
        );
    }

    // Handle case where event data isn't loaded
    if (!event) {
        return <div>No Order Summary found.</div>;
    }

    if (!booking) {
        return <div className="text-center p-8 text-red-500">No booking found. Please select a ticket first.</div>;
    }

    const handlePayment = async () => {
        if (!booking) {
            console.error('No booking found. Please select a ticket first.');
            toast.error('No booking found. Please select a ticket first');

            return;
        }

        if (!userDetails) {
            toast.error('User details not available. Please try again.');
            return;
        }

        setLoad(true);
        setShowOverlay(true);

        try {
            // Step 1: Create the booking first
            const newBooking = { ...booking, tx_ref: transactionRef }; // Ensure tx_ref is set
            const bookingResponse = await axios.post(`${BASE_URL}/api/bookings/create-booking`, newBooking, {
                withCredentials: true
            });
 //go to payment if only booking is successful
            if (bookingResponse) {
                console.log('Booking successfully created:', bookingResponse.data);
                toast.success('Booking successfully created')
                // Step 2: Proceed to payment initialization if booking is successful
                const paymentData = {
                    amount: booking.totalAmount,
                    currency: 'ETB',
                    email: userDetails.email,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    tx_ref: transactionRef,
                };

                const paymentResponse = await axios.post(`${BASE_URL}/api/payment/initialize`, paymentData, {
                    withCredentials: true,
                });

                if (paymentResponse.data && paymentResponse.data.payment_url) {
                    console.log('Redirecting to payment URL:', paymentResponse.data.payment_url);
                    toast.success('Redirecting to Chapa Payment')
                    window.location.href = paymentResponse.data.payment_url;
                } else {
                    throw new Error('Payment URL not received');
                }
            } else {
                throw new Error('Booking creation failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error processing. Please try again.');
            setShowOverlay(false);
        }
    };

    return (
        <div>
            <Link to={'/event/' + event._id}>
                <button
                    className='inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-md'
                >
                    <IoMdArrowBack className='font-bold w-6 h-6 gap-2' />
                    Back
                </button>
            </Link>
            {showOverlay && (
                <div className="overlay">
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <p className="overlay-message">Please wait....</p>
                    </div>
                </div>
            )}
            <div className='flex flex-col'>
                <div className='inline-flex gap-5 mt-8'>
                    <div className="p-4 ml-12 bg-gray-100 w-3/4 mb-12">
                        <h2 className='text-left font-bold'>Terms & Conditions</h2>
                        <ul className="custom-list list-disc pl-5">
                            <li>Tickets are non-refundable under any circumstances.</li>
                            <li>Tickets will be delivered to your registered email address as e-tickets.</li>
                            <li>You are allowed a maximum of 2 tickets per event.</li>
                            <li>In the rare event of cancellation or postponement, attendees will be notified.</li>
                        </ul>
                    </div>

                    <div className="w-1/4 pl-4 h-1/4 mr-12 bg-blue-100">
                        <h2 className='mt-4 font-bold'>Booking Summary</h2>
                        <div className='text-sm'>
                            <div className='text-left mt-5'>Your Name: {userDetails.firstName} {userDetails.lastName}</div>
                            <div className='text-left mt-5'>Your Email: {userDetails.email}</div>
                            <div className='text-left mt-5'>Event Name: {event.title}</div>
                            <div className='text-left mt-5'>Ticket Type: {booking.ticketType}</div>
                            <div className='text-left mt-5'>Total Ticket: {booking.ticketCount}</div>
                            <div className='text-left mt-5'>Total Price: {booking.totalAmount} ETB</div>
                            <div className='text-left mt-5'>Payment Method: {paymentMethod}</div>
                        </div>
                        <hr className="my-2 pt-2 border-gray-300" />
                        <div className='flex justify-between'>
                            <input className='h-5' type='checkbox' onChange={handleCheckboxChange} />
                            <div className='px-2 text-sm'>
                                I have verified the Event name, date, and time before proceeding to payment. I accept terms and conditions.
                            </div>
                        </div>

                        <div className='mb-5'>
                            <button
                                onClick={handlePayment}
                                className={`mt-5 p-3 ml-2 w-36 text-gray-100 items-center ${isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'} gap-2 rounded-md`}
                                disabled={!isCheckboxChecked}
                            >
                                {load ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
