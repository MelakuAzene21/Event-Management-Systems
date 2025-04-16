// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
// import { Button } from "../components/ui/button";
// import { toast } from "react-toastify";
// import Title from "../layout/Title";
// import SkeletonLoader from "../layout/SkeletonLoader";
// import { useGetAttendeeBookingsQuery, useDeleteBookingMutation } from "../features/api/bookingApi";

// const BookingsTable = () => {
//     const { data: bookings = [], isLoading, error } = useGetAttendeeBookingsQuery();
//     const [deleteBooking] = useDeleteBookingMutation();

//     // Log bookings for debugging
//     console.log("Raw bookings:", bookings);

//     // Filter bookings to ensure all required fields are present
//     const validBookings = bookings.filter(
//         booking =>
//             booking &&
//             booking._id &&
//             booking.user &&
//             typeof booking.user.name === "string" &&
//             booking.event &&
//             typeof booking.event.title === "string" &&
//             booking.event.eventDate
//     );

//     // Log valid bookings to verify filtering
//     console.log("Valid bookings:", validBookings);

//     const [selectedBooking, setSelectedBooking] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);

//     const handleDelete = async () => {
//         if (!selectedBooking) return;

//         try {
//             await deleteBooking(selectedBooking).unwrap();
//             toast.success("Booking cleared successfully!");
//         } catch (error) {
//             console.error("Error deleting booking:", error);
//             toast.error("Failed to clear booking.");
//         } finally {
//             setOpenDialog(false);
//             setSelectedBooking(null);
//         }
//     };

//     if (error) {
//         return (
//             <div className="container mx-auto p-6 min-h-[50vh] text-center">
//                 <h2 className="text-xl font-bold text-red-600">Error loading bookings</h2>
//                 <p>Please try again later.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-6 min-h-[50vh]">
//             <h2 className="text-center text-2xl font-bold mb-4">Total Bookings: {validBookings.length}</h2>
//             <Title title={"Booking History"} />

//             {isLoading ? (
//                 <SkeletonLoader />
//             ) : validBookings.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center py-12">
//                     <svg
//                         className="w-24 h-24 text-gray-400 mb-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9-4v4m0 0H7m5 0h5"
//                         />
//                     </svg>
//                     <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet!</h3>
//                     <p className="text-gray-500 max-w-md">
//                         It looks like you haven’t made any bookings yet. Explore our events and book your spot today!
//                     </p>
//                     <Button
//                         className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
//                         onClick={() => (window.location.href = "/")}
//                     >
//                         Browse Events
//                     </Button>
//                 </div>
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
//                                 <th className="p-3 text-center">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {validBookings.map((booking) => (
//                                 <tr key={booking._id} className="border-b hover:bg-gray-50">
//                                     <td className="p-3">{booking.event.title}</td>
//                                     <td className="p-3">{booking.user?.name || " N/A"}</td>
//                                     <td className="p-3">
//                                         {new Date(booking.event.eventDate).toLocaleString()}
//                                     </td>
//                                     <td className="p-3">{booking.ticketType ?? "N/A"}</td>
//                                     <td className="p-3 text-center">{booking.ticketCount ?? 0}</td>
//                                     <td className="p-3 text-center">{booking.totalAmount ?? 0} ETB</td>
//                                     <td className="p-3">
//                                         {booking.createdAt
//                                             ? new Date(booking.createdAt).toLocaleString()
//                                             : "N/A"}
//                                     </td>
//                                     <td
//                                         className={`p-3 font-semibold ${booking.status === "booked"
//                                                 ? "text-green-600"
//                                                 : booking.status === "canceled"
//                                                     ? "text-red-600"
//                                                     : "text-yellow-600"
//                                             }`}
//                                     >
//                                         {booking.status?.toUpperCase() ?? "UNKNOWN"}
//                                     </td>
//                                     <td className="p-3 text-center">
//                                         <Button
//                                             className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md"
//                                             onClick={() => {
//                                                 setSelectedBooking(booking._id);
//                                                 setOpenDialog(true);
//                                             }}
//                                         >
//                                             Clear
//                                         </Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//                 <DialogContent className="max-w-md mx-auto">
//                     <DialogHeader>
//                         <DialogTitle className="text-center text-lg font-bold">Confirm Deletion</DialogTitle>
//                     </DialogHeader>
//                     <p className="text-center text-gray-600">Are you sure you want to clear this booking?</p>
//                     <DialogFooter className="flex justify-center gap-4 mt-4">
//                         <Button
//                             onClick={() => setOpenDialog(false)}
//                             className="bg-gray-500 hover:bg-gray-600 text-white"
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleDelete}
//                             className="bg-red-600 hover:bg-red-700 text-white"
//                         >
//                             Yes, Clear
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default BookingsTable;

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import Title from "../layout/Title";
import SkeletonLoader from "../layout/SkeletonLoader";
import { useGetAttendeeBookingsQuery, useDeleteBookingMutation } from "../features/api/bookingApi";

