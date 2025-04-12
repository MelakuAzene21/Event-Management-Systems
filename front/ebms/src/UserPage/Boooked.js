import {  useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import Title from "../layout/Title";
import SkeletonLoader from "../layout/SkeletonLoader";
import { useGetAttendeeBookingsQuery,useDeleteBookingMutation } from "../features/api/bookingApi";
const BookingsTable = () => {
    const { data: bookings = [], loading } = useGetAttendeeBookingsQuery();
    const [deleteBooking] = useDeleteBookingMutation();

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDelete = async () => {
        if (!selectedBooking) return;

        try {
            await deleteBooking(selectedBooking).unwrap();
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
            <Title title={"Booking History"} />

            {loading ? (
               <SkeletonLoader/>
            ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <svg
                        className="w-24 h-24 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9-4v4m0 0H7m5 0h5"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet!</h3>
                    <p className="text-gray-500 max-w-md">
                        It looks like you haven’t made any bookings yet. Explore our events and book your spot today!
                    </p>
                    <Button
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                        onClick={() => window.location.href = "/"} // Adjust the redirect URL as needed
                    >
                        Browse Events
                    </Button>
                </div>
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
                                    <td className="p-3">{booking.event?.title}</td>
                                    <td className="p-3">{booking.user?.name}</td>
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