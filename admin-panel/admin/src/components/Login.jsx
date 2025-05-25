// import React, { useState } from "react";
// import { useLoginMutation } from "../features/api/apiSlices";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setUser } from "../features/slices/authSlice";
// import { Link } from "react-router-dom";
// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Grid,
//   Box,
//   Paper,
  
// } from "@mui/material";

// const Login = () => {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errorMessage, setErrorMessage] = useState("");

  

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = await login(formData).unwrap();
//       dispatch(setUser(userData.user));

//       if (userData.user.role === "admin") {
//         navigate("/admin", { replace: true });
//       }

//       setErrorMessage("");
//     } catch (error) {
//       console.lg(error);
//       setErrorMessage("Login failed: Invalid email or password.");
//     }
//   };

//   return (
//     <Container
//       component="main"
//       maxWidth="xs"
//       sx={{
//         height: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#f4f5f7", // Light Grey Background
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           padding: 4,
//           borderRadius: 3,
//           width: "100%",
//           maxWidth: 400,
//           backgroundColor: "white",
//         }}
//       >
//         <Typography variant="h5" align="center" fontWeight={600} gutterBottom>
//           Welcome Back 👋
//         </Typography>
//         <Typography variant="body2" align="center" color="textSecondary">
//           Please enter your details to login
//         </Typography>

//         {errorMessage && (
//           <Typography color="error" variant="body2" align="center" mt={2}>
//             {errorMessage}
//           </Typography>
//         )}

//         <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
//           <TextField
//             label="Email Address"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <TextField
//             label="Password"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               padding: "12px",
//               mt: 2,
//               mb: 2,
//               backgroundColor: "#333",
//               "&:hover": { backgroundColor: "#555" },
//             }}
//             disabled={isLoading}
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </Button>


          

//           <Grid container justifyContent="center" sx={{ mt: 2 }}>
//             <Grid item>
//               <Typography variant="body2" align="center">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/register"
//                   style={{
//                     textDecoration: "none",
//                     color: "#333",
//                     fontWeight: 500,
//                   }}
//                 >
//                   Sign Up
//                 </Link>
//               </Typography>
//               <Typography variant="body2" align="center" sx={{ mt: 1 }}>
//                 <Link
//                   to="/forgot-password"
//                   style={{ textDecoration: "none", color: "#555" }}
//                 >
//                   Forgot Password?
//                 </Link>
//               </Typography>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { useLoginMutation } from "../features/api/apiSlices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/slices/authSlice";
import { Link } from "react-router-dom";
import { settemptoken,settempformDAta } from "../features/slices/authSlice"; // Adjust path as needed

import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(settempformDAta(formData));
    const userData = await login(formData).unwrap();
    // Store the temporary tokeny
    console.log(userData.temptoken);
    dispatch(settemptoken(userData.temptoken));
  
    // Navigate to OTP verification page
    navigate("/verify-otp", { replace: true });

    setErrorMessage("");
  } catch (error) {
  console.error("Login error:", error);

  // If the backend returns a specific message, use it
  const serverMessage = error?.response?.data?.message || error?.data?.message;

  if (serverMessage) {
    setErrorMessage(serverMessage);
  } else if (error?.status === 401) {
    setErrorMessage("Invalid email or password.");
  } else if (error?.status === 403) {
    setErrorMessage("You are not authorized to access this area.");
  } else if (error?.status === 400) {
    setErrorMessage("Please enter both email and password.");
  } else if (error?.status === undefined) {
    setErrorMessage("Network error. Please check your internet connection.");
  } else {
    setErrorMessage("Login failed. Please try again.");
  }
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
        backgroundColor: "#f9fafc", // Light background color similar to the image
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          gutterBottom
          sx={{ color: "#1a202c" }} // Darker text color
        >
          Admin Portal
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          Sign in to access your admin dashboard
        </Typography>

        {errorMessage && (
          <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
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
            placeholder="admin@example.com"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#e2e8f0", // Light border color
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1a202c",
                },
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#e2e8f0",
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1a202c",
                },
              },
            }}
          />

          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Link
              to="/forgot-password"
              style={{
                textDecoration: "none",
                color: "#1a202c",
                fontSize: "14px",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              padding: "12px",
              backgroundColor: "#1a202c", // Dark button color like in the image
              color: "white",
              borderRadius: "8px",
              textTransform: "uppercase",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#2d3748" }, // Slightly lighter on hover
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress/> : "Sign in"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;