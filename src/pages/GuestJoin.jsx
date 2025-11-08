// src/pages/GuestJoin.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { joinSession } from "../api/sessionApi"; // API ที่เราสร้าง
import { useAuth } from "../context/AuthContext"; // AuthContext
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

// ฟังก์ชันสำหรับสร้าง ID ให้ Guest (เพื่อป้องกันโหวตซ้ำ)
const getGuestId = () => {
    let id = localStorage.getItem("guestId");
    if (!id) {
        id = crypto.randomUUID(); // สร้าง UUID
        localStorage.setItem("guestId", id);
    }
    return id;
};

const GuestJoin = () => {
    const [sessionCode, setSessionCode] = useState("");
    const [guestName, setGuestName] = useState(""); // <-- 1. เพิ่ม State สำหรับชื่อ
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth(); // ดึง { login }
    const [searchParams] = useSearchParams(); // ดึง ?role=... จาก URL

    // 2. ดึง Role มาไว้ข้างนอก เพื่อใช้กับ JSX
    const role = searchParams.get("role") || "guest"; // default เป็น guest
    const sessionCodeParam = searchParams.get("session");
    if (sessionCodeParam && !sessionCode && sessionCodeParam.length === 6) {
        setSessionCode(sessionCodeParam.toUpperCase());
    }

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!sessionCode) {
            setError("กรุณากรอกรหัสเข้าร่วม");
            return;
        }

        setIsLoading(true);
        setError("");

        // 1. ตรวจสอบ Role (ย้ายไปข้างบนแล้ว)
        let guestId = null;

        // 2. ถ้าเป็น 'guest' ให้ดึง/สร้าง guestId
        if (role === "guest") {
            guestId = getGuestId();
        }

        // 3. ตรวจสอบชื่อที่จะส่ง
        // ถ้าเป็น guest และ กรอกชื่อมา (ไม่นับช่องว่าง) ให้ใช้ชื่อนั้น
        // นอกนั้นให้เป็น "Anonymous"
        const displayName = (role === "guest" && guestName.trim())
            ? guestName.trim()
            : "Anonymous";

        try {
            // 4. เรียก API Join (อัปเดต "Anonymous" เป็น displayName)
            const response = await joinSession(
                sessionCode.toUpperCase(),
                displayName, // <-- 4. ใช้ displayName ที่เตรียมไว้
                role,
                guestId
            );

            // 5. ถ้าสำเร็จ, Backend จะส่ง Token กลับมา
            const { token } = response.data.data;

            // 6. เรียก login() จาก AuthContext เพื่อเก็บ Token
            auth.login(token, role);

            // 7. ส่งผู้ใช้ไปยังหน้าที่ถูกต้อง
            if (role === "guest") {
                navigate(`/session/`);
            } else if (role === "viewer") {
                navigate(`/display/`);
            }
        } catch (err) {
            console.error(err);
            setError("รหัสไม่ถูกต้อง หรือ Session ยังไม่เปิดใช้งาน");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <a href="/">
                <img
                    src="/Banner ถามสด.png"
                    alt="Thamsod Logo Banner"
                    className="w-full max-w-lg mb-4 animate-fade-in-down"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/ThamsodBanner.png";
                        e.target.alt = "Thamsod Banner";
                    }}
                />
            </a>
            <Card className="w-full max-w-md">
                <form onSubmit={handleJoin}>
                    <Card.Content>
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                            Join Session
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            กรอกรหัส 6 หลักที่ได้รับจากผู้จัดงาน
                        </p>
                        <Input
                            type="text"
                            placeholder="ABCXYZ"
                            value={sessionCode}
                            onChange={(e) => setSessionCode(e.target.value)}
                            className="text-center text-2xl tracking-widest font-bold uppercase"
                            maxLength={6}
                        />

                        {/* 5. เพิ่ม Input Field สำหรับชื่อ (แสดงเฉพาะ role=guest) */}
                        {role === "guest" && (
                            <div className="mt-6"> {/* ใส่ margin top เพื่อเว้นระยะ */}
                                <label className="block text-sm font-medium text-gray-700 text-center mb-2">
                                    Your Name (Optional)
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Anonymous"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="text-center"
                                    maxLength={50} // กันชื่อยาวเกินไป
                                />
                            </div>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                        )}
                    </Card.Content>
                    <Card.Footer>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {isLoading ? "Joining..." : "Join"}
                        </Button>
                    </Card.Footer>
                </form>
            </Card>
        </div>
    );
};

export default GuestJoin;