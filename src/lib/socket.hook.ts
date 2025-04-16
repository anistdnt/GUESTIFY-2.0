import { deleteCookie, setCookie } from "cookies-next/client";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_LOCAL_SOCKET_URL;

export const getSocketInstance = () => {
  const socketInstance = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
  });

  socketInstance.on("connect", () => {
    console.log("Connected to WebSocket server:", socketInstance.id);
    setCookie("socketID", socketInstance.id);
  });

  socketInstance.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
    deleteCookie("socketID");
  });

  return socketInstance;
};
