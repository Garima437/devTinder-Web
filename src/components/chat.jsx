import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Base_Url, Socket_Url } from "../utils/constants";

const Chat = () => {
  const { connectionId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // 1. Fetch Chat History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${Base_Url}/user/chat/${connectionId}`, {
          withCredentials: true,
        });
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("History Load Error:", err);
      }
    };
    if (connectionId) fetchHistory();
  }, [connectionId]);

  // 2. Setup Real-time Connection
  useEffect(() => {
    if (!user?._id || !connectionId || !Socket_Url) return;

    const socketInstance = io(Socket_Url, {
      withCredentials: true,
      transports: ["websocket"],
      path: "/socket.io/",
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("⚡ Connected!");
      socketInstance.emit("joinChat", { connectionId });
    });

    socketInstance.on("messageReceived", (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some((m) => m._id === msg._id);
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [connectionId, user?._id]);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message via Socket
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const messageData = {
      connectionId,
      senderId: user?._id,
      text: input,
    };

    socketRef.current.emit("sendMessage", messageData);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black text-white mt-16 max-w-4xl mx-auto border-x border-white/5">
      <div className="p-4 bg-zinc-900/50 backdrop-blur-md border-b border-white/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
          {connectionId?.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-sm">Developer Chat</h2>
          <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?._id || msg.senderId?._id === user?._id;
          return (
            <div key={msg._id || index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
              <div className={`chat-bubble max-w-xs md:max-w-md ${isMe ? "bg-blue-600 text-white" : "bg-zinc-800 text-gray-200"}`}>
                {msg.text}
              </div>
              <div className="chat-footer opacity-50 text-[10px] mt-1">
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-zinc-900/50 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl font-bold transition-colors active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;