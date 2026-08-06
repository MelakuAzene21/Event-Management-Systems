

// config/initializeSocket.js
const { Server } = require("socket.io");
const verifyToken = require("../middlewares/verifyTokenSocket");
const {
  savePrivateMessage,
  updatePrivateMessage,
  countUnreadMessages ,
  deletePrivateMessage
} = require("../controllers/messageController");
const Chat    = require("../models/Chat");
const Message = require("../models/Message");

let io;
const activeUsers = new Map(); // socketId → { userId, role, lastActive }

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,  // 60 seconds
    pingInterval: 25000  // 25 seconds    
  });

  // Attach JWT-auth middleware
  io.use(verifyToken);

  io.on("connection", (socket) => {

    const me = socket.user._id.toString();  // Convert to string early
    console.log("Socket connected:", socket.id, "User:", me, "Role:", socket.user.role);

    // Track user & broadcast online
    socket.join(me);
    activeUsers.set(socket.id, { userId: me, role: socket.user.role, lastActive: new Date() });
    socket.broadcast.emit("userOnline", { userId: me });
    socket.emit("startPing");  // Emitting to the connected client

    const findSocketIdByUserId = (userId) => {
      const idStr = userId.toString();
      for (let [socketId, user] of activeUsers.entries()) {
        if (user.userId === idStr) {
          return socketId;
        }
      }
      return null;
    };
    
    const onlineUserIds = Array.from(activeUsers.values()).map(user => user.userId);
    socket.emit("initialOnlineUsers", onlineUserIds);    
    console.log('Emitting initial online users:', onlineUserIds);
    

    socket.on('messageRead', ({ messageId, chatId, userId }) => {
      console.log('Message read by user:', userId, 'Message ID:', messageId);

      // You would need to update the backend database here
      // For example: Mark the message as read in your database
      updateMessageReadStatus(messageId, chatId, userId);

      // After updating the database, notify the sender and other participants
      const messageReadInfo = {
          messageId,
          chatId,
          userId, // Receiver's user ID
      };

      // Emit messageReadConfirmed back to the sender and other participants
      io.to(chatId).emit('messageReadConfirmed', messageReadInfo);
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });


// inside your backend editMessage socket handler
socket.on("editMessage", async ({ messageId, newText, chatId, receiverId }) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { text: newText, edited: true },
      { new: true }
    ).lean();
if (!updated) return;
    const payload = {
      chatId,
      messageId,
      text: newText,
    };

    // emit to the editor
    socket.emit("messageEdited", payload);
console.log('Active users:', activeUsers);
    // emit to the opponent if connected
    
        const receiverSocketId = findSocketIdByUserId(receiverId); // implement this based on your socket-user map
    console.log('Active users:', receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageEdited", payload);
    }
  } catch (err) {
    console.error("Edit message error:", err);
  }
});


    socket.on("privateMessage", async (messageData, callback) => {
      const { senderId, receiverId, text, chatId,senderModel } = messageData;
    
      try {
        // 1. Save the message to DB
        const saved = await savePrivateMessage({
          chatId,
          senderId,
          receiverId,
          text,
          senderModel
        });
    
        const receiverSocketId = findSocketIdByUserId(receiverId); // implement this based on your socket-user map

        if (receiverSocketId) {
          // Receiver is online - emit message to them
          io.to(receiverSocketId).emit("privateMessage", saved);
         
        }
        socket.emit("messageDelivered", {
          chatId,
          message: saved
        });
      } catch (err) {
        console.error("privateMessage failed:", err);
        callback?.({ status: "failed", error: err.message });
      }
    });
    

   socket.on("messages:read", async ({ chatId, messageIds, userId, sender, opponentId }) => {
  console.log("✅ [Socket] messages:read received:", {
    chatId,
    messageIds,
    userId,
    sender,
    opponentId
  });

  try {
    const updatedMessageIds = [];

    for (const messageId of messageIds) {
      const msg = await Message.findOne({ _id: messageId, chatId });

      if (!msg) continue;

      const alreadyRead = msg.readBy.some(entry => entry.userId.toString() === userId);
      if (alreadyRead) continue;

      await Message.updateOne(
        { _id: messageId },
        {
          $push: { readBy: { userId, model: sender } },
          $set: { status: "read" }
        }
      );

      updatedMessageIds.push(messageId);
    }

    if (updatedMessageIds.length === 0) {
      console.log("No messages updated.");
      return;
    }

    // Emit to the opponent
    const opponentSocketId = findSocketIdByUserId(opponentId);
    if (opponentSocketId) {
      console.log("Emitting to opponent:", opponentSocketId);
      io.to(opponentSocketId).emit("messages:read:update", {
        chatId,
        messageIds: updatedMessageIds,
        status: "read",
        sender,
        opponentId
      });
    } else {
      console.log("No socket found for opponent:", opponentId);
    }
  } catch (err) {
    console.error("Error handling messages:read:", err);
  }
});

    
    //
    // 2) EDIT MESSAGE
    //
    socket.on("editMessage", async ({ messageId, newText, receiverId }, callback) => {
      try {
        const updated = await updatePrivateMessage({ messageId, newText });
        // Notify both
        io.to(receiverId).emit("messageEdited", updated);
        callback?.({ status: "ok", message: updated });
      } catch (err) {
        console.error("editMessage failed:", err);
        callback?.({ status: "failed", error: err.message });
      }
    });

    socket.on("getUnreadCount", async ({ chatId }, callback) => {
      try {
        const user = activeUsers.get(socket.id);
        if (!user) throw new Error("User not authenticated");
    
        const count = await countUnreadMessages({
          userId: user.userId,
          chatId
        });
    
        if (typeof callback === "function") {
          callback({ chatId, unreadCount: count });
        }
      } catch (err) {
        console.error("Unread count error:", err.message);
        if (typeof callback === "function") {
          callback({ chatId, unreadCount: 0, error: err.message });
        }
      }
    });
    //
    // 3) DELETE MESSAGE
    //
    socket.on("deleteMessage", async ({ messageId, receiverId }, callback) => {
      try {
        await deletePrivateMessage({ messageId });
        // Notify both
        socket.emit("messageDeleted", { messageId });
        io.to(receiverId).emit("messageDeleted", { messageId });
        callback?.({ status: "ok", messageId });
      } catch (err) {
        console.error("deleteMessage failed:", err);
        callback?.({ status: "failed", error: err.message });
      }
    });


    //
    // 5) READ RECEIPTS
    //
    socket.on("markAsRead", async ({ chatId }, callback) => {
      try {
        // Mark DB
        await Message.updateMany(
          { chatId, receiver: me, read: false },
          { $set: { read: true } }
        );
        // Notify other participant
        const chat = await Chat.findById(chatId);
        const other = chat.participants.find((id) => id.toString() !== me.toString());
        io.to(other.toString()).emit("messagesRead", { chatId });
        callback?.({ status: "ok" });
      } catch (err) {
        console.error("markAsRead failed:", err);
        callback?.({ status: "failed", error: err.message });
      }
    });

    //
    // 6) HEARTBEAT & OFFLINE
    //
    socket.on("ping", () => {
      activeUsers.get(socket.id).lastActive = new Date();
    });
    socket.on("disconnect", (reason) => {
      const disconnectedUser = activeUsers.get(socket.id);
      if (!disconnectedUser) return;

      activeUsers.delete(socket.id);

      const stillConnected = [...activeUsers.values()].some(
        (user) => user.userId === disconnectedUser.userId
      );
    
      if (!stillConnected) {
        socket.broadcast.emit("userOffline", { userId: disconnectedUser.userId });
      }
    
      console.log(`Socket ${socket.id} disconnected (${reason})`);
    });
  });

  // Cleanup stale sockets
  setInterval(() => {
    const now = Date.now();
    activeUsers.forEach((u, sid) => {
      if (now - u.lastActive.getTime() > 30000) {
        io.sockets.sockets.get(sid)?.disconnect(true);
      }
    });
  }, 15000);

  return io;
};


module.exports = { initializeSocket, getIO: () => io, activeUsers };
