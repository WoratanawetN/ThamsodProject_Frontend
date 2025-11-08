// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // ดึง AuthContext มาใช้

// 1. ดึง URL ของ Backend
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

// 2. สร้าง Context
const SocketContext = createContext();

// 3. สร้าง Hook สำหรับเรียกใช้
export const useSocket = () => {
    return useContext(SocketContext);
};

// 4. สร้าง Provider (ตัวห่อหุ้ม)
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token } = useAuth(); 

    useEffect(() => {
        if (token) {

            // 1. Create the socket instance
            const newSocket = io(SOCKET_URL, {
                auth: { token: token },
            });

            // 2. Listen for the 'connect' event
            newSocket.on("connect", () => {
                console.log("Socket.IO Connected", newSocket.id);
                setSocket(newSocket);
            });

            // 4. Handle disconnects
            newSocket.on("disconnect", () => {
                console.log("Socket.IO Disconnected");
                setSocket(null); // Clear socket on disconnect
            });

            // 5. (Recommended) Handle connection errors
            newSocket.on("connect_error", (err) => {
                console.error("Socket.IO Connection Error:", err.message);
            });

            // 6. Cleanup function
            return () => {
                newSocket.disconnect();
            };
        } else if (!token && socket) {
            // Handle logout
            socket.disconnect();
            setSocket(null);
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};