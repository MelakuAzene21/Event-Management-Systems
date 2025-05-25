/* eslint-disable no-undef */
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Fade,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset"; // Icon for the forgot password theme

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://event-management-systems-gj91.onrender.com"
      : "http://localhost:5000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/forgot-password`,
        { email }
      );
      setMessage(response.data.message);
      toast.success("Reset Link Sent Successfully!");
    } catch (error) {
      console.error("Error during forgot password:", error);
      setMessage("Unable to send reset email. Please try again.");
      toast.error("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #e0f2fe 0%, #f3e8ff 100%)", // Subtle gradient background
        p: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            maxWidth: "28rem", // Compact width for a focused form
            width: "100%",
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            bgcolor: "white",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Softer, modern shadow
            border: "1px solid rgba(0, 0, 0, 0.05)", // Subtle border for depth
          }}
        >
          {/* Header with Icon */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <LockResetIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          </Box>
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            color="text.primary"
            gutterBottom
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 4, px: 2 }}
          >
            Enter your email address, and we’ll send you a link to reset your
            password.
          </Typography>

          {/* Success/Error Message */}
          {message && (
            <Fade in timeout={400}>
              <Alert
                severity={
                  message.includes("Error") || message.includes("Unable")
                    ? "error"
                    : "success"
                }
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                  bgcolor:
                    message.includes("Error") || message.includes("Unable")
                      ? "error.light"
                      : "success.light",
                  color:
                    message.includes("Error") || message.includes("Unable")
                      ? "error.dark"
                      : "success.dark",
                }}
              >
                {message.includes("Error") || message.includes("Unable") ? (
                  message
                ) : (
                  <span>
                    🎉 <strong>Success!</strong> A reset link has been sent to{" "}
                    <em>{email}</em>. Check your inbox or spam folder!
                  </span>
                )}
              </Alert>
            </Fade>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <TextField
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "& fieldset": {
                    borderColor: "grey.300",
                  },
                  "&:hover fieldset": {
                    borderColor: "grey.500",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                  },
                },
                "& .MuiInputBase-input": {
                  py: 1.5,
                  color: "text.primary",
                  "&::placeholder": {
                    color: "grey.500",
                    opacity: 1,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "grey.600",
                  "&.Mui-focused": {
                    color: "primary.main",
                  },
                },
              }}
            />

            {/* Submit Button with Spinner */}
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                bgcolor: loading ? "grey.400" : "primary.main",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: loading ? "grey.400" : "primary.dark",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                },
                "&:focus": {
                  boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.3)",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  <span>Sending...</span>
                </Box>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Remembered your password?{" "}
              <Link
                to="/"
                style={{
                  color: "#1976d2",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1565c0")}
                onMouseLeave={(e) => (e.target.style.color = "#1976d2")}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default ForgotPassword;
