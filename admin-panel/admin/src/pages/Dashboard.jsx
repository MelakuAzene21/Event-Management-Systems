import React from "react";
import { Typography, Paper } from "@mui/material";

const Dashboard = () => {
    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography>
                Welcome to the Admin Dashboard. Here you can manage users, events, and more!
            </Typography>
        </Paper>
    );
};

export default Dashboard;
