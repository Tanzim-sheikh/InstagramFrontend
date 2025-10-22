import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Header from "./components/Header.jsx";
import LandingHome from "./pages/LandingHome.jsx";
import About from "./pages/About.jsx";
import Speciality from "./pages/Speciality.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Chat from "./pages/Chat.jsx";
import ChatSection from "./pages/ChatSection.jsx";
import Friends from "./pages/Friends.jsx";
import Profile from "./pages/Profile.jsx";
import Requests from "./pages/Requests.jsx";
import FindFriends from "./pages/FindFriends.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <div className="p-4 max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<LandingHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/speciality" element={<Speciality />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:friendId" element={<ChatSection />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/find-friends" element={<FindFriends />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;