import React, { useState } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";

const Profile = () => {
  const [admin, setAdmin] = useState({
    name: "Melaku",
    email: "admin@admin.com",
    password: "",
  });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <Paper
      elevation={3}
      sx={{ padding: 3, borderRadius: 3, maxWidth: 400, margin: "auto" ,marginTop:10}}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Admin Profile
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={admin.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={admin.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="New Password"
        name="password"
        type="password"
        value={admin.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpdate}
      >
        Update Profile
      </Button>
    </Paper>
  );
};

export default Profile;
