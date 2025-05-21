const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookie = require('cookie');

const verifyToken = async (socket, next) => {
  try {
    // ✅ NEW: Try parsing cookie
    let token;
    const cookiesHeader = socket.handshake.headers.cookie;
    if (cookiesHeader) {
      const cookies = cookie.parse(cookiesHeader);
      token = cookies.token; // 👈 Make sure this matches your actual cookie name
    }

    // 🔁 Fallbacks (optional)
    token = token ||
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1] ||
            socket.handshake.query?.token;

    if (!token) {
      console.error('[SOCKET_AUTH_FAILURE] No token provided', { socketId: socket.id });
      const err = new Error('AUTH_ERR_NO_TOKEN');
      err.data = { code: 'AUTH_ERR_NO_TOKEN' };
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select('_id role isActive')
      .lean();

    if (!user ) {
      console.error('[SOCKET_AUTH_FAILURE] User not found or inactive', { socketId: socket.id, userId: decoded.id });
      const err = new Error('AUTH_ERR_INVALID_USER');
      err.data = { code: 'AUTH_ERR_INVALID_USER' };
      return next(err);
    }

    socket.user = {
      _id: user._id,
      role: user.role
    };

    console.log('[SOCKET_AUTH_SUCCESS]', { socketId: socket.id, userId: user._id });

    next();
  } catch (error) {
    console.error('[SOCKET_AUTH_FAILURE]', {
      socketId: socket.id,
      error: error.name,
      message: error.message
    });

    const err = new Error('AUTH_ERR_INVALID_TOKEN');
    err.data = { 
      code: error.message,
      reconnect: error.name === 'TokenExpiredError'
    };
    next(err);
  }
};

module.exports = verifyToken;
