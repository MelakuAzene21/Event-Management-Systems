// controllers/chatController.js
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// 📥 Get all user chats (with latest message and unread counts)
const getUserChatsWithMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name role avatar') // only needed fields
      .lean();

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        try {
          // 1️⃣ Fetch the most recent 20 messages
          const messages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: -1 }) // newest first
            .limit(150)
            .select('  chatId sender receiver createdAt readBy content edited status text') // include needed fields
            .populate('sender', 'name avatar') // optional: to show "Alice" instead of ID
            .lean();

          // 2️⃣ Unread message count (only messages sent *to* current user and not yet read)
          const unreadCount = await Message.countDocuments({
            chatId: chat._id,
            receiver: userId,
            sender: { $ne: userId }, // Exclude messages sent by the user
            readBy: {
              $not: {
                $elemMatch: { userId: userId }
              }
            }
          });
          

          // 3️⃣ Latest message (for preview) — first one since sorted desc
          const latestMessage = messages[0] || [];

          return {
            ...chat,
            messages: messages.length > 0 ? messages.reverse() : [],
            latestMessage,
            unreadCount,
          };
        } catch (error) {
          console.error("Error enriching chat:", error);
          return {
            ...chat,
            messages: [],
            latestMessage: null,
            unreadCount: 0,
          };
        }
      })
    );

    res.status(200).json(enrichedChats);
  } catch (error) {
    console.error('Failed to retrieve user chats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// ✨ Create a new chat
const createNewChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id; // Token verified user

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // Optional: Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'name role avatar'); // 🔥 added populate here

    if (existingChat) {
      return res.status(200).json({ 
        message: "Chat already exists",
        chat: existingChat 
      });
    }

    // Create a new chat
    const newChat = new Chat({
      participants: [senderId, receiverId]
    });

    await newChat.save();

    // 🔥 populate participants after saving
    const populatedChat = await Chat.findById(newChat._id)
      .populate('participants', 'name role avatar');

    return res.status(201).json({
      message: "New chat created successfully",
      chat: populatedChat
    });
    
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { 
  getUserChatsWithMessages,
  createNewChat
};
