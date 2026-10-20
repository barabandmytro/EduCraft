import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          {/* Блок копірайту та автора */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-800 tracking-tight">EduCraft AI © 2026</span>
            <span className="text-slate-300">|</span>
            <span>
              Автор розробки:{' '}
              <span className="font-medium text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                Дмитро Барабан
              </span>
            </span>
            <span className="text-slate-300 hidden sm:inline">—</span>
            <span className="text-slate-600 block sm:inline w-full sm:w-auto">
              Навчальний тренажер з IT-дисциплін
            </span>
          </div>

          {/* Технологічний стек та статус */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>React • Vite • Tailwind • Firestore • Gemini AI</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
