import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Base_Url } from "../utils/constants";

const Chat = () => {
  const { connectionId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

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

  useEffect(() => {
    if (!user?._id || !connectionId) return;

    // 🔥 NO VARIABLES - DIRECT STRING FIX
    const socketInstance = io("http://13.60.253.32", {
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
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, [connectionId, user?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit("sendMessage", {
      connectionId,
      senderId: user?._id,
      text: input,
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black text-white mt-16 max-w-4xl mx-auto border-x border-white/5">
      <div className="p-4 bg-zinc-900/50 backdrop-blur-md border-b border-white/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">CH</div>
        <div>
          <h2 className="font-bold text-sm">Developer Chat</h2>
          <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={msg._id || index} className={`chat ${msg.senderId === user?._id ? "chat-end" : "chat-start"}`}>
            <div className={`chat-bubble ${msg.senderId === user?._id ? "bg-blue-600" : "bg-zinc-800"}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-4 bg-zinc-900/50 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-zinc-800 border-none rounded-xl px-4 py-3 text-white outline-none"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="bg-blue-600 px-6 rounded-xl font-bold">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;