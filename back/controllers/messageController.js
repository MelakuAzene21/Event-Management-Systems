const Message = require("../models/Message");
const Chat = require("../models/Chat");

// Save message with proper readBy array
const savePrivateMessage = async ({ chatId, senderId, senderModel, receiverId, text }) => {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) throw new Error("Chat not found");

    const message = new Message({
      chatId,
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel: senderModel === "vendor" ? "organizer" : "vendor", // Opposite role
      text: text,
      readBy: [] // Initialize as unread
    });

    await message.save();

    // Update chat's last message reference
    chat.lastMessage = message._id;
    await chat.save();
    const savedmessage = await Message.findById(message._id).select(
      'chatId sender receiver createdAt readBy text edited status'
    );
    
    return savedmessage;
  } catch (err) {
    console.error("Error saving message:", err);
    throw err;
  }
};

// Fixed unread count (only counts opponent's unread messages)
const countUnreadMessages = async ({ userId, chatId }) => {
  try {
    return await Message.countDocuments({
      chatId,
      sender: { $ne: userId }, // Only messages from others
      "readBy.userId": { $ne: userId } // Not read by current user

    });
    console.log("🔍 Counting unread messages for user", userId, "in chat", chatId);

  } catch (err) {
    console.error("Error counting unreads:", err);
    throw err;
  }
};

// Rest of the controller remains unchanged
const updatePrivateMessage = async ({ messageId, newText }) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { text: newText, edited: true },
    { new: true }
  );
};

const deletePrivateMessage = async ({ messageId }) => {
  return await Message.findByIdAndDelete(messageId);
};

module.exports = {
  savePrivateMessage,
  updatePrivateMessage,
  deletePrivateMessage,
  countUnreadMessages
};