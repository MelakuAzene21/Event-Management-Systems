import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const EventApproval = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setError("Failed to load event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleApproval = async (status) => {
    try {
      await axios.put(`http://localhost:5000/api/events/${eventId}/status`, {
        status,
      });
      toast.success(`Event ${status} successfully!`);
      navigate("/admin/dashboard");
       
    } catch (error) {
      console.error("Error updating event status:", error);
toast.error("Failed to update event status.");}
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;
  if (!event) return <Typography color="error">Event not found.</Typography>;

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Event Approval
        </Typography>

        {/* Image Gallery */}
        <Grid container spacing={2} mb={2}>
          {event.images.map((imgUrl, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  overflow: "hidden",
                  borderRadius: "8px",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <img
                  src={imgUrl}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Event Details */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              📅 Date: {new Date(event.eventDate).toDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ⏰ Time: {event.eventTime}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary">
              📍 Location: {event.location.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              🏷️ Category: {event.category?.name}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body2" fontWeight="bold" mt={2}>
          🎫 Ticket Information:
        </Typography>
        {event.ticketTypes.map((ticket) => (
          <Paper
            key={ticket._id}
            sx={{
              p: 1,
              my: 1,
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2">
              <strong>Type:</strong> {ticket.name} | 💲 Price: ${ticket.price} |
              🎟️ Available: {ticket.limit}
            </Typography>
          </Paper>
        ))}

        <Typography variant="body2" fontWeight="bold" mt={2}>
          👤 Organizer Details:
        </Typography>
        <Typography variant="body2">Name: {event.organizer?.name}</Typography>
        <Typography variant="body2">Email: {event.organizer?.email}</Typography>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            onClick={() => handleApproval("approved")}
            color="success"
            variant="contained"
            sx={{ mx: 1, px: 4, py: 1, fontSize: "1rem" }}
          >
            ✅ Approve
          </Button>
          <Button
            onClick={() => handleApproval("rejected")}
            color="error"
            variant="contained"
            sx={{ mx: 1, px: 4, py: 1, fontSize: "1rem" }}
          >
            ❌ Reject
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventApproval;
