import React from "react";
import { ThumbsUp, Star } from "lucide-react";
import Button from "../ui/Button";

const QuestionCard = ({
    question,
    onUpvote,
    isVoted,
    isGuest = false,
    isHighlighted = false,
}) => {
    // [แก้] 1. Destructure 'createdAt' ออกมาด้วย
    const { content, author, upvotes, createdAt } = question;

    // 2. กำหนดสไตล์สำหรับปุ่มโหวต (ถ้าโหวตแล้วจะเป็นสีฟ้า)
    const voteButtonClasses = isVoted
        ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" // <-- เพิ่ม hover
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"; // <-- เพิ่ม hover

    // 3. กำหนดสไตล์สำหรับ Card
    const cardClasses = isHighlighted
        ? "border-4 border-blue-500 shadow-xl"
        : "border border-transparent";

    // [เพิ่ม] 4. Format วันที่และเวลา
    const formattedDate = new Date(createdAt).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div
            className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${cardClasses}`}
        >
            {/* 5. แสดงดาว ถ้าถูกไฮไลท์ */}
            {isHighlighted && (
                <div className="flex items-center text-yellow-500 mb-2">
                    <Star size={18} fill="currentColor" className="mr-2" />
                    <span className="font-semibold">Highlighted</span>
                </div>
            )}

            {/* 6. เนื้อหาคำถาม */}
            <p className="text-gray-800 text-lg mb-4">{content}</p>

            {/* [แก้] 7. ปรับ Layout ของ Footer */}
            <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">

                {/* 7.1 ส่วนของการโหวต (แสดงเฉพาะ Guest) */}
                {isGuest ? (
                    <Button
                        onClick={onUpvote}
                        variant={isVoted ? "primary" : "secondary"}
                        className={`flex items-center gap-2 ${voteButtonClasses}`}
                    >
                        <ThumbsUp size={20} />
                        <span>{upvotes}</span>
                    </Button>
                ) : (
                    // ถ้าไม่ใช่ Guest (เช่น Viewer) ให้แสดงจำนวนโหวตเฉยๆ
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <ThumbsUp size={20} />
                        <span>{upvotes}</span>
                    </div>
                )}

                {/* 7.2 [เพิ่ม] Meta Info (Author & Date) */}
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

export default QuestionCard;