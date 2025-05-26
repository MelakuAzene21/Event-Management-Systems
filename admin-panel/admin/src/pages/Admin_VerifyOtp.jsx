/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cleartemptoken,settemptoken, cleartempformDAta,setUser} from '../features/slices/authSlice';
import {useVerifyAdminOtpMutation,useLoginMutation} from '../features/api/apiSlices';

import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert
} from '@mui/material';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputsRef = useRef([]);
const temptoken = useSelector((state) => state.auth.temptoken);
const formData = useSelector((state) => state.auth.formData);
  const [verifyAdminOtp, { isLoading }] = useVerifyAdminOtpMutation();
  const [login] = useLoginMutation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [resendCount, setResendCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

 const handleKeyDown = (index, e) => {
  if (e.key === 'Backspace') {
    if (otp[index] === '') {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  }

  // Press Enter on last input triggers verification
  if (e.key === 'Enter' && index === 5) {
    handleVerify();
  }
};

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerify = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    const code = otp.join("");
    if (code.length !== 6 || otp.includes("")) {
      setErrorMsg("Please enter all 6 digits.");
      return;
    }
    if (!temptoken) {
      setErrorMsg("Verification session expired. Please log in again.");
      return;
    }

    try {
      const response = await verifyAdminOtp({ otp: code, temptoken }).unwrap();
      console.log("OTP Verification Response:", response); // Debug log
      if (response?.message === "OTP verified successfully") {
        if (!response.user?._id) {
          console.error("User object missing _id:", response.user);
          setErrorMsg("Invalid user data received.");
          return;
        }
        dispatch(setUser(response.user)); // Set user without wrapping in { user: ... }
        dispatch(cleartemptoken());
        dispatch(cleartempformDAta());
        setSuccessMsg("OTP verified and login successful! Redirecting...");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        setErrorMsg("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setErrorMsg(error?.data?.message || "Verification failed.");
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      setErrorMsg('Resend limit reached. Please try again later.');
      return;
    }

    try {
      // await InitiateRegister({ email: email.trim() }).unwrap();
      const userData = await login(formData).unwrap();
      dispatch(settemptoken(userData.temptoken));
      setTimer(180);
      setResendCount((prev) => prev + 1);
      setSuccessMsg('OTP resent successfully!');
    } catch {
      setErrorMsg('Failed to resend OTP. Please try again.');
    }
  };

  const handleCancel = () => navigate('/');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f4f6f8',
        px: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'white',
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={1}>
          OTP Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Please enter the OTP sent to your email to complete registration.
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
          {otp.map((digit, idx) => (
            <TextField
              key={idx}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              inputRef={(el) => (inputsRef.current[idx] = el)}
              inputProps={{ maxLength: 1, inputMode: 'numeric', style: { textAlign: 'center' } }}
              sx={{
                width: 50,
                '& input': {
                  fontSize: '24px',
                  p: 1.2
                }
              }}
            />
          ))}
        </Stack>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Remaining time: <strong>{formatTime(timer)}</strong>
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Didn’t get the code?{' '}
          <Button
            variant="text"
            size="small"
            onClick={handleResend}
            disabled={resendCount >= 3}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Resend
          </Button>
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleVerify}
          disabled={isLoading}
          sx={{ mb: 1 }}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>

        <Button fullWidth variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyOtp;
