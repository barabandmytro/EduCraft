import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminPinModal({ onAuthenticated }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Пін-код береться з .env або за замовчуванням '1234'
  const expectedPin = import.meta.env.VITE_ADMIN_PIN || '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === expectedPin.trim()) {
      sessionStorage.setItem('educraft_admin_auth', 'true');
      onAuthenticated();
    } else {
      setError('Невірний PIN-код. Спробуйте ще раз.');
      setPin('');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-5 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Вхід для викладача
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Введіть PIN-код доступу до панелі генерації завдань
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Пін-код доступу
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Введіть PIN"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-center tracking-widest text-lg font-mono placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:text-slate-400"
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-md shadow-indigo-100"
          >
            <span>Підтвердити та увійти</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Пін-код за замовчуванням для тестування: <span className="font-mono font-semibold text-slate-600">1234</span>
            <br />
            (можна змінити через змінну <code className="text-slate-600">VITE_ADMIN_PIN</code> у файлі .env)
          </p>
        </div>
      </div>
    </div>
  );
}

