// src/components/ui/Spinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const Spinner = ({ size = "md" }) => {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-10 w-10",
        lg: "h-16 w-16",
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Loader2
                className={`animate-spin text-blue-600 ${sizeClasses[size]}`}
            />
        </div>
    );
};

export default Spinner;