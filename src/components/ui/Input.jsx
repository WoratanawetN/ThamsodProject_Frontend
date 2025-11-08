// src/components/ui/Input.jsx
import React from "react";

const Input = ({
    type = "text",
    placeholder,
    value,
    onChange,
    disabled = false,
    className = "",
    ...props
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            {...props}
        />
    );
};

export default Input;