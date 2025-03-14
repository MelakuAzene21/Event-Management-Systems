import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "../features/api/apiSlices";
import { toast } from "react-toastify";

const Profile = () => {
  // Fetch profile data
  const { data: profile, error, isLoading } = useGetCurrentUserQuery();
  console.log("Fetched Profile:", profile); // Debugging check

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Local state for editing
  const [formData, setFormData] = useState({
    name: "",
    email: "",
   
  });

  // Load profile data into state when fetched
  useEffect(() => {
    if (profile && profile._id) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
        status: profile.status || "",
        joinedAt: profile.createdAt || "",
      });
    }
  }, [profile]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!profile._id) {
      toast.error("Error: User ID is missing!");
      return;
    }

    try {

      await updateProfile({
        userId: profile._id,
        updatedData: formData,
      }).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Profile update failed!");
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        padding: 4,
        borderRadius: 3,
        maxWidth: 450,
        margin: "auto",
        marginTop: 10,
        textAlign: "center",
        background: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Admin Profile
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">
          {error.data?.message || "Failed to load profile"}
        </Typography>
      ) : (
        <>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
          />
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
              />
              
              <TextField
                label="Status"
                name="status"
                value={formData.status}
                fullWidth
                margin="normal"
                variant="outlined"  
                disabled
              />

              <TextField
                label="Joined At"
                name="joinedAt"
                value={new Date(formData.joinedAt).toLocaleString()}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled
              />  
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Update Profile"}
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Profile;
