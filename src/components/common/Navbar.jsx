// src/components/common/Navbar.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";


const Navbar = () => {
    const { user, logout } = useAuth();

    const username = user?.data?.data?.user.username || "Host";

    return (
        <nav className="bg-white shadow-md w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <img
                            src="/Banner ถามสด.png"
                            alt="Thamsod Logo Banner"
                            className="h-12 w-auto"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/ThamsodBanner.png";
                                e.target.alt = "Thamsod Banner";
                            }}
                        />
                        {/* <h1 className="text-2xl font-bold text-blue-700">Q&A Dashboard</h1> */}
                    </div>
                    <div className="flex items-center">
                        {user && (
                            <span className="text-gray-700 mr-4">
                                Welcome, <strong>{username}</strong>
                            </span>
                        )}
                        <button
                            onClick={logout}
                            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} className="mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;