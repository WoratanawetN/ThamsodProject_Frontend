// src/pages/HostAuth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin, register as apiRegister } from "../api/authApi";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const HostAuth = () => {
    const [isLoginView, setIsLoginView] = useState(true); // true = Login, false = Register
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("กรุณากรอก Username และ Password");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            let response;
            if (isLoginView) {
                // 1. เรียก API Login
                response = await apiLogin(username, password);
            } else {
                // 2. เรียก API Register
                response = await apiRegister(username, password);
            }

            // 3. ถ้าสำเร็จ (ทั้ง Login/Register) จะได้ Token
            const { token } = response.data.data;

            // 4. เรียก login() จาก AuthContext เพื่อเก็บ Token
            auth.login(token, "host");

            // 5. ส่ง Host ไปหน้า Dashboard
            navigate("/host/dashboard");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
            <a href="/">
                <img
                    src="/Banner ถามสด.png"
                    alt="Thamsod Logo Banner"
                    className="w-full max-w-lg mb-4 animate-fade-in-down"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/ThamsodBanner.png";
                        e.target.alt = "Thamsod Banner";
                    }}
                />
            </a>
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <Card.Content>
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            {isLoginView ? "Sign In" : "Sign Up"}
                        </h2>

                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                        )}
                    </Card.Content>
                    <Card.Footer>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {isLoginView ? "Sign In" : "Sign Up"}
                        </Button>
                        <p className="text-center text-sm text-gray-600 mt-4">
                            {isLoginView ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsLoginView(!isLoginView)}
                                className="font-medium text-blue-600 hover:underline ml-1"
                            >
                                {isLoginView ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                        {!isLoginView && (
                            <p className="text-center text-xs text-gray-500 mt-2">
                                By signing up, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                            </p>
                        )}
                    </Card.Footer>
                </form>
            </Card>
        </div>
    );
};

export default HostAuth;