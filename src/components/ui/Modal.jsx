// src/components/ui/Modal.jsx
import React from "react";
import { X } from "lucide-react"; // ไอคอนปุ่มปิด

// เราใช้ <dialog> HTML element ซึ่งทันสมัยและจัดการ a11y (accessibility) ได้ดี
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
        return null;
    }

    // ปิด Modal เมื่อคลิกที่พื้นหลังสีดำ
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        // 1. Backdrop (พื้นหลังสีดำ)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            {/* 2. ตัว Modal (กรอบสีขาว) */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 transform transition-all">
                {/* 3. Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* 4. Modal Body (เนื้อหาหลัก) */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Modal;