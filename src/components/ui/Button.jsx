// src/components/ui/Button.jsx
import React from "react";
import { Loader2 } from "lucide-react"; // ไอคอนหมุนๆ จาก lucide-react

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary", // 'primary', 'secondary', 'danger'
    disabled = false,
    isLoading = false,
    className = "",
    ...props
}) => {
    // 1. เลือกสไตล์ตาม variant
    const baseStyle =
        "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary:
            "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-gray-300",
        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    // 2. จัดการสถานะ disabled
    const disabledStyle = "disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyle} ${variantStyles[variant]} ${disabledStyle} ${className}`}
            {...props}
        >
            {/* 3. ถ้า Loading ให้แสดง Spinner แทน */}
            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {children}
        </button>
    );
};

export default Button;