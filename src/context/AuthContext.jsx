// src/context/AuthContext.jsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi";

// 1. สร้าง Context
const AuthContext = createContext();

// 2. สร้าง Provider (ตัวห่อหุ้ม)
export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("authToken") || null);
    const [user, setUser] = useState(null); // { role: 'host', ... } or { role: 'guest', ... }
    const [roleJoined, setRoleJoined] = useState(null); // 'host' or 'guest' or 'viewer'
    const [loading, setLoading] = useState(true); // สถานะ loading ตอนเริ่มแอป
    const navigate = useNavigate();

    // 3. ตรวจสอบ Token เมื่อแอปเริ่มทำงาน
    useEffect(() => {
        const initializeAuth = async () => {
            if (token && roleJoined === "host") {
                // ถ้ามี token ใน localStorage, ลองดึงข้อมูลผู้ใช้
                // นี่คือจุดสำคัญ: เราจะใช้ Token เพื่อเรียก /api/auth/me
                // เพื่อให้รู้ว่า Token นี้เป็นของ 'host' หรือ 'guest'
                // ในที่นี้เราจะใช้การ 'decode' token ฝั่ง client เพื่อความรวดเร็ว
                try {
                    const decodedUser = await authApi.getMe(token);
                    // decodedUser จะมี { userId, role } สำหรับ Host
                    // หรือ { sessionId, role, guestId } สำหรับ Guest
                    setUser(decodedUser);
                } catch (error) {
                    console.error("Invalid token:", error);
                    // ถ้า Token เพี้ยน ก็ลบทิ้ง
                    localStorage.removeItem("authToken");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false); // โหลดเสร็จแล้ว
        };
        initializeAuth();
    }, [token]);

    // 4. ฟังก์ชันสำหรับ Login (ใช้โดย Host และ Guest/Viewer)
    const login = async (newToken, roleJoined) => {
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        setRoleJoined(roleJoined);

        if (roleJoined === "host") {
            try {
                const decodedUser = await authApi.getMe(newToken);
                setUser(decodedUser);
            } catch (error) {
                console.error("Failed to fetch user after login:", error);
            }
        }
    };

    // 5. ฟังก์ชันสำหรับ Logout
    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
        setRoleJoined(null);
        // เมื่อ logout ให้พากลับไปหน้าแรก
        navigate("/");
    };

    // 6. ส่งค่าทั้งหมดผ่าน Provider
    // ใช้ useMemo เพื่อป้องกันการ re-render ที่ไม่จำเป็น
    const value = useMemo(
        () => ({
            token,
            user,
            isLoggedIn: !!token,
            isLoading: loading,
            isHost: user?.role === "host",
            isGuest: user?.role === "guest",
            isViewer: user?.role === "viewer",
            login,
            logout,
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 7. สร้าง Custom Hook (useAuth)
// นี่คือท่ามาตรฐานที่จะทำให้เราดึงข้อมูล Auth ได้ง่ายๆ
export const useAuth = () => {
    return useContext(AuthContext);
};