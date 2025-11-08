// src/components/ui/Textarea.jsx
import React from "react";

const Textarea = ({
    placeholder,
    value,
    onChange,
    disabled = false,
    className = "",
    rows = 4,
    ...props
}) => {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={rows}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            {...props}
        />
    );
};

export default Textarea;