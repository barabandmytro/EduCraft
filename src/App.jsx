import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import TaskDetailPage from './pages/TaskDetailPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <Routes>
            {/* Публічна частина для студентів */}
            <Route path="/" element={<HomePage />} />
            <Route path="/task/:id" element={<TaskDetailPage />} />

            {/* Адмін-панель для викладача */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/*" element={<AdminPage />} />

            {/* Редирект для невідомих маршрутів */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

