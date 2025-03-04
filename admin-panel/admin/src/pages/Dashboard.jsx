import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";

const Dashboard = () => {
  return (
    <Grid container spacing={3}>
      {/* Users Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: "#1E88E5", color: "white" }}>
          <CardContent>
            <PeopleIcon fontSize="large" />
            <Typography variant="h5">Total Users</Typography>
            <Typography variant="h6">120</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Events Card */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: "#43A047", color: "white" }}>
          <CardContent>
            <EventIcon fontSize="large" />
            <Typography variant="h5">Total Events</Typography>
            <Typography variant="h6">35</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
