import React from "react";
import { Link } from "react-router-dom";
import {
  useGetUsersQuery,
  useGetEventsQuery,
  useGetUpcomingEventsQuery,
  useGetBookingsQuery,
} from "../features/api/apiSlices";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Skeleton,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";

const AdminDashboard = () => {
  // Fetch Data
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: events, isLoading: eventsLoading } = useGetEventsQuery();
  const { data: upcomingEvents, isLoading: upcomingLoading } =
    useGetUpcomingEventsQuery();
  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetBookingsQuery();

  // Calculate Metrics
  const totalUsers = users?.users?.filter(user => user.role === "user")?.length || 0;
  const totalVendors = users?.users?.filter(user => user.role === "vendor")?.length || 0;
  const totalOrganizers = users?.users?.filter(user => user.role === "organizer")?.length || 0;  const totalEvents = events?.length || 0;
  const revenue = bookingsData?.totalRevenue || 0;
  // Loading State
  if (usersLoading || eventsLoading || upcomingLoading || bookingsLoading) {
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Admin Dashboard
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3}>
        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "#1E88E5",
              color: "white",
              boxShadow: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <PeopleIcon fontSize="large" />
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h5">{totalUsers}</Typography>
          </Card>
        </Grid>

        {/* Total Events */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "#43A047",
              color: "white",
              boxShadow: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <EventIcon fontSize="large" />
            <Typography variant="h6">Total Events</Typography>
            <Typography variant="h5">{totalEvents}</Typography>
          </Card>
        </Grid>

        {/* Total Vendors */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "#F57C00",
              color: "white",
              boxShadow: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <BusinessIcon fontSize="large" />
            <Typography variant="h6">Total Vendors</Typography>
            <Typography variant="h5">{totalVendors}</Typography>
          </Card>
        </Grid>

        {/* Total Vendors */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "#F57C00",
              color: "white",
              boxShadow: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <BusinessIcon fontSize="large" />
            <Typography variant="h6">Total Event Organizer</Typography>
            <Typography variant="h5">{totalOrganizers}</Typography>
          </Card>
        </Grid>

        {/* Revenue Overview */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "#D32F2F",
              color: "white",
              boxShadow: 3,
              textAlign: "center",
              p: 2,
            }}
          >
            <AttachMoneyIcon fontSize="large" />
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h5">{revenue.toFixed(2)} ETB</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Events Section */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Upcoming Events
        </Typography>
        <Card sx={{ boxShadow: 3, p: 2 }}>
          <List>
            {upcomingEvents?.length > 0 ? (
              upcomingEvents.map((event) => (
                <React.Fragment key={event._id}>
                  <ListItem
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Event Details */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{ bgcolor: "#1E88E5", mr: 2 }}
                        alt={event.title}
                      >
                        {event.title.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#1E88E5" }}
                          >
                            {event.title}
                          </Typography>
                        }
                        secondary={`Date: ${new Date(
                          event.eventDate
                        ).toDateString()}`}
                      />
                    </Box>

                    {/* View Details Button */}
                    <Link
                      to={`/events/${event._id}`}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        color: "#1E88E5",
                      }}
                    >
                      View Details →
                    </Link>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", p: 2 }}>
                No upcoming events found.
              </Typography>
            )}
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
