import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socketInstance = io("http://10.10.20.44:3333", {
      auth: {
        token: token || "",
      },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => console.log("connected"));

    socketInstance.on("disconnect", () => console.log("disconnect"));

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
/*
import { createContext, useEffect, useState } from "react";
import { useGetProfileQuery } from "../redux/features/profile/profileApi";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { data: profileData, isLoading: profileDataLoading } =
    useGetProfileQuery();
  console.log(profileData);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  console.log(isConnected);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socketInstance = io("http://10.10.20.44:3333", {
      auth: {
        token: token || "",
      },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      // socketInstance.emit("register", {
      //   userId: profileData?.data?._id,
      //   name: profileData?.data?.fullName,
      // });
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

*/
