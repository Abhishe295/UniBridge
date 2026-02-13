import { useEffect, useState } from "react";
import { getSocket } from "../../socket";
import { useAuthStore } from "../../store/authStores";
import api from "../../lib/axios";

const UserSupport = () => {
  const { user } = useAuthStore();
  const socket = getSocket();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user) return; // 🔥 guard

    loadMessages();

    socket.emit("joinSupportRoom", user._id);

    socket.on("receiveSupportMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveSupportMessage");
    };

  }, [user]); // 🔥 depend on user

  const loadMessages = async () => {
    try {
      const res = await api.get("/support/user");
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const send = () => {
    if (!text.trim() || !user) return;

    socket.emit("sendSupportMessage", {
      userId: user._id,
      senderId: user._id,
      message: text
    });

    setText("");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-y-auto border p-3 rounded">
        {messages.map((m) => (
          <div key={m._id} className="mb-2">
            {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="input input-bordered w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button className="btn btn-primary" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
};

export default UserSupport;
