const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const baseUrl =
    process.env.NODE_ENV === 'production'
        ? 'https://event-management-systems-gj91.onrender.com'
        : 'http://localhost:5000';
// Google OAuth2 client for Calendar
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
        `${baseUrl}/api/calendar/callback`
);

// Get Calendar OAuth URL
router.get('/auth', async (req, res) => {
    const { bookingId } = req.query;
    if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID required' });
    }
    try {
        const booking = await Booking.findById(bookingId).populate('event user');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/calendar.events',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            state: `booking_${bookingId}`,
            prompt: 'select_account consent',
            include_granted_scopes: true
        });
        console.log('Generated OAuth URL:', url);
        res.json({ authUrl: url });
    } catch (error) {
        console.error('Error generating OAuth URL:', error);
        res.status(500).json({ error: 'Failed to generate OAuth URL' });
    }
});

// Calendar OAuth callback
router.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;
    console.log('Callback query params:', { code, state, error });

    if (error) {
        console.error('OAuth error:', error);
        if (error === 'access_denied') {
            return res.status(403).json({ error: 'Access denied: Ensure you are a test user and click "Advanced" > "Go to Event-hub-calnedar (unsafe)" to proceed' });
        }
        return res.status(400).json({ error: `OAuth error: ${error}` });
    }

    if (!state.startsWith('booking_')) {
        console.error('Invalid state parameter:', state);
        return res.status(400).json({ error: 'Invalid state parameter' });
    }

    const bookingId = state.replace('booking_', '');
    console.log('Extracted bookingId:', bookingId);

    try {
        // Exchange code for tokens
        console.log('Exchanging code for tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        console.log('Tokens received:', tokens);
        oauth2Client.setCredentials(tokens);

        // Get the selected Google account's email
        let selectedEmail = null;
        try {
            console.log('Fetching selected account email...');
            const people = google.people({ version: 'v1', auth: oauth2Client });
            const profile = await people.people.get({
                resourceName: 'people/me',
                personFields: 'emailAddresses'
            });
            selectedEmail = profile.data.emailAddresses?.[0]?.value;
            console.log('Selected Google account email:', selectedEmail);
            if (!selectedEmail) {
                throw new Error('No email found in People API response');
            }
        } catch (peopleError) {
            console.error('Error fetching selected email, falling back to user.email:', peopleError);
        }

        // Fetch booking data
        console.log('Fetching booking with ID:', bookingId);
        const booking = await Booking.findById(bookingId).populate('event user');
        if (!booking) {
            console.error('Booking not found for ID:', bookingId);
            return res.status(404).json({ error: 'Booking not found' });
        }

        const event = booking.event;
        const user = booking.user;
        console.log('Booking fetched:', { eventTitle: event.title, userEmail: user.email });

        // Fallback to user.email if selectedEmail is unavailable
        const emailForAttendees = selectedEmail || user.email;
        console.log('Using email for attendees:', emailForAttendees);

        // Parse eventTime (e.g., "14:00") and combine with eventDate
        const [hours, minutes] = event.eventTime.split(':').map(Number);
        const startDate = new Date(event.eventDate);
        startDate.setHours(hours, minutes, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(hours + 1, minutes, 0, 0); // Adjust duration as needed

        // Create calendar event
        console.log('Creating calendar event...');
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const calendarEvent = {
            summary: event.title,
            location: event.location.name || 'Location TBD',
            description: `Booking for ${event.title}. Ticket Type: ${booking.ticketType}, Tickets: ${booking.ticketCount}, Confirmation: ${bookingId}`,
            start: { dateTime: startDate.toISOString(), timeZone: 'Africa/Addis_Ababa' },
            end: { dateTime: endDate.toISOString(), timeZone: 'Africa/Addis_Ababa' },
            attendees: [{ email: emailForAttendees }],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 60 },
                    { method: 'popup', minutes: 10 }
                ]
            }
        };

        const createdEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: calendarEvent
        });
        console.log('Calendar event created:', createdEvent.data.id);

        // Store calendar data in Booking
        console.log('Saving calendar data to Booking...');
        booking.googleEventId = createdEvent.data.id;
        booking.calendarAccessToken = tokens.access_token;
        booking.calendarRefreshToken = tokens.refresh_token;
        await booking.save();
        console.log('Booking updated with calendar data');

        // Redirect to success page
        const clientBaseUrl =
            process.env.NODE_ENV === 'production'
                ? 'https://event-hub-vercel.vercel.app'
                : 'http://localhost:3000';

        const redirectUrl = `${clientBaseUrl}/success/calendar?bookingId=${bookingId}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error in calendar callback:', error);
        res.status(500).json({ error: 'Failed to add event to Google Calendar', details: error.message });
    }
});

// Update calendar event
router.post('/update/:bookingId', async (req, res) => {
    try {
        console.log('Updating calendar event for bookingId:', req.params.bookingId);
        const booking = await Booking.findById(req.params.bookingId).populate('event user');
        if (!booking || !booking.googleEventId) {
            return res.status(404).json({ error: 'No Google event found' });
        }

        oauth2Client.setCredentials({ access_token: booking.calendarAccessToken });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = booking.event;
        const user = booking.user;

        // Get the existing event to retrieve the attendee email
        const existingEvent = await calendar.events.get({
            calendarId: 'primary',
            eventId: booking.googleEventId
        });
        const attendeeEmail = existingEvent.data.attendees?.[0]?.email || user.email;

        const [hours, minutes] = event.eventTime.split(':').map(Number);
        const startDate = new Date(event.eventDate);
        startDate.setHours(hours, minutes, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(hours + 1, minutes, 0, 0);

        const updatedEvent = {
            summary: event.title,
            location: event.location.name || 'Location TBD',
            description: `Updated: Booking for ${event.title}. Ticket Type: ${booking.ticketType}, Tickets: ${booking.ticketCount}, Confirmation: ${booking._id}`,
            start: { dateTime: startDate.toISOString(), timeZone: 'Africa/Addis_Ababa' },
            end: { dateTime: endDate.toISOString(), timeZone: 'Africa/Addis_Ababa' },
            attendees: [{ email: attendeeEmail }],
        };

        await calendar.events.update({
            calendarId: 'primary',
            eventId: booking.googleEventId,
            resource: updatedEvent
        });

        res.json({ message: 'Event updated in Google Calendar' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});


router.get('/check-event/:bookingId',async (req, res) => {
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
}
)


module.exports = router;