const BookingsTable = () => {
    const { data: bookings = [], isLoading, error } = useGetAttendeeBookingsQuery();
    const [deleteBooking] = useDeleteBookingMutation();

    // State for search, filters, and pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5;

    // Filter bookings to ensure all required fields are present
    const validBookings = bookings.filter(
        (booking) =>
            booking &&
            booking._id &&
            booking.user &&
            typeof booking.user.name === "string" &&
            booking.event &&
            typeof booking.event.title === "string" &&
            booking.event.eventDate
    );

    // Extract unique ticket types dynamically
    const uniqueTicketTypes = useMemo(() => {
        const types = new Set(validBookings.map((booking) => booking.ticketType).filter(Boolean));
        return [...types].sort(); // Sort for consistent display
    }, [validBookings]);

    // Search and filter bookings
    const filteredBookings = useMemo(() => {
        return validBookings.filter((booking) => {
            const matchesSearch =
                booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.user.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType =
                filterType === "all" || (booking.ticketType && booking.ticketType === filterType);
            const matchesStatus =
                filterStatus === "all" || booking.status?.toLowerCase() === filterStatus.toLowerCase();
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [validBookings, searchTerm, filterType, filterStatus]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * bookingsPerPage,
        currentPage * bookingsPerPage
    );

    // State for delete dialog
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDelete = async () => {
        if (!selectedBooking) return;

        try {
            await deleteBooking(selectedBooking).unwrap();
            toast.success("Booking cleared successfully!");
            setCurrentPage(1); // Reset to first page after deletion
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to clear booking.");
        } finally {
            setOpenDialog(false);
            setSelectedBooking(null);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (error) {
        return (
            <div className="container mx-auto p-6 min-h-[50vh] text-center">
                <h2 className="text-xl font-bold text-red-600">Error loading bookings</h2>
                <p>Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-[50vh]">
            <Title title="Booking History" />
            <h2 className="text-center text-2xl font-bold mb-4">
                Total Bookings: {filteredBookings.length}
            </h2>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by event or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Ticket Types</option>
                    {uniqueTicketTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="booked">Booked</option>
                    <option value="canceled">Canceled</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {isLoading ? (
                <SkeletonLoader />
            ) : filteredBookings.length === 0 ? (
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
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm || filterType !== "all" || filterStatus !== "all"
                            ? "No Bookings Found"
                            : "No Bookings Yet!"}
                    </h3>
                    <p className="text-gray-500 max-w-md">
                        {searchTerm || filterType !== "all" || filterStatus !== "all"
                            ? "No bookings match your search or filters."
                            : "It looks like you haven’t made any bookings yet. Explore our events and book your spot today!"}
                    </p>
                    <Button
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                        onClick={() => (window.location.href = "/")}
                    >
                        Browse Events
                    </Button>
                </div>
            ) : (
                <>
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
                                {paginatedBookings.map((booking) => (
                                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 truncate max-w-xs">{booking.event.title}</td>
                                        <td className="p-3">{booking.user?.name || "N/A"}</td>
                                        <td className="p-3">
                                            {new Date(booking.event.eventDate).toLocaleString()}
                                        </td>
                                        <td className="p-3">{booking.ticketType ?? "N/A"}</td>
                                        <td className="p-3 text-center">{booking.ticketCount ?? 0}</td>
                                        <td className="p-3 text-center">{booking.totalAmount ?? 0} ETB</td>
                                        <td className="p-3">
                                            {booking.createdAt
                                                ? new Date(booking.createdAt).toLocaleString()
                                                : "N/A"}
                                        </td>
                                        <td
                                            className={`p-3 font-semibold ${booking.status === "booked"
                                                    ? "text-green-600"
                                                    : booking.status === "canceled"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                }`}
                                        >
                                            {booking.status?.toUpperCase() ?? "UNKNOWN"}
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
                                >
                                    Previous
                                </Button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 rounded-md ${currentPage === index + 1
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                                <Button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-bold">Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-center text-gray-600">Are you sure you want to clear this booking?</p>
                    <DialogFooter className="flex justify-center gap-4 mt-4">
                        <Button
                            onClick={() => setOpenDialog(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Yes, Clear
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BookingsTable;