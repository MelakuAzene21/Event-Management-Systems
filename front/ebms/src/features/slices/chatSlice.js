// src/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserChats = createAsyncThunk(
  'chats/fetchUserChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/chats', {
        withCredentials: true,
      });
      console.log(response.data);
      return response.data; // Directly return raw API response
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch chats');
    }
  }
);

const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],  
    onlineUsers: [],  // MUST be here          
    activeChatId: null,     // used to mark which chat is open
    loading: false,
    error: null,
  },
  
  reducers: {

    setUserOnline(state, action) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    setOnlineUsers(state, action) {
      // Replace the entire onlineUsers list
      state.onlineUsers = action.payload;
    },
    setUserOffline(state, action) {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );
    },
    resetChats: (state) => {
      state.chats = [];
      state.activeChatId = null;
      state.loading = false;
      state.error = null;
    },
    selectChat: (state, action) => {
      state.activeChatId = action.payload;
      const chat = state.chats[action.payload];
      if (chat) {
        chat.unreadCount = 0;
      }
    },

    addMessage: (state, action) => {
      const { chatId, message, currentUserId } = action.payload;
    
      const chat = state.chats.find((chat) => chat._id === chatId);
      if (chat) {
        const completeMessage = {
          ...message,
          text: message.text || message.content || "",
          chatId: chatId,
          status: message.status || 'sent',
          readBy: message.readBy || [],
          edited: message.edited ?? false,
          createdAt: message.createdAt || new Date().toISOString(),
        };
    
        chat.messages.push(completeMessage);
        chat.latestMessage = completeMessage;
    
        if (completeMessage.receiver == currentUserId) {
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        }
      }
    },
    addChat: (state, action) => {
      const chat = action.payload;
    
      const normalizedChat = {
        _id: chat._id,
        participants: chat.participants,
        messages: chat.messages || [],
        unreadCount: 0,
        latestMessage: chat.latestMessage
      };
    
      state.chats.push(normalizedChat);
    },
    markMessagesAsRead: (state, action) => {
      const { chatId, userId, senderModel } = action.payload;
      console.log("🟡 [Reducer] updateMessageReadStatus called with:", action.payload);

      // Find the chat
      const chat = state.chats.find(chat => chat._id === chatId);
      if (!chat || chat.unreadCount === 0) return;
    
      // Sort messages just in case they're not ordered (optional but safe)
      const unreadMessages = [...chat.messages]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-chat.unreadCount);
    
      unreadMessages.forEach(msg => {
        const alreadyRead = msg.readBy.some(entry => String(entry.userId) === String(userId));
    
        if (!alreadyRead) {
          msg.readBy.push({
            userId,
            model: senderModel
          });
          msg.status = 'read';
          console.log(`✅ Updating message ${msg._id} to status: ${msg.status}`);

        }
      });
    
      chat.unreadCount = 0;
    },
    deleteMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      const chat = state.chats.find(c => c._id === chatId);
    
      if (!chat) return;
    
      const remainingMessages = chat.messages.filter(m => m._id !== messageId);
      chat.messages = remainingMessages;
    
      const wasLatest = chat.latestMessage?._id === messageId;
      if (wasLatest) {
        chat.latestMessage = remainingMessages[remainingMessages.length - 1] || null;
      }
    },    
    updateMessageReadStatus: (state, action) => {
      const { chatId, messageIds, status } = action.payload;
    
      const chat = state.chats.find(c => c._id === chatId);
      if (!chat) return;
    
      chat.messages.forEach(msg => {
        if (messageIds.includes(msg._id)) {
          msg.status = status;
          // We do NOT modify readBy, since this update is for the sender
        }
      });
    },
    // updateMessageStatus: (state, action) => {
    //   const { chatId, messageId, status, currentUser } = action.payload;
      
    //   state.chats = state.chats.map(chat => {
    //     if (chat._id === chatId) {
    //       const updatedMessages = chat.messages.map(message => {
    //         if (message._id === messageId) {
    //           const isReceiver = 
    //             message.receiver.toString() === currentUser.id &&
    //             message.receiverModel === currentUser.model;

    //           const existingReadEntry = message.readBy.find(entry => 
    //             entry.userId.toString() === currentUser.id &&
    //             entry.model === currentUser.model
    //           );

    //           const newReadBy = isReceiver && !existingReadEntry
    //             ? [...message.readBy, {
    //                 userId: currentUser.id,
    //                 model: currentUser.model
    //               }]
    //             : message.readBy;

    //           return {
    //             ...message,
    //             status,
    //             readBy: newReadBy
    //           };
    //         }
    //         return message;
    //       });

    //       const targetMessage = chat.messages.find(m => m._id === messageId);
    //       const shouldDecrement = targetMessage && 
    //         targetMessage.receiver.toString() === currentUser.id &&
    //         targetMessage.receiverModel === currentUser.model &&
    //         status === 'read';

    //       const updatedLatestMessage = chat.latestMessage?._id === messageId
    //         ? { ...chat.latestMessage, status }
    //         : chat.latestMessage;

    //       return {
    //         ...chat,
    //         messages: updatedMessages,
    //         latestMessage: updatedLatestMessage,
    //         unreadCount: shouldDecrement
    //           ? Math.max(0, chat.unreadCount - 1)
    //           : chat.unreadCount
    //       };
    //     }
    //     return chat;
    //   });
    // }
    updateMessageReadStatus: (state, action) => {
      const { chatId, messageIds, status } = action.payload;
    
      const chat = state.chats.find(c => c._id === chatId);
      if (!chat) return;
    
      chat.messages.forEach(msg => {
        if (messageIds.includes(msg._id)) {
          msg.status = status;
          // We do NOT modify readBy, since this update is for the sender
        }
      });
    },
    decreaseUnreadCount: (state, action) => {
  const { chatId, count } = action.payload;
  const chat = state.chats.find(c => c._id === chatId);
  if (!chat) return;

  chat.unreadCount = Math.max(0, chat.unreadCount - count);
},
editMessage: (state, action) => {
  const { chatId, messageId, text } = action.payload;

  const chat = state.chats.find((c) => c._id === chatId);
  if (!chat) return;

  const message = chat.messages.find((m) => m._id === messageId);
  if (!message) return;

  message.text = text;
  message.edited = true;
  message.updatedAt = new Date().toISOString(); // optional for UI timestamp
},
   updateMessage: (state, action) => {
      const { chatId, updatedMessage } = action.payload;
    
      state.chats = state.chats.map(chat => {
        if (chat._id === chatId) {
          // Update messages by checking message ID
          const updatedMessages = chat.messages.map(message =>
            message._id === updatedMessage._id
              ? {
                  ...message,
                  ...updatedMessage,
                  edited: true,  // Mark as edited
                }
              : message
          );
    
          // Update latest message if necessary
          const latestMessage = chat.latestMessage?._id === updatedMessage._id
            ? { ...updatedMessage, content: updatedMessage.text || updatedMessage.content }
            : chat.latestMessage;
    
          return {
            ...chat,
            messages: updatedMessages,
            latestMessage,
          };
        }
    
        return chat;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        if (state.chats.length > 0) {
          console.log("First message text:", state.chats
          );
        }
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetChats,
  selectChat,
  setMessages,
  addMessage,
  addChat,
  markMessagesAsRead,
  updateTypingStatus,
  updateMessageStatus,
  updateMessageReadStatus,
  updateMessage,
  setUserOnline,
  setOnlineUsers,
decreaseUnreadCount,
  setUserOffline,
  editMessage
} = chatSlice.actions;

export default chatSlice.reducer;
