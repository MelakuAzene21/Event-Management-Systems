import { io } from "socket.io-client";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://event-management-systems-gj91.onrender.com"
    : "http://localhost:5000",
  {
    withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
  }
);


// This will hold the ping interval ID
let pingInterval;

export const startPing = () => {
  console.log("startping now")
  // Avoid multiple intervals
  if (pingInterval) clearInterval(pingInterval);

  pingInterval = setInterval(() => {
    console.log("startping alreafy")
    socket.emit("ping");
  }, 2000); // every 20 seconds
};

export const stopPing = () => {
  if (pingInterval) clearInterval(pingInterval);
};

export default socket;
