import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // Token বা user না থাকলে socket connect করবে না
    if (!token || !userStr) {
      console.warn("Cannot connect socket: Missing credentials");
      return;
    }

    let parseUser = null;
    try {
      parseUser = JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return;
    }

    // User ID না থাকলে socket connect করবে না
    if (!parseUser?._id) {
      console.warn("Cannot connect socket: Invalid user data");
      return;
    }

    console.log("Connecting socket for user:", parseUser);

    const socketInstance = io(
      `http://10.10.20.44:3333?userId=${parseUser._id}`,
      {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        withCredentials: true,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(socketInstance);

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket cleanup: disconnected");
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
