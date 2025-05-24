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
  Paper,
  Chip,
  Fade,
  Zoom,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import EventsByCategoryChart from "./EventsByCategoryChart";

const AdminDashboard = () => {
  // Fetch Data
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: events, isLoading: eventsLoading } = useGetEventsQuery();
  const { data: upcomingEvents, isLoading: upcomingLoading } =
    useGetUpcomingEventsQuery();
  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetBookingsQuery();

  // Calculate Metrics
  const totalUsers =
    users?.users?.filter((user) => user.role === "user")?.length || 0;
  const totalVendors =
    users?.users?.filter((user) => user.role === "vendor")?.length || 0;
  const totalOrganizers =
    users?.users?.filter((user) => user.role === "organizer")?.length || 0;
  const totalEvents = events?.length || 0;
  const revenue = bookingsData?.totalRevenue || 0;

  // Loading State
  if (usersLoading || eventsLoading || upcomingLoading || bookingsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        bgcolor: "grey.100",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Fade in timeout={600}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 4,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: 1.2,
          }}
        >
          Admin Dashboard
        </Typography>
      </Fade>

      {/* Stats Overview */}
      <Grid container spacing={3}>
        {[
          {
            title: "Total Users",
            value: totalUsers,
            icon: <PeopleIcon fontSize="large" />,
            color: "primary.main",
            bgColor: "primary.light",
          },
          {
            title: "Total Events",
            value: totalEvents,
            icon: <EventIcon fontSize="large" />,
            color: "success.main",
            bgColor: "success.light",
          },
          {
            title: "Total Vendors",
            value: totalVendors,
            icon: <BusinessIcon fontSize="large" />,
            color: "warning.main",
            bgColor: "warning.light",
          },
          {
            title: "Total Organizers",
            value: totalOrganizers,
            icon: <BusinessIcon fontSize="large" />,
            color: "info.main",
            bgColor: "info.light",
          },
          {
            title: "Total Revenue",
            value: `${revenue.toFixed(2)} ETB`,
            icon: <AttachMoneyIcon fontSize="large" />,
            color: "error.main",
            bgColor: "error.light",
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Zoom in timeout={400 + index * 200}>
              <Card
                sx={{
                  bgcolor: stat.bgColor,
                  color: "white",
                  boxShadow: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  p: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Events by Category Chart */}
      <Box mt={5}>
        <Fade in timeout={800}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
            >
              Event Distribution by Category
            </Typography>
            <EventsByCategoryChart />
          </Paper>
        </Fade>
      </Box>

      {/* Upcoming Events Section */}
      <Box mt={5}>
        <Fade in timeout={1000}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
            >
              Upcoming Events
            </Typography>
            <List>
              {upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event) => (
                  <React.Fragment key={event._id}>
                    <ListItem
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        "&:hover": {
                          bgcolor: "grey.50",
                          transition: "background-color 0.3s ease",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                          alt={event.title}
                        >
                          {event.title.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", color: "primary.main" }}
                            >
                              {event.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                Date:{" "}
                                {new Date(event.eventDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                Location: {event.location?.name || "N/A"}
                              </Typography>
                              <Chip
                                label={event.isFree ? "Free" : "Paid"}
                                color={event.isFree ? "success" : "warning"}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </Box>
                      <Link
                        to={`/events/${event._id}`}
                        style={{
                          textDecoration: "none",
                          fontWeight: "bold",
                          color: "#1E88E5",
                          padding: "8px 16px",
                          borderRadius: 4,
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                          },
                        }}
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                          },
                        }}
                      >
                        View Details →
                      </Link>
                    </ListItem>
                    <Divider sx={{ bgcolor: "grey.200" }} />
                  </React.Fragment>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    p: 3,
                    color: "text.secondary",
                    fontStyle: "italic",
                  }}
                >
                  No upcoming events found.
                </Typography>
              )}
            </List>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
