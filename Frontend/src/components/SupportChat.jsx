import { useEffect, useState, useRef } from "react";
import { Send, MessageCircle, User, Loader2 } from "lucide-react";
import { getSocket } from "../socket";
import api from "../lib/axios";
import { useAuthStore } from "../store/authStores";
import toast from "react-hot-toast";

const SupportChat = ({ bookingId }) => {
  const socket = getSocket();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ================= LOAD OLD MESSAGES =================
  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/messages/${bookingId}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Load messages error:", error.response?.data);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId || !user) return;

    loadMessages();

    // Join booking room
    socket.emit("joinBookingRoom", bookingId);

    // Listen for booking messages
    socket.on("receiveBookingMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveBookingMessage");
    };

  }, [bookingId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ================= SEND MESSAGE =================
  const send = async () => {
    if (!text.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      socket.emit("sendBookingMessage", {
        bookingId,
        senderId: user._id,
        message: text.trim()
      });

      setText("");
      inputRef.current?.focus();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300">
      <div className="card-body p-0">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-3 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold text-sm sm:text-base">Support Chat</h3>
          </div>
        </div>

        {/* MESSAGE AREA */}
        <div className="h-64 sm:h-80 overflow-y-auto p-4 bg-base-200 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50">
              <MessageCircle className="w-12 h-12 mb-2" />
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((m) => {
                const isOwn = m.sender === user._id;
                return (
                  <div
                    key={m._id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] sm:max-w-[75%] ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="avatar placeholder flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            isOwn ? "bg-primary text-primary-content" : "bg-base-300"
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? "bg-primary text-primary-content rounded-tr-sm"
                            : "bg-base-100 text-base-content rounded-tl-sm shadow-md"
                        }`}
                      >
                        <p className="text-sm break-words">{m.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-base-100 border-t border-base-300 rounded-b-2xl">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              className="input input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
            />
            <button
              className="btn btn-primary gap-2 px-4 sm:px-6"
              onClick={send}
              disabled={isSending || !text.trim()}
            >
              {isSending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;