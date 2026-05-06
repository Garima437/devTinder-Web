import { io } from "socket.io-client";

const Socket_Url = "http://13.60.253.32";

const socketInstance = io(Socket_Url, {
  withCredentials: true,
  transports: ["websocket"],
  path: "/socket.io/",
  autoConnect: false
});

export default socketInstance;
