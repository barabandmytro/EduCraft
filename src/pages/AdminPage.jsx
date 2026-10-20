import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Settings,
  ListChecks,
  LogOut,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import AdminPinModal from '../components/admin/AdminPinModal';
import TaskGenerator from '../components/admin/TaskGenerator';
import SettingsTab from '../components/admin/SettingsTab';
import TaskListTab from '../components/admin/TaskListTab';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'tasks' | 'settings'

  useEffect(() => {
    const isAuth = sessionStorage.getItem('educraft_admin_auth') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('educraft_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminPinModal onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Шапка адмінки */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Панель викладача</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Авторизовано
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Створення навчальних активностей за допомогою ШІ та публікація у Firestore
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Вийти з кабінету</span>
        </button>
      </div>

      {/* Вкладки панелі */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'generator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Генератор завдань</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Опубліковані завдання</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Налаштування (Gemini / Firebase)</span>
        </button>
      </div>

      {/* Відображення активної вкладки */}
      <div>
        {activeTab === 'generator' && (
          <TaskGenerator onTaskPublished={() => {}} />
        )}

        {activeTab === 'tasks' && <TaskListTab />}

        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

