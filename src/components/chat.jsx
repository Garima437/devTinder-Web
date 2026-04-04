import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Base_Url = "http://localhost:3000";

const Chat = () => {
  const { connectionId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${Base_Url}/user/chat/${connectionId}`, {
          withCredentials: true,
        });
        // Adjust "res.data.data" based on your actual API response structure
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("History Load Error:", err);
      }
    };
    if (connectionId) fetchHistory();
  }, [connectionId]);

  // 2. Setup Real-time Connection (Socket.io)
  useEffect(() => {
    if (!user?._id || !connectionId) return;

    // Create socket instance
    const socketInstance = io(Base_Url, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true, // Connect immediately
    });

    socket.current = socketInstance;

    // Join room when connection is successful
    socketInstance.on("connect", () => {
      console.log("⚡ Connected to server. Joining room:", connectionId);
      socketInstance.emit("joinChat", {
        connectionId: connectionId,
        firstName: user?.firstName,
        userId: user?._id,
      });
    });

    // Listen for new messages
    socketInstance.on("messageReceived", (msg) => {
      setMessages((prev) => {
        // Prevent duplicate messages (standard check)
        const isDuplicate = prev.some((m) => m._id === msg._id);
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    });

    // Cleanup: Disconnect when component unmounts or connectionId changes
    return () => {
      if (socketInstance) {
        console.log("🔌 Disconnecting socket...");
        socketInstance.off("messageReceived");
        socketInstance.disconnect();
      }
    };
  }, [connectionId, user?._id]);

  // 3. Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message Function
  const sendMessage = () => {
    if (!input.trim() || !socket.current) return;

    const messageData = {
      connectionId,
      senderId: user?._id,
      firstName: user?.firstName,
      text: input,
    };

    // Emit event to Backend
    socket.current.emit("sendMessage", messageData);

    setInput(""); // Clear input field
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-2xl mx-auto bg-base-300 rounded-2xl shadow-2xl my-5 overflow-hidden border border-white/10">
      {/* Header */}
      <div className="p-4 bg-base-100 border-b border-white/5 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg text-primary">Chat Session</h2>
          <p className="text-xs opacity-50">ID: {connectionId}</p>
        </div>
        <div className="badge badge-success badge-sm gap-2">online</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-base-200/50">
        {messages.length === 0 && (
          <div className="text-center opacity-30 mt-10">No messages yet. Say hi!</div>
        )}

        {messages.map((msg, i) => {
          // Logic to determine if I am the sender
          const isMe = msg.senderId === user?._id || msg.senderId?._id === user?._id;

          return (
            <div key={msg._id || i} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
              <div className="chat-header opacity-50 text-xs mb-1">
                {isMe ? "You" : msg.firstName}
              </div>
              <div className={`chat-bubble shadow-md ${isMe ? "chat-bubble-primary" : "bg-base-100 border border-white/10"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-base-100 border-t border-white/5 flex gap-2">
        <input
          className="input input-bordered flex-1 focus:outline-none focus:border-primary"
          placeholder="Write something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="btn btn-primary px-6"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;