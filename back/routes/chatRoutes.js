// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getUserChatsWithMessages,
  createNewChat // 🆕 Import this controller
} = require('../controllers/chatController');
const  verifyToken  = require('../middlewares/verifyToken');

// Get all chats with last message
router.get('/', verifyToken, getUserChatsWithMessages);

// ✅ Create new chat
router.post('/newchat', verifyToken, createNewChat);

module.exports = router;
