// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';

// const ChatInterface = () => {
//   const [activeChat, setActiveChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const messagesEndRef = useRef(null);
//   const chatss = useSelector(state => state.chats); 

//   const [chats, setChats] = useState([
//     {
//       id: 1,
//       name: 'John Doe',
//       avatar: 'https://via.placeholder.com/50',
//       online: true,
//       unread: 2,
//       lastMessage: 'Hey, how are you?',
//       messages: [
//         { id: 1, text: 'Hey, how are you?', sender: 'them', timestamp: '09:30' },
//         { id: 2, text: 'I\'m good, thanks!', sender: 'me', timestamp: '09:31', status: 'read' },
//       ]
//     },
//     {
//       id: 2,
//       name: 'Jane Smith',
//       avatar: 'https://via.placeholder.com/50',
//       online: false,
//       unread: 0,
//       lastMessage: 'See you tomorrow!',
//       messages: [
//         { id: 1, text: 'Meeting tomorrow?', sender: 'them', timestamp: '10:15' },
//         { id: 2, text: 'Yes, see you then!', sender: 'me', timestamp: '10:16', status: 'read' },
//       ]
//     }
//   ]);

//   // Auto-scroll to bottom when messages change
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Handle chat selection
//   const handleSelectChat = (chat) => {
//     setActiveChat(chat);
//     setMessages(chat.messages);
//     // Mark as read
//     setChats(prevChats => prevChats.map(c => 
//       c.id === chat.id ? { ...c, unread: 0 } : c
//     ));
//   };

//   // Handle sending messages
//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     const newMsg = {
//       id: messages.length + 1,
//       text: newMessage,
//       sender: 'me',
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       status: 'sent'
//     };

//     // Update messages
//     setMessages([...messages, newMsg]);
    
//     // Update chat list
//     setChats(prevChats => prevChats.map(chat => 
//       chat.id === activeChat.id ? {
//         ...chat,
//         lastMessage: newMessage,
//         messages: [...chat.messages, newMsg]
//       } : chat
//     ));

//     setNewMessage('');
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Left Sidebar - Chat List */}
//       <div className="w-1/3 bg-white border-r border-gray-200">
//         <div className="p-4 bg-gray-50 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
//         </div>
        
//         <div className="overflow-y-auto h-[calc(100vh-4rem)]">
//           {chats.map(chat => (
//             <div
//               key={chat.id}
//               onClick={() => handleSelectChat(chat)}
//               className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
//                 activeChat?.id === chat.id ? 'bg-blue-50' : ''
//               }`}
//             >
//               <div className="relative">
//                 <img
//                   src={chat.avatar}
//                   alt="User avatar"
//                   className="w-12 h-12 rounded-full"
//                 />
//                 {chat.online && (
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 )}
//               </div>
              
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold text-gray-800">{chat.name}</h3>
//                   <span className="text-xs text-gray-500">
//                     {chat.messages[chat.messages.length - 1]?.timestamp}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600 truncate">
//                     {chat.lastMessage}
//                   </p>
//                   {chat.unread > 0 && (
//                     <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
//                       {chat.unread}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Side - Active Chat */}
//       <div className="flex-1 flex flex-col">
//         {activeChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 bg-white border-b border-gray-200 flex items-center">
//               <img
//                 src={activeChat.avatar}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div className="ml-3">
//                 <h2 className="font-semibold text-gray-800">{activeChat.name}</h2>
//                 <p className="text-sm text-gray-600">
//                   {activeChat.online ? 'online' : 'offline'}
//                 </p>
//               </div>
//             </div>

//             {/* Messages Container */}
//             <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//               {messages.map(message => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
//                 >
//                   <div
//                     className={`max-w-[70%] p-3 rounded-lg ${
//                       message.sender === 'me'
//                         ? 'bg-blue-500 text-white rounded-br-none'
//                         : 'bg-white border rounded-bl-none'
//                     }`}
//                   >
//                     <p className="text-sm">{message.text}</p>
//                     <div className="flex items-center justify-end gap-2 mt-2">
//                       <span className="text-xs opacity-70">{message.timestamp}</span>
//                       {message.sender === 'me' && (
//                         <span className="text-xs">
//                           {message.status === 'read' ? '✓✓' : '✓'}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="p-4 bg-white border-t border-gray-200">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-gray-50">
//             <div className="text-center text-gray-500">
//               <p className="text-lg">Select a chat to start messaging</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;






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
  const isProduction = process.env.NODE_ENV === "production";

  const clientOrigins = isProduction
    ? [
      "https://event-hub-vercel.vercel.app",
      "https://event-hub-admin.vercel.app",
    ]
    : [
      "http://localhost:3000",
      "http://localhost:5173",
    ];

  io = new Server(server, {
    cors: {
      origin: clientOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
  });
};

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
