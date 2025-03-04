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
} from "@mui/material";

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
      console.log("Login user data:", userData.user);

      console.log("User role:", userData.user.role);
        if (userData.user.role === "admin") {
            navigate("/users", { replace: true })
        };
    //   } else if (userData.user.role === "user") {
    //     navigate("/", { replace: true });
    //   } else {
    //     setErrorMessage("Unknown role. Please contact support.");
    //   }

      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Login failed: Invalid email or password.");
      console.log("Error:", error);
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
        backgroundImage: "linear-gradient(to right, #2196F3, #4CAF50)",
      }}
    >
      <Box
        sx={{
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        {errorMessage && (
          <Typography color="error" variant="body2" align="center" paragraph>
            {errorMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
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
            color="primary"
            sx={{ padding: "10px", marginBottom: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ padding: "10px", marginBottom: 2 }}
            onClick={googleLogin}
          >
            Login with Google
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#2196F3" }}>
                  Sign Up
                </Link>
              </Typography>
              <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
                <Link to="/forgot-password" style={{ color: "#2196F3" }}>
                  Forgot Password?
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
