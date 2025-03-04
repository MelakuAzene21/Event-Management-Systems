import React, { useState } from "react";
import { useLoginMutation } from "../features/api/apiSlices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/slices/authSlice";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Google Icon

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const googleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(formData).unwrap();
      dispatch(setUser(userData.user));

      if (userData.user.role === "admin") {
        navigate("/admin", { replace: true });
      }

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Login failed: Invalid email or password.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f5f7", // Light Grey Background
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
          Welcome Back 👋
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          Please enter your details to login
        </Typography>

        {errorMessage && (
          <Typography color="error" variant="body2" align="center" mt={2}>
            {errorMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              padding: "12px",
              mt: 2,
              mb: 2,
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#555" },
            }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              padding: "12px",
              color: "#333",
              borderColor: "#ddd",
              "&:hover": { backgroundColor: "#f9f9f9" },
            }}
            onClick={googleLogin}
          >
            Login with Google
          </Button>

          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                <Link
                  to="/forgot-password"
                  style={{ textDecoration: "none", color: "#555" }}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
