// import { useEffect, useState } from "react";
// import axios from "axios";

// const BookingsTable = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const response = await axios.get("http://localhost:5000/api/bookings/attendee", {
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
//             {loading ? (
//                 <p className="text-center text-gray-500">Loading bookings...</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border rounded-lg shadow-md">
//                         <thead>
//                             <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
//                                 <th className="p-3">Event</th>
//                                 <th className="p-3">Your Name</th>
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


import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

import { toast } from "react-toastify";

const BookingsTable = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/bookings/attendee", {
                    withCredentials: true,
                });
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleDelete = async () => {
        if (!selectedBooking) return;
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${selectedBooking}`, {
                withCredentials: true,
            });
            setBookings(bookings.filter((b) => b._id !== selectedBooking));
            toast.success("Booking cleared successfully!");
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to clear booking.");
        } finally {
            setOpenDialog(false);
            setSelectedBooking(null);
        }
    };

    return (
        <div className="container mx-auto p-6 min-h-[50vh]">
            <h2 className="text-center text-2xl font-bold mb-4">Total Bookings: {bookings.length}</h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading bookings...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700 uppercase text-sm">
                                <th className="p-3">Event</th>
                                <th className="p-3">Your Name</th>
                                <th className="p-3">Event Date & Time</th>
                                <th className="p-3">Ticket Type</th>
                                <th className="p-3">Ticket Count</th>
                                <th className="p-3">Total Amount</th>
                                <th className="p-3">Booked On</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{booking.event.title}</td>
                                    <td className="p-3">{booking.user.name}</td>
                                    <td className="p-3">{booking.event?.eventDate ? new Date(booking.event.eventDate).toLocaleString() : "N/A"}</td>
                                    <td className="p-3">{booking.ticketType}</td>
                                    <td className="p-3 text-center">{booking.ticketCount}</td>
                                    <td className="p-3 text-center">{booking.totalAmount} ETB</td>
                                    <td className="p-3">{new Date(booking.createdAt).toLocaleString()}</td>
                                    <td className={`p-3 font-semibold ${booking.status === "booked"
                                        ? "text-green-600"
                                        : booking.status === "canceled"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                    >
                                        {booking.status.toUpperCase()}
                                    </td>
                                    <td className="p-3 text-center">
                                        <Button
                                            className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md"
                                            onClick={() => {
                                                setSelectedBooking(booking._id);
                                                setOpenDialog(true);
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ShadCN Confirmation Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-bold">Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-center text-gray-600">Are you sure you want to clear this booking?</p>
                    <DialogFooter className="flex justify-center gap-4 mt-4">
                        <Button onClick={() => setOpenDialog(false)} className="bg-gray-500 hover:bg-gray-600 text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Yes, Clear
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingsTable;
