import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      withCredentials: true,
      transports: ["websocket"]
    });
  }
  return socket;
};
