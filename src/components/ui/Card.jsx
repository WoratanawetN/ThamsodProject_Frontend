// src/components/ui/Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
        >
            <div className="p-6">{children}</div>
        </div>
    );
};

// เราสามารถสร้าง Sub-components เพื่อจัดระเบียบได้ (optional)
const CardHeader = ({ children, className = "" }) => (
    <div className={`pb-4 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`py-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
    <div className={`pt-4 border-t border-gray-200 ${className}`}>
        {children}
    </div>
);

// Export Card และ sub-components
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;