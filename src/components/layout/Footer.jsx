import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">EduCraft AI MVP</span>
          <span>•</span>
          <span>Освітній простір для викладачів та студентів IT</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Створено на базі React, Vite, Tailwind CSS, Firebase та Gemini AI</span>
        </div>
      </div>
    </footer>
  );
}

