const jwt = require('jsonwebtoken');
const otpVerificationMiddleware = (req, res) => {
  const { otp, token } = req.body;

  console.log('🔐 Incoming OTP Verification Request');
  console.log('👉 Received OTP:', otp);
  console.log('👉 Received Token:', token);

  if (!otp || !token) {
    console.log('❌ Missing OTP or token');
    return res.status(400).json({ message: 'OTP and token are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully');
    console.log('🧾 Decoded OTP:', decoded.otp);
    console.log('📥 Submitted OTP:', otp);
    console.log('🔍 Type Check - decoded.otp:', typeof decoded.otp, '| otp:', typeof otp);

    if (String(decoded.otp) !== String(otp)) {
      console.log('❌ OTP Mismatch');
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    console.log('✅ OTP matched. Generating verifiedToken...');

    // ❗ Remove "exp" from payload before re-signing
    const { exp, iat, ...payloadWithoutExp } = decoded;

    const verifiedToken = jwt.sign({ ...payloadWithoutExp, verified: true }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    console.log('✅ Verified token created:', verifiedToken);

    return res.status(200).json({ message: 'OTP verified successfully', verifiedToken });
  } catch (error) {
    console.error('🚨 JWT verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};



const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.body.token;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token includes the "verified" flag
    if (!decoded.verified) {
      return res.status(403).json({ message: 'Token is not from a verified source' });
    }

    // Attach the user data to request for later use (e.g., registerController)
    req.verifiedUserData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = {otpVerificationMiddleware,verifyTokenMiddleware};
