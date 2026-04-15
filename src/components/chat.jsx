// // import { useEffect, useState, useRef } from "react";
// // import { io } from "socket.io-client";
// // import { useParams } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import axios from "axios";

// // // const Base_Url = "http://localhost:3000";
// // const Base_Url = "http://13.60.253.32"
// // const Chat = () => {
// //   const { connectionId } = useParams();
// //   const user = useSelector((store) => store.user);
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState("");
// //   const socket = useRef(null);
// //   const scrollRef = useRef(null);
// //   useEffect(() => {
// //     const fetchHistory = async () => {
// //       try {
// //         const res = await axios.get(`${Base_Url}/user/chat/${connectionId}`, {
// //           withCredentials: true,
// //         });
// //         // Adjust "res.data.data" based on your actual API response structure
// //         setMessages(res.data?.data || []);
// //       } catch (err) {
// //         console.error("History Load Error:", err);
// //       }
// //     };
// //     if (connectionId) fetchHistory();
// //   }, [connectionId]);

// //   // 2. Setup Real-time Connection (Socket.io)
// //   useEffect(() => {
// //     if (!user?._id || !connectionId) return;

// //     // Create socket instance
// //     const socketInstance = io(Base_Url, {
// //       withCredentials: true,
// //       transports: ["websocket"],
// //       autoConnect: true, // Connect immediately
// //     });

// //     socket.current = socketInstance;

// //     // Join room when connection is successful
// //     socketInstance.on("connect", () => {
// //       console.log("⚡ Connected to server. Joining room:", connectionId);
// //       socketInstance.emit("joinChat", {
// //         connectionId: connectionId,
// //         firstName: user?.firstName,
// //         userId: user?._id,
// //       });
// //     });

// //     // Listen for new messages
// //     socketInstance.on("messageReceived", (msg) => {
// //       setMessages((prev) => {
// //         // Prevent duplicate messages (standard check)
// //         const isDuplicate = prev.some((m) => m._id === msg._id);
// //         if (isDuplicate) return prev;
// //         return [...prev, msg];
// //       });
// //     });

// //     // Cleanup: Disconnect when component unmounts or connectionId changes
// //     return () => {
// //       if (socketInstance) {
// //         console.log("🔌 Disconnecting socket...");
// //         socketInstance.off("messageReceived");
// //         socketInstance.disconnect();
// //       }
// //     };
// //   }, [connectionId, user?._id]);

// //   // 3. Auto-scroll to the latest message
// //   useEffect(() => {
// //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // 4. Send Message Function
// //   const sendMessage = () => {
// //     if (!input.trim() || !socket.current) return;

// //     const messageData = {
// //       connectionId,
// //       senderId: user?._id,
// //       firstName: user?.firstName,
// //       text: input,
// //     };

// //     // Emit event to Backend
// //     socket.current.emit("sendMessage", messageData);

// //     setInput(""); // Clear input field
// //   };

// //   return (
// //     <div className="flex flex-col h-[85vh] w-full max-w-2xl mx-auto bg-base-300 rounded-2xl shadow-2xl my-5 overflow-hidden border border-white/10">
// //       {/* Header */}
// //       <div className="p-4 bg-base-100 border-b border-white/5 flex justify-between items-center">
// //         <div>
// //           <h2 className="font-bold text-lg text-primary">Chat Session</h2>
// //           <p className="text-xs opacity-50">ID: {connectionId}</p>
// //         </div>
// //         <div className="badge badge-success badge-sm gap-2">online</div>
// //       </div>

// //       {/* Messages Area */}
// //       <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-base-200/50">
// //         {messages.length === 0 && (
// //           <div className="text-center opacity-30 mt-10">No messages yet. Say hi!</div>
// //         )}

// //         {messages.map((msg, i) => {
// //           // Logic to determine if I am the sender
// //           const isMe = msg.senderId === user?._id || msg.senderId?._id === user?._id;

// //           return (
// //             <div key={msg._id || i} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
// //               <div className="chat-header opacity-50 text-xs mb-1">
// //                 {isMe ? "You" : msg.firstName}
// //               </div>
// //               <div className={`chat-bubble shadow-md ${isMe ? "chat-bubble-primary" : "bg-base-100 border border-white/10"}`}>
// //                 {msg.text}
// //               </div>
// //             </div>
// //           );
// //         })}
// //         <div ref={scrollRef} />
// //       </div>

