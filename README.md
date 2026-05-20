# 💬 Nexa Chat - Real-time Messaging Application

A modern, full-stack real-time messaging platform built with MERN stack featuring Socket.IO for instant communication.

## 🌟 Features

- **Real-time Messaging** — Instant message delivery using Socket.IO
- **JWT Authentication** — Secure login and signup with email verification
- **User Management** — Online/offline status, typing indicators, profile photos
- **Responsive Design** — Works seamlessly on desktop and mobile
- **Error Handling** — Comprehensive error messages and validation

## 🛠️ Tech Stack

**Frontend:**
- React.js — UI library
- Tailwind CSS — Styling
- Socket.IO Client — Real-time communication
- Redux Toolkit — State management (if used)

**Backend:**
- Node.js — JavaScript runtime
- Express.js — Web framework
- MongoDB — NoSQL database
- Socket.IO Server — Real-time communication
- JWT — Authentication

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Clone Repository
```bash
git clone https://github.com/Tanzim-sheikh/Nexa-Chat.git
cd Nexa-Chat
```

### Backend Setup
```bash
cd backend
npm install
touch .env

# Add to .env:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000

npm start
```

### Frontend Setup
```bash
cd frontend
npm install
touch .env

# Add to .env:
# REACT_APP_API_URL=http://localhost:5000

npm start
```

## 🚀 Features Breakdown

### 1. Real-time Messaging
- Uses Socket.IO for WebSocket connections
- Messages delivered instantly without page refresh
- Typing indicators show when other user is typing

### 2. Authentication
- Email + Password login
- JWT token-based authentication
- Email verification on signup
- Password reset functionality

### 3. User Profiles
- Profile photo upload to Cloudinary
- Online/offline status
- Last seen timestamp
- User search functionality

## 📁 Project Structure
