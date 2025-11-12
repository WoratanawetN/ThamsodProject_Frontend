// src/pages/HostSessionManager.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import {
    getSessionQuestions,
    updateQuestionStatus,
    highlightQuestion,
} from "../api/questionApi";
import { getHostSessions } from "../api/sessionApi";
import { exportToCsv } from "../utils/exportUtils";
import Navbar from "../components/common/Navbar";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import {
    Check,
    X,
    Star,
    ThumbsUp,
    MessageSquare,
    Archive,
    Users,
    Clock,
    Calendar,
    Download
} from "lucide-react";

const ITEMS_PER_PAGE = 5; // จำนวนคำถามต่อหน้า (สำหรับ Pagination)

const HostSessionManager = () => {
    const { sessionId } = useParams();
    const socket = useSocket();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState("pending"); // 'pending', 'approved', 'rejected'
    const [currentPage, setCurrentPage] = useState(1);

    const [sortOrder, setSortOrder] = useState("recent");

    // NEW: 0. Handler: Export
    const handleExportAll = () => {
        if (questions.length === 0) {
            alert("No questions to export.");
            return;
        }
        // สร้างชื่อไฟล์
        const filename = session
            ? `${session.sessionName.replace(/\s+/g, '_')}_questions.csv`
            : 'all_questions.csv';

        // เรียกใช้ utility
        exportToCsv(questions, filename);
    };

    // 1. Fetch ข้อมูลครั้งแรก (Host จะเห็นทุกสถานะ)
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await getSessionQuestions(sessionId);
                setQuestions(res.data.data);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchSessionData = async () => {
            try {
                const res = await getHostSessions();
                const session = res.data.data.find(
                    (s) => s._id === sessionId
                );
                setSession(session);
            } catch (error) {
                console.error("Failed to fetch session details:", error);
                navigate("/host/auth");
            }
        };

        fetchQuestions();
        fetchSessionData();
    }, [sessionId]);

    // 2. ตั้งค่า Socket Listeners
    useEffect(() => {
        if (!socket) return;

        // 2.1 เมื่อ Guest ส่งคำถามใหม่เข้ามา
        const handleQuestionSubmitted = (newQuestion) => {
            // เพิ่มเข้า state (จะไปอยู่หน้า Pending)
            setQuestions((prev) => [newQuestion, ...prev]);
        };

        // 2.2 เมื่อคำถามถูกอัปเดต (โหวต, หรือเปลี่ยน status)
        const handleQuestionUpdated = (updatedQuestion) => {
            setQuestions((prev) =>
                prev.map((q) =>
                    q._id === updatedQuestion._id ? updatedQuestion : q
                )
            );
        };

        // 2.3 เมื่อคำถามมีการไฮไลท์
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

        const handleGuestCountUpdated = (updatedGuestCount) => {
            setSession((prev) => ({
                ...prev,
                guestCount: updatedGuestCount.guestCount,
            }));
        };

        socket.on("question_submitted", handleQuestionSubmitted);
        socket.on("question_updated", handleQuestionUpdated);
        socket.on("question_highlight_updated", handleQuestionHighlighted);
        socket.on("guest_count_updated", handleGuestCountUpdated);

        // Cleanup
        return () => {
            socket.off("question_submitted", handleQuestionSubmitted);
            socket.off("question_updated", handleQuestionUpdated);
            socket.off("question_highlight_updated", handleQuestionHighlighted);
            socket.off("guest_count_updated", handleGuestCountUpdated);
        };
    }, [socket]);

    // 2.A: MANUALLY JOIN SOCKET ROOM
    useEffect(() => {
        if (socket && sessionId) {
            socket.emit("joinSession", sessionId);
        }
    }, [socket, sessionId]);

    // UPDATED: 3. Logic: กรองและ *จัดเรียง* คำถามตาม Tab และ SortOrder
    const { pendingQuestions, approvedQuestions, rejectedQuestions } =
        useMemo(() => {
            // สร้าง sorting function กลาง
            const sortFunction = (a, b) => {
                if (sortOrder === 'votes') {
                    // ถ้าโหวตเท่ากัน ให้ใช้เวลาเป็นตัวตัดสิน (ใหม่ไปเก่า)
                    if (b.upvotes !== a.upvotes) {
                        return b.upvotes - a.upvotes;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                // Default ('recent')
                return new Date(b.createdAt) - new Date(a.createdAt);
            };

            const pending = questions
                .filter((q) => q.status === "pending")
                .sort(sortFunction); // UPDATED

            const approved = questions
                .filter((q) => q.status === "approved")
                .sort(sortFunction); // UPDATED

            const rejected = questions
                .filter((q) => q.status === "rejected")
                .sort(sortFunction); // UPDATED

            return { pendingQuestions: pending, approvedQuestions: approved, rejectedQuestions: rejected };

            // UPDATED: เพิ่ม sortOrder ใน dependency array
        }, [questions, sortOrder]);

    // 4. Logic: Pagination (ตามที่คุณขอ)
    const paginatedPendingQuestions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return pendingQuestions.slice(startIndex, endIndex);
    }, [pendingQuestions, currentPage]);

    const totalPages = Math.ceil(pendingQuestions.length / ITEMS_PER_PAGE);

    // 5. Action Handlers (Approve/Reject)
    const handleStatusUpdate = async (questionId, status) => {
        try {
            await updateQuestionStatus(questionId, status);
            // ไม่ต้องอัปเดต state เอง:
            // Backend จะยิง 'question_updated' (หรือ 'question_approved') กลับมา
            // และ Socket listener (ข้อ 2.2) จะจัดการอัปเดต UI ให้อัตโนมัติ
        } catch (error) {
            console.error(`Failed to ${status} question:`, error);
        }
    };

    // 6. Action Handler (Highlight)
    const handleHighlight = async (questionId) => {
        try {
            await highlightQuestion(questionId);
            // Socket listener (ข้อ 2.2) จะจัดการอัปเดต UI ให้อัตโนมัติ
        } catch (error) {
            console.error("Failed to highlight question:", error);
        }
    };

    // 7. Helper: แสดงผลรายการคำถามตาม Tab
    const renderQuestionList = () => {
        let listToRender = [];
        if (currentTab === "pending") listToRender = paginatedPendingQuestions;
        if (currentTab === "approved") listToRender = approvedQuestions;
        if (currentTab === "rejected") listToRender = rejectedQuestions;

        if (isLoading) return <Spinner />;
        if (listToRender.length === 0) {
            return (
                <p className="text-gray-500 text-center py-10">
                    No questions in this category.
                </p>
            );
        }

        // 8. UI Card ของคำถามแต่ละใบ (สำหรับ Host)
        return listToRender.map((q) => (
            <div key={q._id} className="bg-white rounded-lg shadow-md p-5 border">
                <p className="text-gray-800 text-lg mb-4">{q.content}</p>
                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span>by {q.author}</span>
                        <span className="flex items-center gap-1 font-medium text-blue-600">
                            <ThumbsUp size={14} /> {q.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(q.createdAt).toLocaleString()}
                        </span>
                    </div>
                    {/* 9. Action Buttons */}
                    <div className="flex gap-2">
                        {currentTab === "pending" && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleStatusUpdate(q._id, "rejected")}
                                    className="bg-red-100 text-red-700 hover:bg-red-200"
                                >
                                    <X size={16} />
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => handleStatusUpdate(q._id, "approved")}
                                    className="bg-green-100 text-green-700 hover:bg-green-200"
                                >
                                    <Check size={16} />
                                </Button>
                            </>
                        )}
                        {currentTab === "approved" && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleStatusUpdate(q._id, "rejected")}
                                    title="Reject this question"
                                >
                                    <X size={16} />
                                </Button>
                                <Button
                                    variant={q.isHighlighted ? "primary" : "secondary"}
                                    onClick={() => handleHighlight(q._id)}
                                    className={q.isHighlighted ? "bg-yellow-400 hover:bg-yellow-500 text-black" : ""}
                                    title={q.isHighlighted ? "Remove Highlight" : "Highlight this question"}
                                >
                                    <Star size={16} />
                                </Button>
                            </>
                        )}
                        {currentTab === "rejected" && (
                            <Button
                                variant="secondary"
                                onClick={() => handleStatusUpdate(q._id, "approved")}
                                title="Re-approve this question"
                            >
                                <Check size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    // 10. UI Tab Button
    const TabButton = ({ tabName, label, count, icon }) => (
        <button
            onClick={() => {
                setCurrentTab(tabName);
                setCurrentPage(1); // Reset page
                setSortOrder(tabName === 'approved' ? 'votes' : 'recent');
            }}
            className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-4 transition-colors ${currentTab === tabName
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
        >
            {icon}
            {label}
            <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentTab === tabName
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
            >
                {count}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* 6.1: Back Link (ซ้าย) */}
                    <Link
                        to="/host/dashboard"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        &larr; Back to Dashboard
                    </Link>

                    {/* 6.2: Session Name (กลาง) */}
                    <h2 className="text-xl font-bold text-gray-800">
                        {session ? "Manage Q&A: " + session.sessionName : "Manage Q&A"}
                    </h2>

                    {/* 6.3: Guest Count (ขวา) */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users size={20} />
                        <span className="font-medium text-lg">
                            {/* แสดง guestCount หรือ 0 ถ้ายังไม่มีข้อมูล */}
                            {session ? session.guestCount ?? 0 : 0}
                        </span>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={handleExportAll}
                        disabled={questions.length === 0}
                        className="flex items-center gap-2"
                        title="Export All Questions (CSV)"
                    >
                        <Download size={16} />
                        Export All
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4">
                {/* 11. Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <nav className="flex border-b border-gray-200">
                        <TabButton
                            tabName="pending"
                            label="Pending"
                            count={pendingQuestions.length}
                            icon={<MessageSquare size={18} />}
                        />
                        <TabButton
                            tabName="approved"
                            label="Approved"
                            count={approvedQuestions.length}
                            icon={<Check size={18} />}
                        />
                        <TabButton
                            tabName="rejected"
                            label="Rejected"
                            count={rejectedQuestions.length}
                            icon={<Archive size={18} />}
                        />
                    </nav>

                    {/* NEW: 11.5 Sorting/Filter Controls */}
                    <div className="p-4 border-b border-gray-200 flex justify-end items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Sort by:</span>
                        <Button
                            variant={sortOrder === 'recent' ? 'primary' : 'secondary'}
                            onClick={() => setSortOrder('recent')}
                            className="flex items-center gap-1.5"
                        >
                            <Clock size={14} />
                            Recent
                        </Button>
                        <Button
                            variant={sortOrder === 'votes' ? 'primary' : 'secondary'}
                            onClick={() => setSortOrder('votes')}
                            className="flex items-center gap-1.5"
                        >
                            <ThumbsUp size={14} />
                            Most Votes
                        </Button>
                    </div>

                    {/* 12. Question List Area */}
                    <div className="p-4 space-y-4">
                        {renderQuestionList()}
                    </div>

                    {/* 13. Pagination Controls */}
                    {currentTab === "pending" && totalPages > 1 && (
                        <div className="p-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HostSessionManager;