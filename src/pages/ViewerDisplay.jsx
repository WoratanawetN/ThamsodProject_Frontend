// src/pages/ViewerDisplay.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getSessionQuestions } from "../api/questionApi";
import { getCurrentSession } from "../api/sessionApi";
import { ThumbsUp, Star, User, Calendar } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Spinner from "../components/ui/Spinner";

// Component ย่อยสำหรับแสดงคำถามบนจอใหญ่ (ใช้ภายในไฟล์นี้)
const DisplayQuestion = ({ question, isHighlighted = false }) => {
    const contentSize = isHighlighted ? "text-5xl" : "text-3xl";
    const statsSize = isHighlighted ? "text-2xl" : "text-xl";
    const bgColor = isHighlighted
        ? "bg-blue-600 text-white shadow-2xl"
        : "bg-white text-gray-800 shadow-lg";

    return (
        <div
            className={`w-full ${bgColor} rounded-2xl p-8 md:p-12 transition-all duration-500`}
        >
            {/* แสดงดาวถ้าถูกไฮไลท์*/}
            {isHighlighted && (
                <div className="flex items-center text-yellow-300 mb-4">
                    <Star size={32} fill="currentColor" className="mr-3" />
                    <span className="text-3xl font-bold">Now Answering</span>
                </div>
            )}
            {/* เนื้อหาคำถาม */}
            <p className={`${contentSize} font-bold mb-6 break-words`}>
                {question.content}
            </p>
            {/* สถิติ (โหวต, ผู้ส่ง) */}
            <div className={`flex flex-wrap items-center justify-between ${statsSize} gap-y-2`}>
                <div
                    className={`flex items-center gap-3 font-bold ${isHighlighted ? "text-blue-100" : "text-blue-600"
                        }`}
                >
                    <ThumbsUp size={28} />
                    <span>{question.upvotes}</span>
                </div>

                {/* UPDATED: จัดกลุ่ม Author และ Date ไว้ด้วยกัน */}
                <div className={`flex items-center flex-wrap gap-x-4 gap-y-2 ${isHighlighted ? "text-gray-200" : "text-gray-500"}`}>
                    <span
                        className={`font-medium`}
                    >
                        by {question.author}
                    </span>
                    {/* NEW: เพิ่มการแสดงวันที่และเวลา */}
                    <span className="flex items-center gap-2 font-medium">
                        <Calendar size={isHighlighted ? 24 : 20} /> {/* ปรับขนาดไอคอนตามสถานะ */}
                        {new Date(question.createdAt).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

const JoinSidebar = ({ sessionCode, joinUrl }) => {
    const qrValue = `${joinUrl}?role=guest&session=${sessionCode}`;
    // ดึง host (e.g., "localhost:3000") จาก URL
    const joinHost = new URL(joinUrl).host;

    return (
        <div className="w-full max-w-sm md:w-1/3 lg:w-1/4 bg-gray-950 p-8 flex flex-col items-center justify-center h-screen sticky top-0 shadow-lg">
            {/* 1. Logo */}
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

            {/* 2. Join Info */}
            <h2 className="text-3xl font-bold text-gray-200 mb-2">
                Join the session
            </h2>
            <p className="text-xl text-gray-400 mb-6 text-center">
                Go to <strong>{joinHost}</strong>
            </p>

            {/* 3. Session Code */}
            <div className="bg-gray-800 rounded-xl p-4 w-full text-center mb-8 shadow-inner">
                <span className="text-5xl font-bold tracking-widest text-white">
                    #{sessionCode}
                </span>
            </div>

            {/* 4. QR Code */}
            <div className="bg-white p-5 rounded-xl shadow-2xl">
                <QRCodeSVG
                    value={qrValue}
                    size={220}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                />
            </div>
            <p className="text-gray-500 text-sm mt-4">Scan to join</p>
        </div>
    );
};

const ViewerDisplay = () => {
    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("authToken") || null;

    const { user, isLoading: isAuthLoading } = useAuth();
    const socket = useSocket();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionRes = await getCurrentSession();
                setSession(sessionRes.data.data);
                // Viewer จะเห็นเฉพาะ 'approved'
                const questionsRes = await getSessionQuestions(sessionRes.data.data._id);
                setQuestions(questionsRes.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false); // หยุดโหลดเมื่อ fetch จบ
            }
        };

        if (isAuthLoading) {
            return; // ยังไม่ทำอะไร, รอ AuthContext
        }

        if (token) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [user, isAuthLoading]);

    useEffect(() => {
        if (!socket) return;

        const handleQuestionUpdated = (updatedQuestion) => {
            if (updatedQuestion.status === "approved") {
                setQuestions((prev) =>
                    prev.filter((q) => q._id !== updatedQuestion._id).concat(updatedQuestion)
                );
            }
            else {
                setQuestions((prev) =>
                    prev.filter((q) => q._id !== updatedQuestion._id)
                );
            }
        };

        const handleQuestionHighlighted = (highlightedQuestion) => {
            setQuestions((prev) => {
                const highlighted = prev.find((q) => q.isHighlighted === true);
                const highlightedId = highlighted ? highlighted._id : null;
                const newHighlighted = prev.find((q) => q._id === highlightedQuestion._id);
                if (highlightedId === newHighlighted._id) {
                    return prev.map((q) =>
                        q._id === highlighted._id
                            ? { ...q, isHighlighted: false }
                            : q
                    );
                } else if (!highlighted) {
                    return prev.map((q) =>
                        q._id === newHighlighted._id
                            ? { ...q, isHighlighted: true }
                            : q
                    );
                }
                else {
                    return prev.map((q) =>
                        q._id === highlighted._id
                            ? { ...q, isHighlighted: false }
                            : q._id === newHighlighted._id
                                ? { ...q, isHighlighted: true }
                                : q
                    );
                }
            });
        };

        const handleGuestCountUpdated = (newGuestCount) => {
            setSession((prev) => ({
                ...prev,
                guestCount: newGuestCount,
            }));
        }

        socket.on("question_updated", handleQuestionUpdated);
        socket.on("question_highlight_updated", handleQuestionHighlighted);
        socket.on("guest_count_updated", handleGuestCountUpdated);

        return () => {
            socket.off("question_updated", handleQuestionUpdated);
            socket.off("question_highlight_updated", handleQuestionHighlighted);
            socket.off("guest_count_updated", handleGuestCountUpdated);
        };
    }, [socket]);

    // 3. Logic การแสดงผล: แยกคำถามไฮไลท์ออกจากคำถามปกติ
    const highlightedQuestions = questions.filter((q) => q.isHighlighted);
    const otherQuestions = questions
        .filter((q) => !q.isHighlighted)
        .sort((a, b) => b.upvotes - a.upvotes); // เรียงตามโหวต

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    const joinUrl = `${window.location.origin}/join`;

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">

            {/* 5. Column ซ้าย: QR Code & Session Info */}
            {session && (
                <JoinSidebar
                    // (สำคัญ!) แก้ไข session.sessionCode 
                    // ให้ตรงกับ property ที่เก็บรหัส Session ของคุณ
                    sessionCode={session.sessionCode || "LOADING..."}
                    joinUrl={joinUrl}
                />
            )}

            {/* 6. Column ขวา: รายการคำถาม (Scrollable) */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
                {/* Header ที่ปรับปรุงใหม่ ให้คล้าย Slido */}
                <header className="mb-8 flex justify-between items-start">
                    {/* ส่วนซ้าย: ชื่อ Session และ จำนวนคำถาม */}
                    <div>
                        <h1 className="text-4xl font-extrabold text-white">
                            Questions ({questions.length})
                        </h1>
                        <p className="text-2xl text-gray-400 mt-2">{session?.sessionName}</p>
                    </div>

                    {/* ส่วนขวา: จำนวนผู้เข้าร่วม */}
                    {session && (
                        <div className="flex items-center gap-3 bg-gray-800 px-5 py-3 rounded-xl shadow-md">
                            <User size={28} className="text-blue-400" />
                            <span className="text-3xl font-bold text-white">
                                {session.guestCount || 0}
                            </span>
                        </div>
                    )}
                </header>

                {/* รายการคำถาม (เหมือนเดิม) */}
                <div className="space-y-8">
                    {highlightedQuestions.map((q) => (
                        <DisplayQuestion key={q._id} question={q} isHighlighted={true} />
                    ))}

                    {otherQuestions.map((q) => (
                        <DisplayQuestion key={q._id} question={q} isHighlighted={false} />
                    ))}

                    {questions.length === 0 && (
                        <p className="text-gray-400 text-3xl text-center pt-20">
                            Waiting for questions...
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewerDisplay;