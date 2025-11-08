// src/pages/GuestSession.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

import {
    getSessionQuestions,
    submitQuestion,
    upvoteQuestion
} from "../api/questionApi"; // API ที่เราสร้าง
import { getCurrentSession } from "../api/sessionApi";

import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import QuestionCard from "../components/common/QuestionCard";
import PendingQuestionCard from "../components/common/PendingQuestionCard";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/common/Pagination";

import { CheckCircle, Send } from "lucide-react";

const QUESTIONS_PER_PAGE = 5;

const GuestSession = () => {
    const [session, setSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('votes');

    const [showSuccess, setShowSuccess] = useState(false);

    const { user, isLoading: isAuthLoading } = useAuth();
    const socket = useSocket();

    // 1. ดึง ID ของ Guest จาก localStorage (ที่สร้างไว้ตอน Join)
    const guestId = useMemo(() => localStorage.getItem("guestId"), []);

    const navigate = useNavigate();

    // 2. Fetch ข้อมูลครั้งแรกเมื่อโหลดหน้า (ฉบับแก้ไข)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // (เรามั่นใจแล้วว่า user.sessionId มีอยู่จริงจากเงื่อนไขด้านล่าง)
                const sessionRes = await getCurrentSession();
                setSession(sessionRes.data.data);

                const questionsRes = await getSessionQuestions(sessionRes.data.data._id);
                setQuestions(questionsRes.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false); // <--- จุดสำคัญ
            }
        };

        // 2.1) รอให้ AuthContext โหลด user ให้เสร็จก่อน
        if (isAuthLoading) {
            return; // ยังไม่ทำอะไร, รอ AuthContext
        }

        // 2.2) AuthContext พร้อมแล้ว, ตอนนี้เช็ค user ได้
        if (guestId) {
            // เราเป็น Guest ที่ถูกต้อง, เริ่มดึงข้อมูล
            fetchData();
        } else {
            // ถ้า AuthContext พร้อม แต่เราไม่ใช่ Guest (ไม่มี user หรือไม่มี sessionId)
            // ให้หยุดโหลดทันที (เพื่อไม่ให้ค้าง)
            setIsLoading(false);
            console.error("GuestSession: No valid guest user found.");
            navigate("/");
        }

    }, [user, isAuthLoading, guestId]);

    // 3. ตั้งค่า Socket Listeners (ทำงานแบบ Real-time)
    useEffect(() => {
        if (!socket) return;

        // [แก้] ปรับปรุง Logic นี้ให้รองรับการอัปเดตโหวต (map) หรือเพิ่มใหม่ (concat)
        const handleQuestionUpdated = (updatedQuestion) => {
            setQuestions((prev) => {
                const questionExists = prev.some(q => q._id === updatedQuestion._id);

                if (updatedQuestion.status === "approved" || updatedQuestion.status === "pending") {
                    if (questionExists) {
                        // Update คำถามเดิม (เช่น โหวต, หรือ status เปลี่ยน)
                        return prev.map(q =>
                            q._id === updatedQuestion._id ? updatedQuestion : q
                        );
                    } else {
                        // เพิ่มคำถามใหม่ (เช่น user เพิ่งส่ง, หรือ host approve)
                        return [...prev, updatedQuestion];
                    }
                } else {
                    // ถ้า status เป็น 'rejected' (หรืออื่นๆ) ให้ลบออกจาก state
                    return prev.filter(q => q._id !== updatedQuestion._id);
                }
            });
        };

        const handleQuestionHighlighted = (highlightedQuestion) => {
            // (Logic ของ Highlighted ... เหมือนเดิม)
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

        socket.on("question_updated", handleQuestionUpdated);
        socket.on("question_highlight_updated", handleQuestionHighlighted);

        return () => {
            socket.off("question_updated", handleQuestionUpdated);
            socket.off("question_highlight_updated", handleQuestionHighlighted);
        };
    }, [socket]);

    // +++ UPDATED: 4. แยก Filter (กรอง) และ Sort (เรียง) +++

    // 4.1 กรองคำถามตาม Tab ที่เลือก
    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            if (sortBy === 'pending') {
                // (ข้อสันนิษฐาน) 'Pending' จะแสดงเฉพาะคำถามของเรา
                // เรา assume ว่า q.author คือ ID ของ guest ที่ส่งมา
                return q.status === 'pending' && q.guestId === guestId;
            }
            // Tab 'votes' (Top) หรือ 'time' (Recent)
            // จะแสดงเฉพาะคำถามที่ 'approved' เท่านั้น
            return q.status === 'approved';
        });
    }, [questions, sortBy, guestId]); // (เพิ่ม guestId)

    // 4.2 เรียงลำดับคำถามที่กรองแล้ว
    const sortedQuestions = useMemo(() => {
        return [...filteredQuestions].sort((a, b) => {
            // 1. ให้คำถามที่ Highlighted อยู่บนสุดเสมอ (ยกเว้น tab pending)
            if (sortBy !== 'pending') {
                if (a.isHighlighted && !b.isHighlighted) return -1;
                if (!a.isHighlighted && b.isHighlighted) return 1;
            }

            // 2. ถ้าสถานะ Highlight เหมือนกัน ให้เรียงตามที่เลือก
            if (sortBy === 'time' || sortBy === 'pending') {
                // เรียงตามเวลา: ใหม่ไปเก่า (ใช้สำหรับ Pending และ Recent)
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            // (Default 'votes') เรียงตามโหวต: มากไปน้อย
            return b.upvotes - a.upvotes;
        });
    }, [filteredQuestions, sortBy]); // (เปลี่ยน dependency)

    // [เพิ่ม] 5. คำนวณเลขหน้า และตัดข้อมูล (Slice)
    const totalPages = Math.ceil(sortedQuestions.length / QUESTIONS_PER_PAGE);

    const paginatedQuestions = useMemo(() => {
        const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
        const endIndex = startIndex + QUESTIONS_PER_PAGE;
        return sortedQuestions.slice(startIndex, endIndex);
    }, [sortedQuestions, currentPage]);

    // [เพิ่ม] 6. Effect สำหรับปรับหน้า เมื่อข้อมูลเปลี่ยน
    useEffect(() => {
        const newTotalPages = Math.ceil(sortedQuestions.length / QUESTIONS_PER_PAGE);
        if (newTotalPages > 0 && currentPage > newTotalPages) {
            // ถ้าหน้าปัจจุบันเกินจำนวนหน้าที่มี (เช่น คำถามโดนลบ)
            setCurrentPage(newTotalPages); // ให้ไปหน้าสุดท้าย
        } else if (newTotalPages === 0 && currentPage !== 1) {
            // ถ้าไม่มีคำถามเลย
            setCurrentPage(1); // กลับไปหน้า 1
        }
    }, [sortedQuestions, currentPage]);

    // 7. ฟังก์ชันส่งคำถามใหม่
    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        setIsSubmitting(true);
        try {
            const sendingQuesting = await submitQuestion(newQuestion);
            setNewQuestion(""); // เคลียร์ช่อง
            const submittedQuestion = sendingQuesting.data.data;

            setQuestions((prev) => [...prev, submittedQuestion]);

            // +++ UPDATED: เพิ่ม Logic showSuccess กลับเข้ามา +++
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000); // ซ่อนหลังจาก 3 วิ

        } catch (error) {
            console.error("Failed to submit question:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 8. ฟังก์ชันกดโหวต
    const handleUpvote = async (questionId) => {
        try {
            await upvoteQuestion(questionId);
            // ไม่ต้องอัปเดต state เอง:
            // Backend จะยิง 'question_updated' กลับมาหาทุกคน
            // และ Socket listener (ข้อ 3.2) จะจัดการอัปเดต UI เอง
        } catch (error) {
            console.error("Failed to upvote:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    const tabBase = "flex-1 py-3 px-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors duration-150";
    const tabActive = "text-blue-600 border-blue-600";
    const tabInactive = "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 2. Container จำกัดความกว้างกลางจอ (แบบ Slido) */}
            <div className="max-w-2xl mx-auto p-4 md:py-8">

                {/* 3. Header (ปรับให้เล็ก มินิมอล) */}
                <header className="mb-6 text-center">
                    <img
                        src="/Banner ถามสด.png"
                        alt="Thamsod Logo Banner"
                        // (ลดขนาด Banner ลง)
                        className="w-full max-w-xs mx-auto mb-4"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/ThamsodBanner.png";
                            e.target.alt = "Thamsod Banner";
                        }}
                    />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {session?.sessionName || "Q&A Session"}
                    </h1>
                    <p className="text-md text-gray-600 mt-1">
                        ส่งคำถามของคุณ หรือโหวตคำถามที่สนใจ
                    </p>
                </header>

                {/* 4. ฟอร์มส่งคำถาม (ปรับปรุงใหม่) */}
                <div className="bg-white p-5 rounded-lg shadow-md mb-8">
                    {showSuccess ? (
                        // 4.1 Success Message
                        <div div className="flex flex-col items-center justify-center h-36 text-green-600">
                            <CheckCircle size={48} />
                            <p className="text-xl font-semibold mt-3">
                                ส่งคำถามของคุณเรียบร้อยแล้ว!
                            </p>
                            <p className="text-gray-500">คำถามจะปรากฏเมื่อผู้ดูแลอนุมัติ</p>
                        </div>
                    ) : (
                        // 4.2 Form ปกติ
                        <form onSubmit={handleSubmitQuestion}>
                            <label htmlFor="question-input" className="text-lg font-semibold text-gray-700 mb-2 block">
                                Ask your question
                            </label>
                            <Textarea
                                id="question-input"
                                placeholder="พิมพ์คำถามของคุณที่นี่..."
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                rows={4}
                            />
                            <Button
                                type="submit"
                                className="w-full mt-4"
                                isLoading={isSubmitting}
                                disabled={isSubmitting} // (เพิ่ม disabled)
                            >
                                {/* (เพิ่ม icon) */}
                                <Send size={18} className="mr-2" />
                                {isSubmitting ? "Submitting..." : "Send Question"}
                            </Button>
                        </form>
                    )}
                </div>

                {/* 5. ส่วนรายการคำถาม */}
                <div>
                    {/* 5.1 Tabs (UPDATED) */}
                    <div className="flex border-b border-gray-300 mb-6">
                        <button
                            // UPDATED: Reset page
                            onClick={() => { setSortBy('votes'); setCurrentPage(1); }}
                            className={`${tabBase} ${sortBy === 'votes' ? tabActive : tabInactive}`}
                        >
                            Top (โหวตสูงสุด)
                        </button>
                        <button
                            // UPDATED: Reset page
                            onClick={() => { setSortBy('time'); setCurrentPage(1); }}
                            className={`${tabBase} ${sortBy === 'time' ? tabActive : tabInactive}`}
                        >
                            Recent (ล่าสุด)
                        </button>
                        {/* +++ NEW TAB +++ */}
                        <button
                            // UPDATED: Reset page
                            onClick={() => { setSortBy('pending'); setCurrentPage(1); }}
                            className={`${tabBase} ${sortBy === 'pending' ? tabActive : tabInactive}`}
                        >
                            Pending (รออนุมัติ)
                        </button>
                    </div>

                    {/* 5.2 List (UPDATED) */}
                    <div className="space-y-5">
                        {sortedQuestions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                {sortBy === 'pending'
                                    ? "คุณยังไม่มีคำถามที่รอการอนุมัติ"
                                    : "ยังไม่มีคำถามที่ได้รับการอนุมัติ..."}
                            </p>
                        ) : (
                            paginatedQuestions.map((q) => (
                                sortBy === 'pending' ? (
                                    // 1. ถ้า Tab เป็น 'pending' ให้ใช้ Card ใหม่
                                    <PendingQuestionCard
                                        key={q._id}
                                        question={q}
                                    />
                                ) : (
                                    // 2. ถ้าเป็น Tab อื่น (Top, Recent) ใช้ Card เดิม
                                    <QuestionCard
                                        key={q._id}
                                        question={q}
                                        isGuest={true}
                                        isVoted={q.voters.includes(guestId) || false}
                                        onUpvote={() => handleUpvote(q._id)} // <-- เอาเงื่อนไขออกได้เลย
                                        isHighlighted={q.isHighlighted}
                                    />
                                )
                            ))
                        )}
                    </div>

                    {/* 5.3 Pagination (เหมือนเดิม) */}
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default GuestSession;