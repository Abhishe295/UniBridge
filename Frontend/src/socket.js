import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const backendURL =
      window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "https://helpx-vnvg.onrender.com";

    socket = io(backendURL, {
      withCredentials: true,
      transports: ["websocket"]
    });
  }

  return socket;
};