// //       {/* Input Area */}
// //       <div className="p-4 bg-base-100 border-t border-white/5 flex gap-2">
// //         <input
// //           className="input input-bordered flex-1 focus:outline-none focus:border-primary"
// //           placeholder="Write something..."
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //         />
// //         <button
// //           className="btn btn-primary px-6"
// //           onClick={sendMessage}
// //           disabled={!input.trim()}
// //         >
// //           Send
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Chat;



// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Base_Url } from "../utils/constants"; // Use your shared constant!

// const Chat = () => {
//   const { connectionId } = useParams();
//   const user = useSelector((store) => store.user);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const socket = useRef(null);
//   const scrollRef = useRef(null);

//   // 1. Fetch Chat History
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${Base_Url}/user/chat/${connectionId}`, {
//           withCredentials: true,
//         });
//         setMessages(res.data?.data || []);
//       } catch (err) {
//         console.error("History Load Error:", err);
//       }
//     };
//     if (connectionId) fetchHistory();
//   }, [connectionId]);

//   // 2. Setup Real-time Connection
//   useEffect(() => {
//     if (!user?._id || !connectionId) return;

//     // Create socket instance pointing to AWS IP
//     const socketInstance = io(Base_Url, {
//       withCredentials: true,
//       transports: ["websocket", "polling"],
//     });

//     socket.current = socketInstance;

//     socketInstance.on("connect", () => {
//       console.log("⚡ Connected to AWS Server. Joining room:", connectionId);
//       socketInstance.emit("joinChat", { connectionId });
//     });

//     socketInstance.on("messageReceived", (msg) => {
//       setMessages((prev) => {
//         const isDuplicate = prev.some((m) => m._id === msg._id);
//         if (isDuplicate) return prev;
//         return [...prev, msg];
//       });
//     });

//     return () => {
//       if (socketInstance) {
//         socketInstance.off("messageReceived");
//         socketInstance.disconnect();
//       }
//     };
//   }, [connectionId, user?._id]);

//   // 3. Auto-scroll
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 4. Send Message
//   const sendMessage = () => {
//     if (!input.trim() || !socket.current) return;

//     const messageData = {
//       connectionId,
//       senderId: user?._id,
//       text: input,
//     };

//     socket.current.emit("sendMessage", messageData);
//     setInput("");
//   };

//   return (
//     // ... your JSX (which is already looking great with daisyUI classes) ...
//     <div className="chat-container">
//        {/* Use your existing JSX code here */}
//     </div>
//   );
// };

// export default Chat;


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
  const socket = useRef(null);
  const scrollRef = useRef(null);

  // 1. Fetch Chat History (Uses Nginx Proxy /api)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
     // ✅ Correct way to call the history API
const res = await axios.get(Base_Url + "/user/chat/" + connectionId, {
  withCredentials: true,
});
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("History Load Error:", err);
      }
    };
    if (connectionId) fetchHistory();
  }, [connectionId]);

  // 2. Setup Real-time Connection (Uses Direct Socket_Url)
  useEffect(() => {
    if (!user?._id || !connectionId) return;

    const socketInstance = io(Socket_Url, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log("⚡ Connected to Server:", Socket_Url);
      socketInstance.emit("joinChat", { connectionId });
    });

    socketInstance.on("messageReceived", (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some((m) => m._id === msg._id);
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      if (socketInstance) {
        socketInstance.off("messageReceived");
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
    if (!input.trim() || !socket.current) return;

    const messageData = {
      connectionId,
      senderId: user?._id,
      text: input,
    };

    socket.current.emit("sendMessage", messageData);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black text-white mt-16 max-w-4xl mx-auto border-x border-white/5">
      {/* Chat Header */}
      <div className="p-4 bg-zinc-900/50 backdrop-blur-md border-b border-white/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
          ID
        </div>
        <div>
          <h2 className="font-bold text-sm">Developer Chat</h2>
          <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
        </div>
      </div>

      {/* Messages Area */}
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

      {/* Input Area */}
      <div className="p-4 bg-zinc-900/50 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-500 px-6 rounded-xl font-bold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;