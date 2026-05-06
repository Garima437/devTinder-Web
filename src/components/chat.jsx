import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Base_Url } from "../utils/constants";

const EMOJIS = [
  "😀","😂","🤣","😍","🥰","😘","😎","🤩","🥳","😜",
  "❤️","🧡","💛","💚","💙","💜","🖤","💕","💞","💯",
  "👍","👎","👏","🙌","🤝","🙏","💪","✌️","🤞","👌",
  "🔥","⚡","✨","🌟","💫","🎉","🎊","🎯","🚀","💥",
  "😭","😤","🤔","🤯","😱","🤗","😴","🥺","😏","😒",
  "🍕","🍔","🍦","🎂","🍜","☕","🧋","🍷","🎮","💻"
];

const Chat = () => {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(() => {
    try {
      const cached = sessionStorage.getItem("chat_user_" + window.location.pathname);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [showEmoji, setShowEmoji] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/adventurer/svg?seed=default";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatRes = await axios.get(`${Base_Url}/user/chat/${connectionId}`, {
          withCredentials: true,
        });
        setMessages(chatRes.data?.data || []);

        const connRes = await axios.get(`${Base_Url}/user/connections`, {
          withCredentials: true,
        });
        const connections = connRes.data?.data || [];
        const ids = connectionId.split('_');
        const otherId = ids[0] === user?._id ? ids[1] : ids[0];
        const found = connections.find(c => c._id === otherId);
        if (found) {
          setOtherUser(found);
          sessionStorage.setItem("chat_user_" + window.location.pathname, JSON.stringify(found));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (connectionId && user?._id) fetchData();
  }, [connectionId, user?._id]);

  useEffect(() => {
    if (!user?._id || !connectionId) return;

    const socketInstance = io("http://13.60.253.32", {
      withCredentials: true,
      transports: ["websocket"],
      path: "/socket.io/",
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      socketInstance.emit("joinChat", {
        connectionId,
        userId: user._id,
        firstName: user.firstName
      });
    });

    socketInstance.on("messageReceived", (msg) => {
      setMessages((prev) => {
        const filtered = prev.filter(m => !m._id?.startsWith("temp_"));
        if (filtered.some(m => m._id === msg._id)) return filtered;
        return [...filtered, msg];
      });
    });

    return () => socketInstance.disconnect();
  }, [connectionId, user?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    const ids = connectionId.split('_');
    console.log("IDs:", ids, "user._id:", user?._id);
    const receiverId = ids[0] === user?._id?.toString() ? ids[1] : ids[0];
    console.log("receiverId:", receiverId);

    const tempMsg = {
      senderId: user?._id,
      text: input,
      _id: "temp_" + Date.now()
    };
    setMessages((prev) => [...prev, tempMsg]);

    socketRef.current.emit("sendMessage", {
      connectionId,
      senderId: user?._id,
      receiverId,
      text: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black text-white mt-16 max-w-4xl mx-auto border-x border-white/5">

      <div
        className="p-4 bg-zinc-900/50 backdrop-blur-md border-b border-white/10 flex items-center gap-4 cursor-pointer hover:bg-zinc-800/50 transition"
        onClick={() => otherUser && navigate(`/profile`)}
      >
        <img
          src={otherUser?.photoUrl || DEFAULT_AVATAR}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-blue-500/30"
          onError={(e) => e.target.src = DEFAULT_AVATAR}
        />
        <div>
          <h2 className="font-bold text-sm">
            {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Developer Chat"}
          </h2>
          <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={msg._id || index} className={`chat ${msg.senderId === user?._id || msg.senderId?._id === user?._id ? "chat-end" : "chat-start"}`}>
            <div className={`chat-bubble ${msg.senderId === user?._id || msg.senderId?._id === user?._id ? "bg-blue-600" : "bg-zinc-800"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {showEmoji && (
        <div className="flex flex-wrap gap-2 p-3 bg-zinc-900 border-t border-white/10">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className="text-2xl hover:scale-125 transition"
              onClick={() => { setInput((prev) => prev + emoji); setShowEmoji(false); }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 bg-zinc-900/50 border-t border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="text-2xl px-2 hover:scale-110 transition"
          >
            😊
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-zinc-800 border-none rounded-xl px-4 py-3 text-white outline-none"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="bg-blue-600 px-6 rounded-xl font-bold">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
