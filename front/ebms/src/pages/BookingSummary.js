
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
