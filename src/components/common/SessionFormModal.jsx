// src/components/common/SessionFormModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const SessionFormModal = ({
    isOpen,
    onClose,
    onSubmit, // ฟังก์ชัน API (Create หรือ Update)
    initialData = null, // ถ้ามี data = Edit Mode
    isLoading = false,
}) => {
    // 1. ตั้งค่า State สำหรับฟอร์ม
    const [formData, setFormData] = useState({
        sessionName: "",
        description: "",
        status: "active",
    });

    // 2. ถ้าเป็น Edit Mode (มี initialData) ให้กรอกข้อมูลเดิมลงฟอร์ม
    useEffect(() => {
        if (initialData) {
            setFormData({
                sessionName: initialData.sessionName || "",
                description: initialData.description || "",
                status: initialData.status || "active",
            });
        } else {
            // ถ้าเป็น Create Mode, ให้เคลียร์ฟอร์ม
            setFormData({ sessionName: "", description: "", status: "active" });
        }
    }, [initialData, isOpen]); // ทำงานใหม่เมื่อ Modal เปิด หรือ data เปลี่ยน

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 3. เมื่อกด Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // ส่งข้อมูลในฟอร์มกลับไปให้ Dashboard
    };

    const isEditMode = !!initialData;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Session" : "Create New Session"}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Session Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Name (Required)
                    </label>
                    <Input
                        type="text"
                        name="sessionName"
                        value={formData.sessionName}
                        onChange={handleChange}
                        placeholder="e.g., Company All-Hands Q&A"
                        required
                    />
                </div>

                {/* 2. Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="e.g., A session for answering questions from staff."
                        rows={3}
                    />
                </div>

                {/* 3. Status (ตามที่คุณขอ) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* 4. Actions */}
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isLoading}>
                        {isEditMode ? "Save Changes" : "Create Session"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default SessionFormModal;