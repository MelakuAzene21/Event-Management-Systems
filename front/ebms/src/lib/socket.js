import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false, // Important to prevent connecting before setting token
  transports: ["websocket"],
});

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
