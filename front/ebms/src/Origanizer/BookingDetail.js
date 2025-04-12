// import { useEffect, useState } from "react";
// import axios from "axios";
// import Title from "../layout/Title";

// const BookingsTable = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const response = await axios.get("http://localhost:5000/api/bookings", {
//                    withCredentials: true,
//                 });
//                 setBookings(response.data);
//             } catch (error) {
//                 console.error("Error fetching bookings:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     return (
//         <div className="container mx-auto p-6 min-h-[50vh]">
//             <h2 className="text-center text-2xl font-bold mb-4">Total Bookings : { bookings.length}</h2>
//            <Title title={"Booking Details"}/>
//             {loading ? (
//                 <p className="text-center text-gray-500">Loading bookings...</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border rounded-lg shadow-md">
//                         <thead>
//                             <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
//                                 <th className="p-3">Event</th>
//                                 <th className="p-3">User</th>
//                                 <th className="p-3">Event Date & Time</th>
//                                 <th className="p-3">Ticket Type</th>
//                                 <th className="p-3">Ticket Count</th>
//                                 <th className="p-3">Total Amount</th>
//                                 <th className="p-3">Booked On</th>
//                                 <th className="p-3">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bookings.map((booking) => (
//                                 <tr key={booking._id} className="border-b hover:bg-gray-50">
//                                     <td className="p-3">{booking.event.title}</td>
//                                     <td className="p-3">{booking.user.name}</td>
//                                     <td className="p-3">{booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleString() : "N/A"}</td>
//                                     <td className="p-3">{booking.ticketType}</td>
//                                     <td className="p-3 text-center">{booking.ticketCount}</td>
//                                     <td className="p-3 text-center">{booking.totalAmount}  ETB</td>
//                                     <td className="p-3">{new Date(booking.createdAt).toLocaleString()}</td>
//                                     <td
//                                         className={`p-3 font-semibold ${booking.status === "booked"
//                                                 ? "text-green-600"
//                                                 : booking.status === "canceled"
//                                                     ? "text-red-600"
//                                                     : "text-yellow-600"
//                                             }`}
//                                     >
//                                         {booking.status.toUpperCase()}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BookingsTable;



import Title from "../layout/Title";
import { useGetAllBookingsQuery } from "../features/api/bookingApi";
const BookingsTable = () => {
    const { data: bookings = [], isLoading, isError, error } = useGetAllBookingsQuery();

    return (
        <div className="container mx-auto p-6 min-h-[50vh]">
            <h2 className="text-center text-2xl font-bold mb-4">Total Bookings : {bookings.length}</h2>
            <Title title={"Booking Details"} />

            {isLoading ? (
                <p className="text-center text-gray-500">Loading bookings...</p>
            ) : isError ? (
                <p className="text-center text-red-500">Error: {error?.data?.message || "Something went wrong"}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
                                <th className="p-3">Event</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Event Date & Time</th>
                                <th className="p-3">Ticket Type</th>
                                <th className="p-3">Ticket Count</th>
                                <th className="p-3">Total Amount</th>
                                <th className="p-3">Booked On</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{booking.event.title}</td>
                                    <td className="p-3">{booking.user.name}</td>
                                    <td className="p-3">
                                        {booking.event?.eventDate
                                            ? new Date(booking.event.eventDate).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="p-3">{booking.ticketType}</td>
                                    <td className="p-3 text-center">{booking.ticketCount}</td>
                                    <td className="p-3 text-center">{booking.totalAmount} ETB</td>
                                    <td className="p-3">{new Date(booking.createdAt).toLocaleString()}</td>
                                    <td
                                        className={`p-3 font-semibold ${booking.status === "booked"
                                                ? "text-green-600"
                                                : booking.status === "canceled"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                            }`}
                                    >
                                        {booking.status.toUpperCase()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingsTable;
