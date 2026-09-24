# 🎤 Thamsod (ถามสด) — Real-time Interactive Q&A Platform

<div align="center">

![Thamsod Banner](https://img.shields.io/badge/Platform-Interactive%20Q%26A-0ea5e9?style=for-the-badge)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite 7](https://img.shields.io/badge/Vite%207-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Commercial Success](https://img.shields.io/badge/Status-Commercial%20Acquisition-emerald?style=for-the-badge)

<p align="center">
  <b>เว็บแอปพลิเคชันระบบถาม-ตอบสำหรับงานสัมมนาและเวทีเสวนาแบบเรียลไทม์ (Frontend Application)</b><br>
  แก้ปัญหาผู้ฟังไม่กล้าถามในที่สาธารณะ พร้อมระบบคัดกรองคำถามสำหรับผู้จัดงานและหน้าจอแสดงผลบนเวทีสด
</p>

[🌐 ทดลองใช้งาน (Live Demo)](https://thamsod.pages.dev/) • [📊 สไลด์นำเสนอ (Canva)](https://canva.link/t752z7d3mtqvueo)

</div>

---

## 🏆 ความสำเร็จเชิงพาณิชย์ (Commercial Success)

> **"Thamsod"** พัฒนาขึ้นเป็นโครงงานในรายวิชา **CSI400 (Software Project)** สาขาวิทยาการคอมพิวเตอร์ คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยศรีปทุม โดยได้รับการออกแบบสถาปัตยกรรมระบบและทดสอบความเสถียรของระบบอย่างจริงจัง จนได้รับความไว้วางใจจาก **บริษัท อโณณา เฮ้าส์ จำกัด (ANONA House Co., Ltd.)** ขอซื้อลิขสิทธิ์ระบบไปต่อยอดและใช้งานจริงในงานประชุมวิชาการและการสัมมนาระดับประเทศในชื่อ **"AskEvent"**

---

## 🎯 ปัญหาและแรงบันดาลใจ (Problem & Solution)

### ❌ ปัญหาในงานสัมมนาแบบเดิม (The Problem):
1. **Public Speaking Anxiety**: ผู้เข้าร่วมงานสัมมนาส่วนใหญ่ไม่กล้าเปิดไมโครโฟนหรือยกมือถามคำถามต่อหน้าคนหมู่มาก ทำให้การแลกเปลี่ยนความคิดเห็นเกิดขึ้นน้อย
2. **Inefficient Moderation**: ผู้จัดงานไม่สามารถจัดระเบียบ คัดกรองคำถามที่ไม่เหมาะสม หรือเรียงลำดับความสำคัญของคำถามที่ผู้ฟังส่วนใหญ่สนใจได้ในเวลาจำกัด
3. **No Real-time Audience Feedback**: วิทยากรไม่เห็นภาพรวมว่าผู้ฟังกำลังสงสัยหรือให้ความสนใจในประเด็นไหนมากที่สุด

### ✅ ทางออกด้วย Thamsod (The Solution):
* ผู้ฟังสามารถ **สแกน QR Code** เข้าร่วมเซสชันได้ทันทีโดยไม่ต้องติดตั้งแอปหรือสมัครสมาชิก
* ส่งคำถามได้ทั้งแบบ **ระบุชื่อ** หรือ **ไม่ระบุตัวตน (Anonymous)** พร้อมระบบกด **Upvote** แบบเรียลไทม์
* ผู้จัดงานมี **Dashboard สำหรับคัดกรอง (Approve / Reject / Pin / Highlight)** คำถามก่อนขึ้นจอใหญ่
* หน้าจอ **Presentation Display** แสดงคำถามบนจอโปรเจกเตอร์เวทีสด พร้อมแอนิเมชันเน้นคำถามที่กำลังตอบแบบเรียลไทม์

---

## 👥 ระบบ 3 บทบาทการใช้งาน (User Roles & Responsibilities)

```
                         ┌────────────────────────────────────────┐
                         │       Thamsod Web Ecosystem            │
                         └──────────────────┬─────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
               ▼                            ▼                            ▼
      🎤 Host (ผู้จัดงาน)          🙋‍♂️ Guest (ผู้ร่วมงาน)       📺 Viewer (จอเวที)
   ┌───────────────────────┐    ┌───────────────────────┐    ┌───────────────────────┐
   │ • JWT Authentication  │    │ • Scan QR / Code Join │    │ • Big Screen Display  │
   │ • Create & Manage Room│    │ • Ask Questions       │    │ • Real-time Upvotes   │
   │ • Moderate (Approve)  │    │ • Anonymous Option    │    │ • Highlight Active Q  │
   │ • Live Pin / Spotlight│    │ • Real-time Upvoting  │    │ • Clean & Dark Theme  │
   │ • Export Report (CSV) │    │ • Instant Status Sync │    │ • Projector Friendly  │
   └───────────────────────┘    └───────────────────────┘    └───────────────────────┘
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            ▼
                           [ WebSocket (Socket.io) Real-time ]
```

### 1. 🎤 Host Flow (รับผิดชอบ Frontend โดย: วรเดช อาจวิชัย)
* **Authentication**: ระบบเข้าสู่ระบบ/ลงทะเบียนด้วย JWT Token และจัดเก็บ Session ใน LocalStorage
* **Session Dashboard**: สร้างห้องสัมมนาใหม่, แก้ไขข้อมูล, ปิดเซสชัน, และเปิด-ปิดรับคำถาม
* **Moderation Center**: กล่องตรวจคำถาม (Pending Queue) ให้ Host เลือกว่าจะ **"อนุมัติ (Approve)"** หรือ **"ไม่อนุมัติ (Reject)"** ก่อนแสดงขึ้นจอ
* **Live Spotlight / Pin**: ปักหมุดคำถามที่วิทยากรกำลังตอบ เพื่อให้จอแสดงผลเน้นคำถามนั้นแบบชัดเจน
* **Export Reports**: ระบบส่งออกคำถามและสถิติเป็นไฟล์ CSV เพื่อนำไปทำสรุปผลการจัดงาน

### 2. 🙋‍♂️ Guest Flow (รับผิดชอบ Frontend โดย: ณัฐดนัย รอดมุ้ย)
* **Frictionless Entry**: เข้าร่วมห้องผ่านการสแกน QR Code หรือพิมพ์รหัส Session 6 หลัก โดยไม่ต้องกรอกข้อมูลส่วนตัว
* **Ask with Confidence**: ส่งคำถามได้อย่างสบายใจด้วยตัวเลือก **"ส่งแบบไม่ระบุชื่อ (Anonymous)"**
* **Democratic Upvoting**: กดโหวตคำถามที่ตรงใจ คำถามที่ได้โหวตมากที่สุดจะถูกดันขึ้นไปอยู่ด้านบนอัตโนมัติ
* **Live Feedback**: เห็นการเปลี่ยนแปลงของคำถามและผลโหวตทันทีโดยไม่ต้องรีเฟรชหน้าจอ (Zero Refresh)

### 3. 📺 Viewer Display Flow (รับผิดชอบ Frontend โดย: วรธนเวธน์ ณีศะนันทร์)
* **Optimized for Large Screens**: ออกแบบ UI ให้ตัวหนังสือคมชัด อ่านง่ายจากระยะไกลสำหรับจอโปรเจกเตอร์หรือจอ LED เวที
* **Real-time Leaderboard**: แสดงคำถามที่ได้รับการอนุมัติแล้ว จัดเรียงตามคะแนนความนิยม
* **Highlight Animation**: แอนิเมชันเน้นคำถามที่กำลังตอบแบบอัตโนมัติเมื่อ Host สั่ง Spotlight

---

## 🏗️ สถาปัตยกรรมระบบ (3.1 System Architecture)

ระบบ Thamsod ออกแบบสถาปัตยกรรมตามแนวทาง **Decoupled Client-Server & Event-Driven Architecture** โดยผสานการทำงานระหว่าง **RESTful API** สำหรับคำสั่งแบบ Stateless CRUD และ **WebSocket (Socket.io Gateway)** สำหรับการแพร่กระจายข้อมูลแบบสองทาง (Full-Duplex Bidirectional Sync) แบบเรียลไทม์:

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|    +-------------------+   +--------------------+   +-----------------------+     |
|    |   Host Manager    |   |   Guest Mobile     |   |  Presentation Viewer  |     |
|    |   (React 19)      |   |   (React 19)       |   |  (React 19)           |     |
|    +---------+---------+   +---------+----------+   +-----------+-----------+     |
|              |                       |                          |                 |
+--------------|-----------------------|--------------------------|-----------------+
               |                       |                          |
               | (1) REST (Axios)      |                          | (2) WebSockets (Socket.io)
               | [HTTP POST/GET/PUT]   |                          | [Event Emitter / Listener]
               v                       v                          v
+-----------------------------------------------------------------------------------+
|                           API GATEWAY & ROUTING LAYER                             |
|                                                                                   |
|           +-----------------------+           +------------------------+          |
|           |   REST API Gateway    |           |   WebSocket Gateway    |          |
|           |   (Express Router)    |           |   (Socket.io Engine)   |          |
|           +-----------+-----------+           +-----------+------------+          |
+-----------------------|-----------------------------------|-----------------------+
                        |                                   |
                        +-----------------+-----------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        MICROSERVICES & BUSINESS LOGIC LAYER                       |
|                                                                                   |
|   +-----------------------+   +-----------------------+   +-------------------+   |
|   |  Authentication Svc   |   |   Session Services    |   |   Question Svc    |   |
|   |  (JWT / Bcrypt / Auth)|   |   (Room / Lifecycle)  |   |   (Upvote / Mod)  |   |
|   |  [Dev: วรเดช อาจวิชัย] |   |  [Dev: วรธนเวธน์ ฯ]   |   | [Dev: ณัฐดนัย ฯ]  |   |
|   +-----------+-----------+   +-----------+-----------+   +---------+---------+   |
+---------------|---------------------------|-------------------------|-------------+
                |                           |                         |
                v                           v                         v
+-----------------------------------------------------------------------------------+
|                             DATA PERSISTENCE LAYER                                |
|                                                                                   |
|                        +---------------------------+                              |
|                        |     MongoDB Database      |                              |
|                        |  (Users, Sessions, Q&A)   |                              |
|                        +---------------------------+                              |
+-----------------------------------------------------------------------------------+
```

---

## 📋 ตารางการแบ่งหน้าที่ตาม API (Report API Checklist)

การพัฒนาระบบเบื้องหลัง (Backend API) และการเชื่อมต่อฝั่งหน้าบ้านถูกแบ่งความรับผิดชอบอย่างชัดเจนตามขอบเขตงาน:

### 1. Authentication Service
| Service | Endpoint Type | Method | Endpoint Path | ผู้รับผิดชอบพัฒนา |
| :--- | :---: | :---: | :--- | :--- |
| **Auth** | Public | `POST` | `/api/auth/register` | **วรเดช อาจวิชัย** |
| **Auth** | Public | `POST` | `/api/auth/login` | **วรเดช อาจวิชัย** |
| **Auth** | Host | `GET` | `/api/auth/me` | **วรเดช อาจวิชัย** |

### 2. Session Services
| Service | Endpoint Type | Method | Endpoint Path | ผู้รับผิดชอบพัฒนา |
| :--- | :---: | :---: | :--- | :--- |
| **Session** | Guest / Viewer | `POST` | `/api/sessions/join` | **วรเดช อาจวิชัย** |
| **Session** | Guest / Viewer | `GET` | `/api/sessions/current` | **วรธนเวธน์ ณีศะนันทร์** |
| **Session** | Host | `POST` | `/api/sessions` | **วรธนเวธน์ ณีศะนันทร์** |
| **Session** | Host | `GET` | `/api/sessions/` | **วรธนเวธน์ ณีศะนันทร์** |
| **Session** | Host | `PUT` | `/api/sessions/{sessionId}` | **วรธนเวธน์ ณีศะนันทร์** |
| **Session** | Host | `DELETE` | `/api/sessions/{sessionId}` | **วรธนเวธน์ ณีศะนันทร์** |

### 3. Question Services
| Service | Endpoint Type | Method | Endpoint Path | ผู้รับผิดชอบพัฒนา |
| :--- | :---: | :---: | :--- | :--- |
| **Question** | Guest | `POST` | `/api/questions` | **ณัฐดนัย รอดมุ้ย** |
| **Question** | ทั้งสามฝ่าย | `GET` | `/api/questions/session/{sessionId}` | **ณัฐดนัย รอดมุ้ย** |
| **Question** | Guest | `PUT` | `/api/questions/{questionId}/upvote` | **ณัฐดนัย รอดมุ้ย** |
| **Question** | Host | `PUT` | `/api/questions/{questionId}/status` | **ณัฐดนัย รอดมุ้ย** |
| **Question** | Host | `PUT` | `/api/questions/{questionId}/highlight` | **ณัฐดนัย รอดมุ้ย** |

---

## 📊 เนื้อหาส่วนที่ 5: สรุปผลโครงงานและข้อเสนอแนะ

### 5.1 สรุปผลโครงงาน (Project Summary)
โครงงานระบบถาม-ตอบสำหรับงานสัมมนาแบบเรียลไทม์ (Thamsod) ได้รับการออกแบบ พัฒนา และทดสอบเสร็จสิ้นอย่างสมบูรณ์ตามวัตถุประสงค์และขอบเขตที่ตั้งไว้:
1. **การแก้ปัญหา Public Speaking Anxiety**: ระบบเปิดโอกาสให้ผู้เข้าร่วมงานสามารถส่งคำถามทั้งแบบระบุชื่อและแบบไม่ระบุตัวตน (Anonymous) ช่วยเพิ่มอัตราการมีส่วนร่วม (Engagement Rate) ในงานสัมมนาอย่างมีนัยสำคัญ
2. **การสื่อสารสองทางแบบเรียลไทม์**: การนำ WebSocket (Socket.io) มาใช้งานช่วยลดความล่าช้า (Low Latency) ในการส่งคำถามและการกด Upvote ทำให้ทุกคนในห้องสัมมนาเห็นข้อมูลตรงกันทันทีโดยไม่ต้องกดรีเฟรชหน้าจอ
3. **ประสิทธิภาพการบริหารจัดการของผู้จัดงาน**: หน้าต่าง Host Control สามารถคัดกรองคำถามก่อนขึ้นจอเวทีได้อย่างรวดเร็ว ป้องกันคำถามที่ไม่เหมาะสมและเลือกประเด็นที่มีการโหวตสูงสุดมาตอบได้อย่างตรงเป้าหมาย
4. **ความพร้อมใช้งานจริงในระดับอุตสาหกรรม**: ผลงานมีความเสถียรและตอบโจทย์เชิงธุรกิจจน **บริษัท อโณณา เฮ้าส์ จำกัด (ANONA House Co., Ltd.)** ได้ขอซื้อลิขสิทธิ์ระบบนำไปใช้จริงในงานสัมมนาระดับประเทศในชื่อ **"AskEvent"**

### 5.2 ปัญหาที่พบในโครงงาน (Problems & Challenges Encountered)
1. **การจัดการ WebSocket Concurrency ในสภาวะผู้ใช้จำนวนมาก**: ในช่วงทดสอบการยิง Upvote พร้อมกันเป็นจำนวนมาก อาจเกิดภาวะ Race Condition ของคะแนนโหวตหากไม่มีการทำ Throttling / Debouncing บน Client และ Concurrency Control บน Database
2. **ปัญหาการหลุดการเชื่อมต่อเมื่ออุปกรณ์พับหน้าจอ (Mobile Screen Sleep)**: บนอุปกรณ์มือถือ เมื่อผู้ใช้สลับแอปหรือหน้าจอดับ การเชื่อมต่อ Socket.io อาจถูกระบบปฏิบัติการตัดการทำงาน ทำให้ต้องออกแบบระบบ Reconnection และ State Synchronization อัตโนมัติเมื่อผู้ใช้เปิดจอกลับมา
3. **การควบคุมความยาวและรูปแบบข้อความคำถาม (Spam & Flood Prevention)**: ผู้ใช้อาจพิมพ์ข้อความยาวเกินไปหรือพิมพ์อักขระพิเศษที่ทำให้การ์ดแสดงผลบนจอเวที (Viewer Display) เสียรูปทรง จึงจำเป็นต้องมี Validation ทั้งหน้าบ้านและหลังบ้านอย่างรัดกุม
4. **การบริหารจัดการ State ร่วมกันใน Frontend**: การแยกบทบาท 3 หน้าจอ (Host, Guest, Viewer) ทำให้ต้องควบคุมสิทธิ์และการแสดงผลข้อมูลไม่ให้ปะปนกัน โดยเฉพาะสถานะคำถามที่รออนุมัติ (Pending) ซึ่งต้องมองเห็นเฉพาะฝั่ง Host เท่านั้น

### 5.3 ข้อเสนอแนะสำหรับการพัฒนาต่อยอด (Future Recommendations)
1. **การนำ AI / LLM เข้ามาช่วยคัดกรองคำถามอัตโนมัติ (AI Auto-Moderation)**: ควรพัฒนาโมเดลปัญญาประดิษฐ์ตรวจจับคำหยาบ (Profanity Filter), จำแนกโทนอารมณ์ (Sentiment Analysis), และจัดหมวดหมู่คำถามตามประเด็นการบรรยายโดยอัตโนมัติเพื่อลดภาระงานของ Host
2. **ระบบสรุปประเด็นสัมมนาหลังจบงาน (AI Session Summary & Analytics)**: เพิ่มฟังก์ชันสรุปภาพรวมคำถามที่ผู้ฟังให้ความสนใจสูงสุด และสร้างรายงานสรุปผลการจัดงาน (Executive Summary PDF) ส่งให้อีเมลผู้จัดงานทันที
3. **การขยายสถาปัตยกรรมรองรับระดับหมื่นผู้ใช้ (Horizontal Scalability & Redis Pub/Sub)**: ในกรณีที่นำไปใช้ในงานระดับสนามกีฬาหรือคอนเสิร์ตใหญ่ ควรเพิ่ม Redis Adapter เพื่อเชื่อมโยง WebSocket หลายเซิร์ฟเวอร์เข้าด้วยกัน
4. **ระบบห้องสัมมนาย่อยแบบ Multi-Room & Breakout Sessions**: พัฒนาให้ใน 1 Event สามารถมีหลายห้องบรรยายคู่ขนานกันได้ โดยผู้เข้าร่วมสามารถสลับห้องและรับส่งคำถามแยกกันตามรหัสห้องย่อย

---

## 🛠️ เทคโนโลยีที่ใช้พัฒนา (Tech Stack)

### Frontend Core:
* **UI Library**: [React 19](https://react.dev/) — สถาปัตยกรรม Component-Driven และ Reactive State
* **Build Tool**: [Vite 7](https://vite.dev/) — โมเดิร์นบิลด์ทูลที่เร็วระดับมิลลิวินาที
* **Routing**: [React Router DOM v7](https://reactrouter.com/) — ระบบ Client-Side Routing ที่ลื่นไหล
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) — Utility-first CSS ยุคใหม่
* **Real-time Communication**: [Socket.io Client](https://socket.io/) — การสื่อสารสองทางแบบ Full-Duplex WebSockets
* **HTTP Client**: [Axios](https://axios-http.com/) — พร้อม Request Interceptor ฝัง Bearer JWT Token อัตโนมัติ
* **Icons & Utility**: [Lucide React](https://lucide.dev/), [QRCode.react](https://github.com/zpao/qrcode.react), [UUID](https://github.com/uuidjs/uuid)

---

## 📂 โครงสร้างโปรเจกต์ (Project Directory Structure)

```text
Thamsod Workspace/
├── public/                 # Static assets, favicon, logos
├── src/
│   ├── api/                # API Service Layer (Axios instances & endpoints)
│   │   ├── apiClient.js        # Axios instance with JWT Authorization Interceptor
│   │   ├── authApi.js          # Host Login & Register APIs
│   │   ├── questionApi.js      # Question CRUD & Upvote APIs
│   │   └── sessionApi.js       # Session creation & management APIs
│   │
│   ├── components/         # Reusable UI & Logic Components
│   │   ├── common/             # Cards, Navbar, Modals, Pagination
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── PendingQuestionCard.jsx
│   │   │   └── SessionFormModal.jsx
│   │   └── ui/                 # Base Atomic UI (Button, Card, Input, Modal, Spinner)
│   │
│   ├── context/            # React Global State Providers
│   │   ├── AuthContext.jsx     # Authentication state & Token lifecycle
│   │   └── SocketContext.jsx   # WebSocket connection & event emitter provider
│   │
│   ├── pages/              # Application Route Views
│   │   ├── LandingPage.jsx         # หน้าแรกเลือก Role (Host / Guest / Viewer)
│   │   ├── HostAuth.jsx            # หน้าล็อกอิน / ลงทะเบียน Host
│   │   ├── HostDashboard.jsx       # หน้ารวมและจัดการ Session ของ Host
│   │   ├── HostSessionManager.jsx  # ห้องควบคุม Moderation และคำถามสด
│   │   ├── GuestJoin.jsx           # หน้าสแกน QR / กรอกรหัสเข้าร่วม
│   │   ├── GuestSession.jsx        # หน้าส่งคำถามและกด Upvote ของผู้ฟัง
│   │   └── ViewerDisplay.jsx       # หน้าจอสำหรับฉายขึ้นจอโปรเจกเตอร์เวที
│   │
│   ├── utils/              # Helper utilities (CSV export, formatting)
│   │   └── exportUtils.js
│   ├── App.jsx             # Route definitions & Top-level layouts
│   ├── main.jsx            # React root mount
│   └── index.css           # Global Tailwind CSS imports
│
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 เริ่มต้นใช้งานและรันโปรเจกต์ (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
* [Node.js](https://nodejs.org/) (เวอร์ชัน 18.x หรือใหม่กว่า)
* npm หรือ yarn หรือ pnpm

### 2. การติดตั้ง (Installation)
Clone โปรเจกต์และติดตั้ง Dependencies:

```bash
# Clone repository
git clone https://github.com/woradech-dev/ThamsodProject_Frontend.git

# เข้าสู่โฟลเดอร์โปรเจกต์
cd ThamsodProject_Frontend

# ติดตั้งแพ็กเกจ
npm install
```

### 3. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ เพื่อชี้ไปยัง Backend Server:

```env
# URL ของ Backend API และ WebSocket Server
VITE_API_BASE_URL=http://localhost:5000
```

### 4. รันโปรเจกต์ในโหมดพัฒนา (Development Mode)
```bash
npm run dev
```
เปิดเบราว์เซอร์แล้วไปที่ `http://localhost:5173`

### 5. บิลด์สำหรับ Production (Production Build)
```bash
npm run build
```
ไฟล์ผลลัพธ์จะถูกคอมไพล์ลงในโฟลเดอร์ `dist/` พร้อมนำไป Deploy บน Cloudflare Pages, Vercel, หรือ Netlify

---

## 👨‍💻 ทีมผู้พัฒนา (Development Team)

โปรเจกต์นี้ได้รับการพัฒนาร่วมกันโดยทีมนักศึกษาสาขาวิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์ คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยศรีปทุม (SPU):

| ลำดับ | รายชื่อผู้จัดทำ | รหัสนักศึกษา | บทบาทหน้าที่ในโปรเจกต์ | ลิงก์ผลงานและช่องทางติดต่อ |
| :---: | :--- | :---: | :--- | :--- |
| 👑 | **วรเดช อาจวิชัย** | **66080240** | **Lead Developer & System Architect (ผู้พัฒนาหลัก)**<br>• ออกแบบสถาปัตยกรรมระบบภาพรวม (System Architecture) และ WebSocket Pipeline<br>• พัฒนาระบบ **Frontend ฝั่ง Host** ทั้งหมด (Dashboard, Authentication, Session Control)<br>• พัฒนา Backend: Authentication Service (`/api/auth/*`) และ Join Session (`/api/sessions/join`) | 🌐 [Portfolio](https://woradech-dev.github.io/PortfolioWebsite/)<br>🐙 [GitHub](https://github.com/woradech-dev)<br>💼 [LinkedIn](https://www.linkedin.com/in/woradech-dev/) |
| 💻 | **วรธนเวธน์ ณีศะนันทร์** | **66099910** | **Developer (Frontend Viewer & Session Services)**<br>• พัฒนาระบบ **Frontend ฝั่ง Viewer** ทั้งหมด (หน้าจอแสดงผลบนเวที / โปรเจกเตอร์ขนาดใหญ่)<br>• พัฒนา Backend: Session Services ทั้งหมด (`/api/sessions/*` จัดการห้องสัมมนาแบบครบวงจร) | 🌐 [Portfolio](https://woratanawetn.github.io/my-portfolio/)<br>🐙 [GitHub](https://github.com/WoratanawetN)<br>💼 [LinkedIn](https://linkedin.com/in/woratanawet-neesanan-4b43a9433/) |
| 💻 | **ณัฐดนัย รอดมุ้ย** | **66092117** | **Developer (Frontend Guest & Question Services)**<br>• พัฒนาระบบ **Frontend ฝั่ง Guest** ทั้งหมด (หน้าเข้าร่วมห้องของผู้ฟัง, การส่งคำถาม, และการ Upvote โหวตคำถาม)<br>• พัฒนา Backend: Question Services ทั้งหมด (`/api/questions/*` ส่งคำถาม, ดึงรายการคำถาม, โหวต, และเปลี่ยนสถานะคำถาม) | 🌐 [Portfolio](https://nutdanaispu66.github.io/nutdanai-portfolio/)<br>🐙 [GitHub](https://github.com/nutdanai66092117)<br>💼 [LinkedIn](https://www.linkedin.com/in/nutdanai-rodmui/) |

---

## 📄 ลิขสิทธิ์ (License & Acknowledgement)

โปรเจกต์นี้ได้รับการพัฒนาเพื่อการศึกษาในรายวิชา CSI400 และต่อยอดสู่การใช้งานเชิงพาณิชย์โดยบริษัท อโณณา เฮ้าส์ จำกัด (ANONA House Co., Ltd.) ในชื่อผลิตภัณฑ์ **AskEvent**  
สงวนลิขสิทธิ์ © 2024 - 2026 Woradech Ardvichai and Team. All Rights Reserved.
