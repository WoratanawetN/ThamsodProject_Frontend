// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// --- นำเข้าหน้า Page ต่างๆ (เราจะสร้างไฟล์เหล่านี้ในขั้นตอนถัดไป) ---
// (สมมติว่าเราสร้างไฟล์เปล่าๆ ไว้ใน src/pages/ แล้ว)
import LandingPage from "./pages/LandingPage";
import GuestJoin from "./pages/GuestJoin";
import GuestSession from "./pages/GuestSession";
import HostAuth from "./pages/HostAuth";
import HostDashboard from "./pages/HostDashboard";
import HostSessionManager from "./pages/HostSessionManager";
import ViewerDisplay from "./pages/ViewerDisplay";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <Routes>
        {/* 1. หน้าแรก (เลือก Role) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Flow ของ Guest */}
        <Route path="/join" element={<GuestJoin />} />
        <Route path="/session/" element={<GuestSession />} />

        {/* 3. Flow ของ Host */}
        <Route path="/host/auth" element={<HostAuth />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route
          path="/host/session/:sessionId"
          element={<HostSessionManager />}
        />

        {/* 4. Flow ของ Viewer (หน้าจอแสดงผล) */}
        {/* เราอาจใช้ /join สำหรับ Viewer ด้วย หรือจะแยกก็ได้ */}
        {/* ในที่นี้เราใช้หน้า join เดียวกับ Guest ไปเลย */}
        <Route path="/display/" element={<ViewerDisplay />} />

        {/* หน้า 404 (เผื่อไว้) */}
        <Route
          path="*"
          element={
            <div className="text-center p-10">
              <h1 className="text-3xl font-bold">404 - Not Found</h1>

              <p className="mt-4">ขออภัย หน้าที่คุณค้นหาไม่มีอยู่จริง</p>
              <a href="/" className="text-blue-600 hover:underline mt-6 inline-block">
                กลับสู่หน้าหลัก
              </a>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;