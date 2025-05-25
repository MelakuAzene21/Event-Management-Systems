import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setPendingRegistration, clearPendingRegistration } from '../features/slices/authSlice';
import { useInitiateRegisterMutation, useVerifyOtpAndRegisterMutation,useSignupMutation } from '../features/api/authApi';

const VerifyOtp = () => {
  const email = useSelector(state => state.auth.pendingRegistration?.formData?.email);
  const { formData, selectedRole } = useSelector(state => state.auth.pendingRegistration || {});
  const [VerifyOtpAndRegister, { isLoading }] = useVerifyOtpAndRegisterMutation();
  const [InitiateRegister] = useInitiateRegisterMutation();
  const [signup] = useSignupMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.pendingRegistration?.token);
   const [resendCount, setResendCount] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const inputsRef = useRef([]);

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

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
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

const handleVerify = async () => {
  setErrorMsg('');
  setSuccessMsg('');
  const code = otp.join('');
  if (code.length !== 6 || otp.includes('')) {
    setErrorMsg('Please enter all 6 digits.');
    return;
  }

  try {
    // ✅ First verify OTP and get the verifiedToken from the backend
    const { verifiedToken } = await VerifyOtpAndRegister({ otp: code, token }).unwrap();

    if (!verifiedToken) {
      throw new Error('OTP verification failed. Please try again.');
    }

    // ✅ Prepare FormData with all registration fields
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('email', formData.email.trim());
    formDataToSend.append('password', formData.password);
    formDataToSend.append('role', selectedRole === 'Attendee' ? 'user' : selectedRole.toLowerCase());

    if (selectedRole === 'Vendor') {
      formDataToSend.append('serviceProvided', formData.serviceProvided || '');
      formDataToSend.append('price', formData.price || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('availability', formData.availability || '');
      formDataToSend.append('location', formData.location || '');
      if (formData.portfolio?.length > 0) {
        formDataToSend.append('portfolio', JSON.stringify(formData.portfolio));
      }
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }
      if (formData.docs?.length > 0) {
        formData.docs.forEach(doc => formDataToSend.append('docs', doc));
      }
    }

    if (selectedRole === 'Organizer') {
      formDataToSend.append('phoneNumber', formData.phoneNumber || '');
      formDataToSend.append('organizationName', formData.organizationName || '');
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
      formDataToSend.append('about', formData.about || '');
      formDataToSend.append('experience', formData.experience || '');
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }
      if (formData.docs?.length > 0) {
        formData.docs.forEach(doc => formDataToSend.append('docs', doc));
      }
    }

    // ✅ Register the user with the verified token
    const registerResponse = await signup({
         formData: formDataToSend,
         verifiedToken,
     }).unwrap();


    console.log(registerResponse);
    setSuccessMsg('OTP verified and user registered successfully! Redirecting...');
    dispatch(clearPendingRegistration());
    setTimeout(() => navigate('/login'), 1500);
  } catch (error) {
    console.error(error);
    setErrorMsg(error?.data?.message || error?.message || 'Verification or registration failed.');
  }
};



  const handleCancel = () => {
    navigate('/register');
  };

 const handleResend = async () => {
  setErrorMsg('');
  setSuccessMsg('');

  if (resendCount >= 3) {
    setErrorMsg('Resend limit reached. Please try again later.');
    return;
  }

  if (!email) {
    setErrorMsg('Email not found. Please re-register.');
    return;
  }

  try {
    await InitiateRegister({ email: email.trim() }).unwrap();
    setTimer(180);
    setResendCount(prev => prev + 1); // ✅ increase resend count
    setSuccessMsg('OTP resent successfully!');
  } catch (error) {
    setErrorMsg('Failed to resend OTP. Please try again.');
  }
};


  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>OTP verification</h2>
        <p style={styles.text}>
          Please enter the OTP (One-Time Password) sent to your registered email to complete your verification.
        </p>

        {errorMsg && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: 'green', marginBottom: '1rem' }}>{successMsg}</div>}

        <div style={styles.otpContainer}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength="1"
              ref={(el) => (inputsRef.current[idx] = el)}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={styles.otpInput}
            />
          ))}
        </div>

        <div style={styles.info}>
          <span>
            Remaining time: <strong style={{ color: '#3b49df' }}>{formatTime(timer)}</strong>
          </span>
          <span style={{ marginLeft: 10 }}>
            Didn't get the code?{' '}
              <button 
                onClick={handleResend} 
                style={{ 
                  ...styles.resend, 
                  cursor: resendCount >= 3 ? 'not-allowed' : 'pointer', 
                  opacity: resendCount >= 3 ? 0.5 : 1 
  }}
                disabled={resendCount >= 3}
              >
              Resend
            </button>
          </span>
        </div>

        <button onClick={handleVerify} style={styles.verifyBtn} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
        <button onClick={handleCancel} style={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '1.5rem',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '1rem',
  },
  otpInput: {
    width: '45px',
    height: '50px',
    fontSize: '24px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  info: {
    fontSize: '13px',
    color: '#444',
    marginBottom: '1rem',
  },
  resend: {
    border: 'none',
    background: 'none',
    color: '#3b49df',
    cursor: 'pointer',
    fontWeight: '500',
    padding: 0,
  },
  verifyBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3b49df',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '0.5rem',
  },
  cancelBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#fff',
    border: '2px solid #3b49df',
    color: '#3b49df',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default VerifyOtp;
