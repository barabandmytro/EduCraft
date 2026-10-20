import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ShieldCheck, Sparkles, Code2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EduCraft</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-indigo-100 text-indigo-700">AI</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Освітній тренажер IT-дисциплін</p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isAdmin
                  ? 'bg-slate-100 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Завдання</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isAdmin
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Панель викладача</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

