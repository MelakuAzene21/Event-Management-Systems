import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectChat ,addMessage,setOnlineUsers,markMessagesAsRead,updateMessageReadStatus,setUserOffline,setUserOnline,editMessage ,decreaseUnreadCount} from '../features/slices/chatSlice';
import moment from 'moment'; // Make sure you import moment
import socket from '../lib/socket'; 
import { useSearchParams } from "react-router-dom";


const ChatInterface = () => {
  const firstUnreadRef = useRef(null);
const [searchParams] = useSearchParams();
const chatIdFromURL = searchParams.get("chatId");  // get chatId query param


  const [isEditing, setIsEditing] = useState(false);
const [editedMessageId, setEditedMessageId] = useState(null);
const [editedMessageText, setEditedMessageText] = useState('');



  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const chats = useSelector(state => state.chats.chats);
  const activeChatId = useSelector(state => state.chats.activeChatId);
  const onlineUsers = useSelector(state => state.chats.onlineUsers);
  const activeChat = chats.find(chat => chat._id === activeChatId);
  const messages = activeChat?.messages || [];

  const currentUser = useSelector(state => state.auth.user);
  const currentUserId = currentUser?._id;
  // const opponent = activeChat.participants.find(p => p._id.toString() !== currentUserId);
  // console.log("check," ,opponent);
  // const opponentId = opponent?._id;

  const [newMessage, setNewMessage] = useState('');
const hasHandledUrlChatRef = useRef(false);

  // const currentUserId = useSelector(state => state.auth.user._id);
  const senderModel = currentUser?.role;
  console.log('here we go',senderModel);
useEffect(() => {
  if (chatIdFromURL && !hasHandledUrlChatRef.current) {
    dispatch(selectChat(chatIdFromURL));
    hasHandledUrlChatRef.current = true; // prevent it from running again
  }
}, [chatIdFromURL, dispatch]);

//addedd 
const handleEditMessage = (message) => {
  setIsEditing(true);
  setEditedMessageId(message._id);
  setEditedMessageText(message.text);
};


const confirmEditMessage = () => {
  if (!editedMessageText.trim()) return;
    const receiver = activeChat?.participants.find(p => p._id !== currentUserId); // Get the receiver based on participants
  socket.emit("editMessage", {
    messageId: editedMessageId,
    newText: editedMessageText,
    chatId: activeChatId,
      receiverId: receiver?._id, // Receiver ID
  });

  setIsEditing(false);
  setEditedMessageId(null);
  setEditedMessageText("");
};



const cancelEditMessage = () => {
  setIsEditing(false);
  setEditedMessageId(null);
  setEditedMessageText('');
};


useEffect(() => {
  socket.on("messageEdited", ({ chatId, messageId, text }) => {
    dispatch(editMessage({ chatId, messageId, text }));
  });

  return () => {
    socket.off("messageEdited");
  };
}, [dispatch]);



  useEffect(() => {
    // Scroll to the last message initially, after selecting a chat
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

   useEffect(() => {
    socket.on("messageDelivered", ({ chatId, message }) => {
      dispatch(addMessage({ chatId, message, currentUserId }));
    });
  }, [dispatch, currentUserId]);

  

useEffect(() => {
  const handlePrivateMessage = (message) => {
    dispatch(addMessage({ chatId: message.chatId, message, currentUserId }));
  };

  socket.on("privateMessage", handlePrivateMessage);

  // ✅ Clean up the listener when component unmounts or dependencies change
  return () => {
    socket.off("privateMessage", handlePrivateMessage);
  };
}, [dispatch, currentUserId]);

  
  useEffect(() => {
    socket.on("messages:read:update", ({ chatId, messageIds, status }) => {
      dispatch(updateMessageReadStatus({ chatId, messageIds, status }));
    });
  
    return () => {
      socket.off("messages:read:update");
    };
  }, []);

  const handleSelectChat = (chat) => {
    const chatId = chat._id;
    dispatch(selectChat(chatId));
  
    // Scroll to the first unread message (if any)
    const firstUnreadMessage = chat.messages.find((message) => {
      return message.status !== "read"; // Assuming status reflects current user
    });
  
    if (firstUnreadMessage) {
      const messageIndex = chat.messages.indexOf(firstUnreadMessage);
      const unreadMessageRef = unreadMessageRefs.current[messageIndex];
      if (unreadMessageRef) {
        unreadMessageRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  
//added 1
const [readMessages, setReadMessages] = useState(new Set());

// 🧠 Setup
const unreadMessageRefs = useRef({});
const [visibleUnreadMessageIds, setVisibleUnreadMessageIds] = useState(new Set());

useEffect(() => {

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const messageId = entry.target.dataset.messageId;
          const message = messages.find(msg => msg._id === messageId);

          // ✅ Only add if the message is not already read by current user
          if (message && message.status !== "read") {
            setVisibleUnreadMessageIds(prev => new Set(prev).add(messageId));
          }{
            setVisibleUnreadMessageIds(prev => new Set(prev).add(messageId));
          }
        }
      });
    },
    { threshold: 0.6 }
  );

  messages.forEach((msg, idx) => {
    const el = unreadMessageRefs.current[idx];
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [messages, currentUserId]);


//added 2
useEffect(() => {
  const interval = setInterval(() => {
    if (visibleUnreadMessageIds.size > 0) {
      const unreadIds = Array.from(visibleUnreadMessageIds);
  const opponent = activeChat.participants.find(p => p._id.toString() !== currentUserId);
        const opponentId = opponent?._id;
      socket.emit('messages:read', {
        chatId: activeChatId,
        messageIds: unreadIds,
        userId: currentUserId,
        sender: senderModel,
        opponentId  
      });
      dispatch(decreaseUnreadCount({
  chatId: activeChatId,
  count: unreadIds.length
}));


      // ✅ Clear after sending
      setVisibleUnreadMessageIds(new Set());
    }
  }, 1000);

  return () => clearInterval(interval);
}, [visibleUnreadMessageIds, currentUserId, activeChatId]);



// useEffect(() => {
//   const interval = setInterval(() => {
//     if (readMessages.size > 0) {
//       const messageIds = Array.from(readMessages);
//       socket.emit('messages:read', {
//         chatId: activeChatId,
//         messageIds,
//         userId: currentUserId,
//         sender: senderModel,
//         opponentId  // pass opponentId to backend
//       });
//       setReadMessages(new Set()); // clear sent IDs
//     }
//   }, 1000);

//   return () => clearInterval(interval);
// }, [readMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChatId) return;
  
    const receiver = activeChat?.participants.find(p => p._id !== currentUserId); // Get the receiver based on participants
      console.log("check 1," ,receiver);
    const messageData = {
      senderId: currentUserId,  // The ID of the current user
      receiverId: receiver?._id, // Receiver ID
      text: newMessage, // The message text
      chatId: activeChatId, // Active Chat ID
      senderModel
    };
  
    // Emit the message to the backend via socket
    socket.emit('privateMessage', messageData);
  
    // Clear the message input
    setNewMessage('');
  };

  return (
   <div className="flex h-screen bg-gray-100">
  {/* Left Sidebar - Chat List */}
  <div className="w-1/3 bg-white shadow-sm">
    <div className="p-4 bg-gray-50 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
    </div>

    <div className="overflow-y-auto h-[calc(100vh-4rem)]">
      {chats.map(chat => {
        const receiver = chat.participants.find(p => p._id !== currentUserId);
        const lastMessage = chat.messages[chat.messages.length - 1];

        return (
          <div
            key={chat._id}
            onClick={() => handleSelectChat(chat)}
            className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer shadow-sm mb-1 rounded-md ${
              activeChatId === chat._id ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="relative">
              <img
                src={receiver?.avatar}
                alt="User avatar"
                className="w-12 h-12 rounded-full"
              />
              {onlineUsers.includes(receiver?._id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{receiver?.name}</h3>
                <span className="text-xs text-gray-500">
                  {lastMessage?.createdAt ? moment.utc(lastMessage.createdAt).format('h:mm A') : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                {lastMessage?.text ? (
                  <p className="text-sm text-gray-600 truncate">{lastMessage.text}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic opacity-70">No message yet</p>
                )}
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Right Side - Active Chat */}
  <div className="flex-1 flex flex-col">
    {activeChat ? (
      <>
        {/* Chat Header */}
        <div className="p-4 bg-white shadow-sm flex items-center">
          {(() => {
            const receiver = activeChat.participants.find(p => p._id !== currentUserId);

            return (
              <>
                <img
                  src={receiver?.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h2 className="font-semibold text-gray-800">{receiver?.name}</h2>
                  <p className={`text-sm ${onlineUsers.includes(receiver?._id) ? 'text-green-500' : 'text-gray-600'}`}>
                    {onlineUsers.includes(receiver?._id) ? 'online' : 'offline'}
                  </p>
                </div>
              </>
            );
          })()}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, idx) => {
            const isCurrentUser = message.sender === currentUserId;
            const sender = isCurrentUser
              ? currentUser
              : activeChat.participants.find(p => p._id === message.sender);
            const showAvatar = idx === 0 || messages[idx - 1].sender !== message.sender;

            const opponent = activeChat.participants.find(p => p._id.toString() !== currentUserId);
            const opponentId = opponent?._id;
            const isUnread = !message.readBy?.includes(opponentId);

            return (
              <div
                key={message._id || idx}
                ref={el => unreadMessageRefs.current[idx] = el}
                data-message-id={message._id}
                className={`group flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2 relative`}
              >
                {(!isCurrentUser || showAvatar) && (
                  <img
                    src={sender?.avatar}
                    alt={sender?.name}
                    className="w-8 h-8 rounded-full mr-2 self-end"
                  />
                )}

                <div
                  onClick={() => isCurrentUser && !isEditing && handleEditMessage(message)}
                  className={`max-w-[70%] p-3 rounded-lg cursor-pointer shadow-md transition duration-150 hover:opacity-90 ${
                    isCurrentUser
                      ? 'bg-blue-100 text-gray-900 rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {isEditing && editedMessageId === message._id ? (
                    <p className="text-sm">{message.text}</p>
                  ) : (
                    <>
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-80">
                        <span>{moment(message.createdAt).local().format('h:mm A')}</span>
                        {message.edited && <span className="ml-2 text-[10px] italic">edited</span>}
                        {isCurrentUser && (
                          <span>{message.status === 'read' ? '✓✓' : '✓'}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white shadow-inner">
          <div className="flex flex-col gap-1 w-full">
            {isEditing && (
              <div className="text-xs text-blue-600 font-medium ml-2 flex items-center justify-between">
                <span>Editing message...</span>
                <button
                  onClick={cancelEditMessage}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={isEditing ? editedMessageText : newMessage}
                onChange={(e) => {
                  const value = e.target.value;
                  isEditing ? setEditedMessageText(value) : setNewMessage(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    isEditing ? confirmEditMessage() : handleSendMessage();
                  }
                }}
                placeholder={isEditing ? "Edit your message..." : "Type a message..."}
                className={`flex-1 p-3 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 text-black ${
                  isEditing ? 'focus:ring-blue-400 text-blue-600 font-medium' : 'focus:ring-gray-300'
                }`}
              />

              {isEditing ? (
                <button
                  onClick={confirmEditMessage}
                  className="p-2 text-blue-600 hover:text-green-500 transition-colors text-xl font-bold"
                >
                  ✔
                </button>
              ) : (
                <button
  onClick={handleSendMessage}
  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6 transform rotate-90 text-gray-700"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
  />
</svg>

</button>

              )}
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default ChatInterface;





























// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectChat ,addMessage,setOnlineUsers,markMessagesAsRead,updateMessageReadStatus,setUserOffline,setUserOnline } from '../features/slices/chatSlice';
// import moment from 'moment'; // Make sure you import moment
// import socket from '../lib/socket'; 
// const ChatInterface = () => {
//   const unreadMessageRefs = useRef({});
//   const firstUnreadRef = useRef(null);

//   const [editingMessageId, setEditingMessageId] = useState(null);
// const [editedMessageText, setEditedMessageText] = useState('');
// const [messageToDelete, setMessageToDelete] = useState(null); // for modal

//   const dispatch = useDispatch();
//   const messagesEndRef = useRef(null);

//   const chats = useSelector(state => state.chats.chats);
//   const activeChatId = useSelector(state => state.chats.activeChatId);
//   const onlineUsers = useSelector(state => state.chats.onlineUsers);
//   const activeChat = chats.find(chat => chat._id === activeChatId);
//   const messages = activeChat?.messages || [];

//   const [newMessage, setNewMessage] = useState('');

//   const currentUser = useSelector(state => state.auth.user);
//   const currentUserId = currentUser?._id;
//   // const currentUserId = useSelector(state => state.auth.user._id);
//   const senderModel = currentUser?.role;
//   console.log('here we go',senderModel);



  
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//    useEffect(() => {
//     socket.on("messageDelivered", ({ chatId, message }) => {
//       dispatch(addMessage({ chatId, message, currentUserId }));
//     });

//     return () => {
//       socket.off("messageDelivered");
//     };
//   }, [dispatch, currentUserId]);

  


//   useEffect(() => {
//     socket.on("privateMessage", (message) => {
//       dispatch(addMessage({ chatId: message.chatId, message, currentUserId }));
//     });
  
//     return () => {
//       socket.off("privateMessage");
//     };
//   }, [dispatch, currentUserId]);
  
//   useEffect(() => {
//     socket.on("messages:read:update", ({ chatId, messageIds, status }) => {
//       dispatch(updateMessageReadStatus({ chatId, messageIds, status }));
//     });
  
//     return () => {
//       socket.off("messages:read:update");
//     };
//   }, []);

//   const handleSelectChat = (chat) => {
  
//     const chatId = chat._id;  // Get chatId from the selected chat
//     dispatch(selectChat(chat._id));
//     // Optional: Dispatch mark-as-read logic
//     if (chat.unreadCount > 0) {
//       const opponent = chat.participants.find(p => p._id.toString() !== currentUserId);
//       const opponentId = opponent?._id;
//       console.log('here it ',opponentId);
//             const messageIds = chat.messages.slice(-chat.unreadCount).map(m => m._id);
//       dispatch(markMessagesAsRead({
//         chatId,
//         userId: currentUserId,
//         senderModel
//       }));
    
//       socket.emit('messages:read', {
//         chatId,
//         messageIds,
//         userId: currentUserId,
//         sender:senderModel,
//         opponentId  // 🆕 pass this to backend
//       });
      
//     }
    
//   };

//   const handleEditMessage = (message) => {
//     setEditingMessageId(message._id);
//     setEditedMessageText(message.text);
//   };
  
//   const confirmEdit = (message) => {
//     if (!editedMessageText.trim()) return;
    
//     const updatedMessage = {
//       ...message,
//       text: editedMessageText,
//       edited: true,
//     };
  
//     socket.emit('editMessage', updatedMessage);
//     setEditingMessageId(null);
//     setEditedMessageText('');
//   };
  
//   const cancelEdit = () => {
//     setEditingMessageId(null);
//     setEditedMessageText('');
//   };
  
//   const confirmDeleteMessage = () => {
//     if (!messageToDelete) return;
//     socket.emit('deleteMessage', {
//       messageId: messageToDelete._id,
//       chatId: messageToDelete.chatId,
//     });
//     setMessageToDelete(null);
//   };
  

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !activeChatId) return;
  
//     const receiver = activeChat?.participants.find(p => p._id !== currentUserId); // Get the receiver based on participants
//     const messageData = {
//       senderId: currentUserId,  // The ID of the current user
//       receiverId: receiver?._id, // Receiver ID
//       text: newMessage, // The message text
//       chatId: activeChatId, // Active Chat ID
//       senderModel
//     };
  
//     // Emit the message to the backend via socket
//     socket.emit('privateMessage', messageData);
  
//     // Clear the message input
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
//           {chats.map(chat => {
//             const receiver = chat.participants.find(p => p._id !== currentUserId);
//             const lastMessage = chat.messages[chat.messages.length - 1];

//             return (
//               <div
//                 key={chat._id}
//                 onClick={() => handleSelectChat(chat)}
//                 className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
//                   activeChatId === chat._id ? 'bg-blue-50' : ''
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={receiver?.avatar}
//                     alt="User avatar"
//                     className="w-12 h-12 rounded-full"
//                   />
//                   {/* {chat.online && (
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   )} */}
//                   {onlineUsers.includes(receiver?._id) && (
//                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   )}

//                 </div>

//                 <div className="ml-3 flex-1">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-800">{receiver?.name}</h3>
//                     <span className="text-xs text-gray-500">
//                       {lastMessage?.createdAt ? moment.utc(lastMessage.createdAt).format('h:mm A') : ''}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     {lastMessage?.text ? (
//                       <p className="text-sm text-gray-600 truncate">{lastMessage.text}</p>
//                     ) : (
//                       <p className="text-sm text-gray-400 italic opacity-70">No message yet</p>
//                     )}
//                     {chat.unreadCount > 0 && (
//                       <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
//                         {chat.unreadCount}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Right Side - Active Chat */}
//       <div className="flex-1 flex flex-col">
//         {activeChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 bg-white border-b border-gray-200 flex items-center">
//               {(() => {
//                 const receiver = activeChat.participants.find(p => p._id !== currentUserId);
//                 return (
//                   <>
//                     <img
//                       src={receiver?.avatar}
//                       alt="Profile"
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <div className="ml-3">
//                       <h2 className="font-semibold text-gray-800">{receiver?.name}</h2>
//                       <p className={`text-sm ${onlineUsers.includes(receiver?._id) ? 'text-green-500' : 'text-gray-600'}`}>
//                         {onlineUsers.includes(receiver?._id) ? 'online' : 'offline'}
//                      </p>


//                     </div>
//                   </>
//                 );
//               })()}
//             </div>

//             {/* Messages Container */}
//             <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//             {messages.map((message, idx) => {
//   const isCurrentUser = message.sender === currentUserId;
//   const sender = isCurrentUser
//     ? currentUser
//     : activeChat.participants.find(p => p._id === message.sender);
//   const showAvatar = idx === 0 || messages[idx - 1].sender !== message.sender;

//   const isEditing = editingMessageId === message._id;

//   return (
//     <div
//       key={message._id || idx}
//       className={`group flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2 relative`}
//     >
//       {/* Avatar */}
//       {(!isCurrentUser || showAvatar) && (
//         <img
//           src={sender?.avatar}
//           alt={sender?.name}
//           className="w-8 h-8 rounded-full mr-2 self-end"
//         />
//       )}

//       {/* Message bubble */}
//       <div
//         className={`max-w-[70%] p-3 rounded-lg ${
//           isCurrentUser
//             ? 'bg-blue-500 text-white rounded-br-none'
//             : 'bg-white border rounded-bl-none'
//         } relative`}
//       >
//         {isEditing ? (
//           <>
//             <input
//               type="text"
//               value={editedMessageText}
//               onChange={(e) => setEditedMessageText(e.target.value)}
//               className="w-full p-2 rounded bg-white text-black"
//             />
//             <div className="flex justify-end gap-2 mt-2">
//               <button onClick={() => confirmEdit(message)}>✅</button>
//               <button onClick={cancelEdit}>❌</button>
//             </div>
//           </>
//         ) : (
//           <>
//             <p className="text-sm">{message.text}</p>
//             <div className="flex items-center justify-between mt-2 text-xs opacity-80">
//               <span>{moment(message.createdAt).local().format('h:mm A')}</span>
//               {message.edited && <span className="ml-2 text-[10px] italic">edited</span>}
//               {isCurrentUser && (
//                 <span>{message.status === 'read' ? '✓✓' : '✓'}</span>
//               )}
//             </div>
//             {isCurrentUser && (
//               <div className="absolute top-0 right-0 hidden group-hover:flex gap-1 p-1">
//                 <button onClick={() => handleEditMessage(message)} className="text-sm">✏️</button>
//                 <button onClick={() => setMessageToDelete(message)} className="text-sm">🗑️</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// })}

// {messageToDelete && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//     <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80 text-center">
//       <p className="mb-4">🔒 Are you sure you want to delete this message?</p>
//       <div className="flex justify-around mt-4">
//         <button
//           className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
//           onClick={() => setMessageToDelete(null)}
//         >
//           ❌ Cancel
//         </button>
//         <button
//           className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
//           onClick={confirmDeleteMessage}
//         >
//           🗑️ Delete
//         </button>
//       </div>
//     </div>
//   </div>
// )}


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










// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectChat ,addMessage } from '../features/slices/chatSlice';
// import moment from 'moment'; // Make sure you import moment
// import socket from '../lib/socket'; 

// const ChatInterface = () => {
//   const dispatch = useDispatch();
//   const messagesEndRef = useRef(null);

//   const chats = useSelector(state => state.chats.chats);
//   const activeChatId = useSelector(state => state.chats.activeChatId);
//   const activeChat = chats.find(chat => chat._id === activeChatId);
//   const messages = activeChat?.messages || [];

//   const [newMessage, setNewMessage] = useState('');
//   const [editMessageId, setEditMessageId] = useState(null);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [messageToDelete, setMessageToDelete] = useState(null);

//   const currentUser = useSelector(state => state.auth.user);
//   const currentUserId = currentUser?._id;
//   const senderModel = currentUser?.role;
//   console.log('here we go', senderModel);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     socket.on("messageDelivered", ({ chatId, message }) => {
//       dispatch(addMessage({ chatId, message, currentUserId }));
//     });

//     return () => {
//       socket.off("messageDelivered");
//     };
//   }, [dispatch, currentUserId]);

//   const handleSelectChat = (chat) => {
//     dispatch(selectChat(chat._id));
//   };

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !activeChatId) return;

//     const receiver = activeChat?.participants.find(p => p._id !== currentUserId);

//     if (editMessageId) {
//       socket.emit('editMessage', {
//         messageId: editMessageId,
//         newText: newMessage,
//       });
//       setEditMessageId(null);
//     } else {
//       const messageData = {
//         senderId: currentUserId,
//         receiverId: receiver?._id,
//         text: newMessage,
//         chatId: activeChatId,
//         senderModel
//       };
//       socket.emit('privateMessage', messageData);
//     }

//     setNewMessage('');
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 relative">
//       {/* Left Sidebar - Chat List */}
//       <div className="w-1/3 bg-white border-r border-gray-200">
//         <div className="p-4 bg-gray-50 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
//         </div>

//         <div className="overflow-y-auto h-[calc(100vh-4rem)]">
//           {chats.map(chat => {
//             const receiver = chat.participants.find(p => p._id !== currentUserId);
//             const lastMessage = chat.messages[chat.messages.length - 1];

//             return (
//               <div
//                 key={chat._id}
//                 onClick={() => handleSelectChat(chat)}
//                 className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
//                   activeChatId === chat._id ? 'bg-blue-50' : ''
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={receiver?.avatar}
//                     alt="User avatar"
//                     className="w-12 h-12 rounded-full"
//                   />
//                   {chat.online && (
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   )}
//                 </div>

//                 <div className="ml-3 flex-1">
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-800">{receiver?.name}</h3>
//                     <span className="text-xs text-gray-500">
//                       {lastMessage?.createdAt ? moment.utc(lastMessage.createdAt).format('h:mm A') : ''}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     {lastMessage?.text ? (
//                       <p className="text-sm text-gray-600 truncate">{lastMessage.text}</p>
//                     ) : (
//                       <p className="text-sm text-gray-400 italic opacity-70">No message yet</p>
//                     )}
//                     {chat.unreadCount > 0 && (
//                       <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
//                         {chat.unreadCount}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Right Side - Active Chat */}
//       <div className="flex-1 flex flex-col">
//         {activeChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 bg-white border-b border-gray-200 flex items-center">
//               {(() => {
//                 const receiver = activeChat.participants.find(p => p._id !== currentUserId);
//                 return (
//                   <>
//                     <img
//                       src={receiver?.avatar}
//                       alt="Profile"
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <div className="ml-3">
//                       <h2 className="font-semibold text-gray-800">{receiver?.name}</h2>
//                       <p className="text-sm text-gray-600">
//                         {activeChat.online ? 'online' : 'offline'}
//                       </p>
//                     </div>
//                   </>
//                 );
//               })()}
//             </div>

//             {/* Messages Container */}
//             <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
//               {messages.map((message, idx) => {
//                 const isCurrentUser = message.sender === currentUserId;
//                 return (
//                   <div
//                     key={message._id || idx}
//                     className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 relative group`}
//                   >
//                     <div
//                       className={`max-w-[70%] p-3 rounded-lg ${
//                         isCurrentUser
//                           ? 'bg-blue-500 text-white rounded-br-none'
//                           : 'bg-white border rounded-bl-none'
//                       }`}
//                     >
//                       <p className="text-sm">{message.text}</p>
//                       <div className="flex items-center justify-end gap-2 mt-2">
//                         {message.edited && <span className="text-xs italic mr-1 opacity-70">edited</span>}
//                         <span className="text-xs opacity-70">
//                           {moment(message.createdAt).local().format('h:mm A')}
//                         </span>
//                         {isCurrentUser && (
//                           <span className="text-xs">{message.status === 'read' ? '✓✓' : '✓'}</span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Edit/Delete Menu */}
//                     {isCurrentUser && (
//                       <div className="absolute top-0 right-0 hidden group-hover:flex flex-col gap-1 bg-white shadow-lg border p-2 rounded z-10">
//                         <button
//                           onClick={() => {
//                             setEditMessageId(message._id);
//                             setNewMessage(message.text);
//                           }}
//                           className="text-sm text-blue-600 hover:underline"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => {
//                             setMessageToDelete(message);
//                             setShowConfirmDelete(true);
//                           }}
//                           className="text-sm text-red-600 hover:underline"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Delete Confirmation Popup */}
//             {showConfirmDelete && (
//               <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border shadow-lg p-6 rounded z-50">
//                 <p className="text-center mb-4">Are you sure you want to delete this message?</p>
//                 <div className="flex justify-center gap-4">
//                   <button
//                     onClick={() => {
//                       socket.emit('deleteMessage', { messageId: messageToDelete._id });
//                       setShowConfirmDelete(false);
//                       setMessageToDelete(null);
//                     }}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Yes
//                   </button>
//                   <button
//                     onClick={() => setShowConfirmDelete(false)}
//                     className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//                   >
//                     No
//                   </button>
//                 </div>
//               </div>
//             )}

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
