// src/pages/HostDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getHostSessions,
    createSession,
    updateSession,
    deleteSession,
} from "../api/sessionApi";
import { getSessionQuestions } from "../api/questionApi";
import { exportToCsv } from "../utils/exportUtils";
import Navbar from "../components/common/Navbar";
import SessionFormModal from "../components/common/SessionFormModal";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { Plus, Edit, Trash2, ClipboardCopy, Users, Download } from "lucide-react";

const HostDashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // States for Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentSession, setCurrentSession] = useState(null); // Session ที่กำลังจะแก้ไข
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [exportLoadingId, setExportLoadingId] = useState(null);

    // 1. Fetch Sessions
    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const res = await getHostSessions();
            setSessions(res.data.data);
        } catch (err) {
            setError("Failed to load sessions.");
            navigate("/host/auth");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    // 2. Handler: Create
    const handleCreate = async (formData) => {
        setIsModalLoading(true);
        try {
            await createSession(formData.sessionName, formData.description);
            setIsCreateModalOpen(false);
            fetchSessions(); // โหลดซ้ำ
        } catch (err) {
            console.error(err);
        } finally {
            setIsModalLoading(false);
        }
    };

    // 3. Handler: Update (ตามที่คุณขอ)
    const handleUpdate = async (formData) => {
        setIsModalLoading(true);
        try {
            await updateSession(currentSession._id, formData);
            setIsEditModalOpen(false);
            setCurrentSession(null);
            fetchSessions(); // โหลดซ้ำ
        } catch (err) {
            console.error(err);
        } finally {
            setIsModalLoading(false);
        }
    };

    // 4. Handler: Delete
    const handleDelete = async (sessionId) => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            try {
                await deleteSession(sessionId);
                fetchSessions(); // โหลดซ้ำ
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Helper: Copy code
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Copied code: ${code}`);
    };

    // NEW: 5. Handler: Export CSV
    const handleExport = async (sessionId, sessionName) => {
        setExportLoadingId(sessionId); // เริ่ม Loading ที่ปุ่มนี้
        try {
            // Fetch คำถามของ session นี้โดยเฉพาะ
            const res = await getSessionQuestions(sessionId);
            const questions = res.data.data;

            if (questions.length === 0) {
                alert("This session has no questions to export.");
            } else {
                // สร้างชื่อไฟล์ (แทนที่ space ด้วย _)
                const filename = `${sessionName.replace(/\s+/g, '_')}_questions.csv`;
                exportToCsv(questions, filename);
            }
        } catch (err) {
            console.error("Failed to fetch questions for export:", err);
            alert("Could not export questions. Please try again.");
        } finally {
            setExportLoadingId(null); // หยุด Loading
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">My Sessions</h2>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create New Session
                    </Button>
                </div>

                {/* 5. Session List */}
                {isLoading && <Spinner size="lg" />}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.length === 0 ? (
                            <p className="text-gray-500 col-span-full text-center">
                                You haven't created any sessions yet.
                            </p>
                        ) : (
                            sessions.map((session) => (
                                <Card key={session._id} className="flex flex-col">
                                    <Card.Content className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            {/* Status Badge */}
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Users size={16} />
                                                <span className="text-sm font-medium">
                                                    {session.guestCount}
                                                </span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${session.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                {session.status}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mt-3">
                                            {session.sessionName}
                                        </h3>
                                        <p className="text-gray-600 mt-2 truncate">
                                            {session.description || "No description"}
                                        </p>
                                    </Card.Content>
                                    <Card.Footer>
                                        <div className="mb-4">
                                            <label className="text-sm font-medium text-gray-500">
                                                Session Code:
                                            </label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-2xl font-bold tracking-widest text-blue-700">
                                                    {session.sessionCode}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(session.sessionCode)}
                                                    className="text-gray-500 hover:text-blue-600"
                                                >
                                                    <ClipboardCopy size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/host/session/${session._id}`}
                                                className="w-full"
                                            >
                                                <Button variant="primary" className="w-full">
                                                    Manage
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleExport(session._id, session.sessionName)}
                                                disabled={exportLoadingId === session._id}
                                                title="Export Questions (CSV)"
                                            >
                                                {exportLoadingId === session._id ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <Download size={16} />
                                                )}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setCurrentSession(session);
                                                    setIsEditModalOpen(true);
                                                }}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(session._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* 6. Modals */}
            <SessionFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreate}
                isLoading={isModalLoading}
            />

            {currentSession && (
                <SessionFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdate}
                    initialData={currentSession}
                    isLoading={isModalLoading}
                />
            )}
        </div>
    );
};

export default HostDashboard;