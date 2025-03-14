import React from "react";
import { useParams } from "react-router-dom";
import { useGetEventDetailsQuery } from "../features/api/apiSlices";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Button,
} from "@mui/material";
import BackButton from "../components/BackButton.jsx";

const EventDetails = () => {
    const { id } = useParams();
    const { data: event, error, isLoading } = useGetEventDetailsQuery(id);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
            </Box>
        );
    }
  
    if (error) {
        return (
            <Alert severity="error">
                Failed to load event details. Please try again later.
            </Alert>
        );
    }

    return (
      <div>
        <BackButton />
        <Card sx={{ maxWidth: 800, margin: "auto", mt: 5, borderRadius: 3 }}>
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:5000${event.images[0]}`}
            alt={event.title}
          />
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {new Date(event.eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              at {event.eventTime}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Location: {event.location.name}
            </Typography>
            <Typography variant="body2" paragraph>
              {event.description}
            </Typography>
            <Typography variant="h6">Ticket Types:</Typography>
            {event.ticketTypes.map((ticket, index) => (
              <Typography key={index} variant="body2">
                🎟 {ticket.name} - ${ticket.price} (Available:{" "}
                {ticket.limit - ticket.booked})
              </Typography>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Organizer: {event.organizer?.name || "Unknown"}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
};

export default EventDetails;
