import React, { useState } from "react"; // 1. import useState
import { useNavigate } from "react-router-dom";
import { Crown, Users, MonitorPlay, Info, X, HelpCircle } from "lucide-react";
import Button from "../components/ui/Button"; // Import ปุ่มที่เราสร้างไว้

const LandingPage = () => {
    const navigate = useNavigate();
    // 3. สร้าง state เพื่อจัดการการแสดงผลของ Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // เราจะส่ง ?role=... ไปกับ URL เพื่อให้หน้า Join รู้ว่าใครกดมา
    const handleRoleSelect = (role) => {
        if (role === "host") {
            navigate("/host/auth");
        } else if (role === "guest") {
            navigate("/join?role=guest"); // ส่ง query param
        } else if (role === "viewer") {
            navigate("/join?role=viewer"); // ส่ง query param
        }
    };

    return (
        // ใช้ React Fragment (<>) เพื่อให้ Modal อยู่ระดับเดียวกับ div หลักได้
        // หรือจะใส่ Modal ไว้ใน div หลักก็ได้ แต่ต้องระวังเรื่อง styling
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
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
                <p className="text-xl text-gray-600 mb-16 animate-fade-in-up">
                    ระบบถาม-ตอบสำหรับงานสัมมนา
                </p>

                {/* กล่องสำหรับเลือก Role */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    {/* 1. Host */}
                    <RoleCard
                        icon={<Crown size={48} className="text-blue-600" />}
                        title="I'm a Host"
                        description="‎ "
                        onClick={() => handleRoleSelect("host")}
                    />
                    {/* 2. Guest */}
                    <RoleCard
                        icon={<Users size={48} className="text-gray-700" />}
                        title="Join as Guest"
                        description="‎ "
                        onClick={() => handleRoleSelect("guest")}
                        isSecondary
                    />
                    {/* 3. Viewer */}
                    <RoleCard
                        icon={<MonitorPlay size={48} className="text-gray-700" />}
                        title="Presentation View"
                        onClick={() => handleRoleSelect("viewer")}
                        isSecondary
                    />
                </div>

                {/* 4. เพิ่มการ์ดสำหรับ "ผู้จัดทำ" ที่นี่ */}
                {/* <div className="w-full max-w-4xl mt-8">
                    <div
                        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)} // 5. คลิกเพื่อเปิด Modal
                    >
                        <Info size={24} className="text-gray-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-700">
                            สมาชิกผู้จัดทำ
                        </h3>
                    </div>
                </div> */}

            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="ดูสมาชิกผู้จัดทำ" // เพื่อ Accessibility
            >
                <HelpCircle size={32} />
            </button>

            {/* 6. เรียกใช้ Modal Component */}
            <TeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

// --- Helper Component (สร้างไว้ในไฟล์เดียวกันนี้ได้) ---
const RoleCard = ({ icon, title, description, onClick, isSecondary = false }) => {
    return (
        <div
            className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-4 ${isSecondary ? "border-transparent" : "border-blue-500"
                }`}
            onClick={onClick}
        >
            <div className="mb-6 flex justify-center">{icon}</div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                {title}
            </h2>
            <p className="text-gray-600 text-center mb-8">{description}</p>
            <Button
                variant={isSecondary ? "secondary" : "primary"}
                className="w-full"
            >
                Select
            </Button>
        </div>
    );
};

// --- 7. สร้าง Modal Component ---
const TeamModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // ถ้า state เป็น false, ไม่ต้อง render อะไรเลย

    // ข้อมูลสมาชิก (เปลี่ยนชื่อและรูปภาพได้ตามต้องการ)
    const teamMembers = [
        { no: "66099910", name: "วรธนเวธน์ ณีศะนันทร์", img: "/picture/worathanawet.jpg" },
        { no: "66080240", name: "วรเดช อาจวิชัย", img: "/picture/woradech.jpg" },
        { no: "66092117", name: "ณัฐดนัย รอดมุ้ย", img: "/picture/nutdanai.png" },
    ];

    return (
        <>
            {/* Overlay (ฉากหลังสีดำโปร่งใส) */}
            <div
                className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
                onClick={onClose} // คลิกที่ Overlay เพื่อปิด
            ></div>

            {/* Modal Content (กล่อง Popup) */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-xl z-50 w-full max-w-2xl transition-transform duration-300 scale-100">
                {/* ปุ่มปิด (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <X size={28} />
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    สมาชิกผู้จัดทำ
                </h2>

                {/* รายชื่อสมาชิก */}
                <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-32 h-32 rounded-full object-cover mb-4 shadow-md border-4 border-gray-100"
                                // Fallback เผื่อรูปโหลดไม่ขึ้น
                                onError={(e) => { e.target.src = 'https://placehold.co/150x150/ff0000/ffffff?text=Error'; }}
                            />
                            <h3 className="text-lg font-semibold text-gray-700">{member.name}</h3>
                            <p className="text-gray-500">รหัสนักศึกษา: {member.no}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


export default LandingPage;