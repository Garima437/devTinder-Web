import { io } from "socket.io-client";

// Explicitly add port 3000
const socket = io("http://13.60.253.32", {
  withCredentials: true,
  transports: ["websocket"] // Helps bypass some proxy issues
});

export default socket;