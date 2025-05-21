const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Category = require("../models/Category");

exports.ReportOrganizer = async (req, res) => {
    try {
        const { eventId, startDate, endDate } = req.query;
        const organizerId = req.user._id; // Get organizer's ID from auth

        // Step 1: Fetch events created by the organizer
        let eventFilter = { organizer: organizerId };
        if (eventId) eventFilter._id = eventId;

        const events = await Event.find(eventFilter).populate("category");
        if (events.length === 0) {
            return res.status(200).json({ message: "No events found for this organizer." });
        }

        const eventIds = events.map(event => event._id);

        // Step 2: Filter bookings based on date range
        let bookingFilter = { event: { $in: eventIds }, status: "booked" };
        if (startDate && endDate) {
            bookingFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Fetch bookings for the organizer's events
        const bookings = await Booking.find(bookingFilter);

        // Step 3: Calculate total bookings, revenue, and tickets sold
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalAmount, 0);
        const totalTicketsSold = bookings.reduce((acc, booking) => acc + booking.ticketCount, 0);

        // Step 4: Group revenue by month
        const monthlyRevenue = {};
        bookings.forEach((booking) => {
            const date = new Date(booking.createdAt);
            const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!monthlyRevenue[yearMonth]) {
                monthlyRevenue[yearMonth] = { totalRevenue: 0, totalBookings: 0 };
            }

            monthlyRevenue[yearMonth].totalRevenue += booking.totalAmount;
            monthlyRevenue[yearMonth].totalBookings += 1;
        });

        // Step 5: Compute eventPerformanceData (attendees and revenue per event)
        const eventPerformanceData = [];
        for (const event of events) {
            const eventBookings = bookings.filter(booking => booking.event.toString() === event._id.toString());
            const attendees = eventBookings.reduce((acc, booking) => acc + booking.ticketCount, 0);
            const revenue = eventBookings.reduce((acc, booking) => acc + booking.totalAmount, 0);

            eventPerformanceData.push({
                name: event.title,
                attendees,
                revenue
            });
        }

        // Step 6: Compute eventCategoriesData (category distribution)
        const categoryCounts = {};
        const totalEvents = events.length;

        events.forEach(event => {
            const categoryName = event.category ? event.category.name : "Other";
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
        });

        const eventCategoriesData = Object.entries(categoryCounts).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize category name
            value: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0 // Percentage
        }));

        // Step 7: Compute ticketTypeRevenue (revenue distribution by ticket type)
        const ticketTypeRevenueMap = {};
        let totalRevenueByTickets = 0;

        // Iterate over each event to aggregate revenue by ticket type
        events.forEach(event => {
            event.ticketTypes.forEach(ticketType => {
                const ticketRevenue = ticketType.price * ticketType.booked; // Revenue = price * number of tickets booked
                const ticketTypeName = ticketType.name;

                if (!ticketTypeRevenueMap[ticketTypeName]) {
                    ticketTypeRevenueMap[ticketTypeName] = 0;
                }

                ticketTypeRevenueMap[ticketTypeName] += ticketRevenue;
                totalRevenueByTickets += ticketRevenue;
            });
        });

        // Convert to percentage and format for the frontend
        const ticketTypeRevenueData = Object.entries(ticketTypeRevenueMap).map(([name, revenue]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize ticket type name
            value: totalRevenueByTickets > 0 ? Math.round((revenue / totalRevenueByTickets) * 100) : 0 // Percentage
        }));

        // Step 8: Return the response
        res.status(200).json({
            totalBookings,
            totalRevenue,
            totalTicketsSold,
            monthlyRevenue: Object.entries(monthlyRevenue).map(([key, value]) => ({
                month: key,
                ...value,
            })),
            eventPerformance: eventPerformanceData,
            eventCategories: eventCategoriesData,
            ticketTypeRevenue: ticketTypeRevenueData // Add ticketTypeRevenue to the response
        });

    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to generate reports" });
    }
};