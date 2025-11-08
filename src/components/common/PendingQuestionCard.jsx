import React from "react";
// 1. เราจะใช้ไอคอน Clock (นาฬิกา) แทน
import { Clock } from "lucide-react";

// 2. (Optional) สร้างฟังก์ชัน format วันที่ให้สั้นลงสำหรับ Pending
const formatPendingDate = (isoDate) => {
    return new Date(isoDate).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const PendingQuestionCard = ({ question }) => {
    const { content, author, createdAt } = question;
    const formattedDate = formatPendingDate(createdAt);

    return (
        // 3. ใช้ style ที่คล้ายกัน แต่ตัดส่วนที่ไม่จำเป็นออก
        <div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
            {/* 4. เนื้อหาคำถาม */}
            <p className="text-gray-800 text-lg mb-4">{content}</p>

            {/* 5. Footer แบบใหม่ (ไม่มีปุ่ม Like) */}
            <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">

                {/* 5.1 ด้านซ้าย: แสดงสถานะ Pending */}
                <div className="flex items-center gap-2 text-yellow-600">
                    <Clock size={18} />
                    <span className="text-sm font-semibold">รอการอนุมัติ</span>
                </div>

                {/* 5.2 ด้านขวา: แสดง Meta Info (เหมือนเดิม) */}
                <div className="text-right">
                    <span className="block text-sm font-medium text-gray-500">
                        by {author}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                        {formattedDate}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PendingQuestionCard;