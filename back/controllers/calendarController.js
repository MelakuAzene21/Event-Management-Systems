const { google } = require('googleapis');
const Booking = require('../models/Booking');
const baseUrl =
    process.env.NODE_ENV === 'production'
        ? 'https://event-management-systems-gj91.onrender.com'
        : 'http://localhost:5000';
// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    `${baseUrl}/api/calendar/callback`
);

exports.checkCalendarEvent = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Fetch booking from database
        const booking = await Booking.findById(bookingId).populate('event user');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check if Google Calendar data exists
        if (!booking.googleEventId || !booking.calendarAccessToken) {
            return res.status(400).json({
                success: false,
                message: 'No Google Calendar event associated with this booking',
            });
        }

        // Set OAuth credentials
        oauth2Client.setCredentials({
            access_token: booking.calendarAccessToken,
            refresh_token: booking.calendarRefreshToken,
        });

        // Handle token refresh
        oauth2Client.on('tokens', async (tokens) => {
            if (tokens.refresh_token) {
                booking.calendarRefreshToken = tokens.refresh_token;
            }
            booking.calendarAccessToken = tokens.access_token;
            await booking.save();
            console.log('Updated tokens for booking:', bookingId);
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Fetch event from Google Calendar
        const response = await calendar.events.get({
            calendarId: 'primary',
            eventId: booking.googleEventId,
        });

        const event = response.data;
        res.status(200).json({
            success: true,
            message: 'Event found in Google Calendar',
            event: {
                id: event.id,
                summary: event.summary,
                description: event.description,
                start: event.start,
                end: event.end,
                location: event.location,
                attendees: event.attendees,
                status: event.status,
            },
            booking: {
                ticketType: booking.ticketType,
                ticketCount: booking.ticketCount,
                eventTitle: booking.event.title,
                userEmail: booking.user.email,
            },
        });
    } catch (error) {
        console.error('Error checking event:', error);
        if (error.code === 404) {
            res.status(404).json({
                success: false,
                message: 'Event not found in Google Calendar',
                error: error.message,
            });
        } else if (error.code === 401 || error.code === 403) {
            res.status(401).json({
                success: false,
                message: 'Authentication error. Tokens may be invalid or revoked.',
                error: error.message,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to check event',
                error: error.message,
            });
        }
    }
};