import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../socket";
import { useAuthStore } from "../../store/authStores";
import api from "../../lib/axios";
import { 
  MessageCircle, 
  Send, 
  User, 
  Users,
  Sparkles,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

const AdminSupportPage = () => {
  const { user } = useAuthStore(); // admin
  const socket = getSocket();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 when selecting user → load messages + join room
  useEffect(() => {
    if (!selectedUser || !user) return;

    loadMessages(selectedUser._id);

    socket.emit("joinSupportRoom", selectedUser._id);

    socket.on("receiveSupportMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveSupportMessage");
    };

  }, [selectedUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get("/support/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadMessages = async (userId) => {
    setIsLoadingMessages(true);
    try {
      const res = await api.get(`/support/admin/${userId}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const send = async () => {
    if (!text.trim() || !selectedUser || !user) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      socket.emit("sendSupportMessage", {
        userId: selectedUser._id,   // 🔥 room key
        senderId: user._id,        // admin id
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary" />
            Support Chat
          </h1>
          <p className="text-base-content/60 mt-1">Manage user support conversations</p>
        </div>
        <div className="badge badge-lg badge-accent gap-2">
          <Sparkles className="w-4 h-4" />
          Admin Panel
        </div>
      </div>

      {/* Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE USERS */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-0">
            {/* Header */}
            <div className="bg-primary text-primary-content px-4 py-3 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="font-semibold">User Conversations</h3>
              </div>
            </div>

            {/* Users List */}
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {isLoadingUsers ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-base-content/60">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
                  <Users className="w-12 h-12 mb-2" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                users.map((u) => (
                  <div
                    key={u._id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/10 ${
                      selectedUser?._id === u._id 
                        ? "bg-primary text-primary-content" 
                        : "bg-base-200"
                    }`}
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="avatar placeholder">
                      <div className={`rounded-full w-10 h-10 ${
                        selectedUser?._id === u._id 
                          ? "bg-primary-content text-primary" 
                          : "bg-primary text-primary-content"
                      }`}>
                        <span className="text-sm font-bold">
                          {u.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{u.name}</p>
                      <p className={`text-xs truncate ${
                        selectedUser?._id === u._id 
                          ? "opacity-90" 
                          : "text-base-content/60"
                      }`}>
                        {u.role}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CHAT */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-0 flex flex-col h-[600px]">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-primary-content px-4 py-3 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary-content text-primary rounded-full w-10 h-10">
                        <span className="font-bold">
                          {selectedUser.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedUser.name}</h3>
                      <p className="text-xs opacity-90">{selectedUser.role}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-base-200 space-y-3">
                  {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-base-content/60">Loading messages...</p>
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
                                <p className="text-xs font-semibold mb-1 opacity-75">
                                  {isOwn ? "You (Admin)" : selectedUser.name}
                                </p>
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

                {/* Input Area */}
                <div className="p-4 bg-base-100 border-t border-base-300 rounded-b-2xl">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      className="input input-bordered flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Type your message..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isSending}
                    />
                    <button
                      className="btn btn-primary gap-2"
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-base-content/50">
                <MessageCircle className="w-16 h-16 mb-4" />
                <p className="text-lg font-semibold">Select a user to start chatting</p>
                <p className="text-sm">Choose from the list on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;