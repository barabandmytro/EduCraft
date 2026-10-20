import React, { useState, useEffect } from 'react';
import {
  Key,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  removeGeminiApiKey,
  testGeminiApiKey,
} from '../../services/gemini';
import { isFirebaseConfigured, firebaseConfig } from '../../services/firebase';

export default function SettingsTab() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const saved = getGeminiApiKey();
    setApiKey(saved);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setGeminiApiKey(apiKey);
    setStatusMessage({
      type: 'success',
      text: 'Gemini API ключ успішно збережено в браузері (localStorage)!',
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleRemove = () => {
    if (confirm('Ви впевнені, що хочете видалити збережений API ключ з цього браузера?')) {
      removeGeminiApiKey();
      setApiKey('');
      setStatusMessage({
        type: 'info',
        text: 'Ключ видалено з пам’яті браузера.',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Введіть API ключ перед тестуванням.',
      });
      return;
    }

    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await testGeminiApiKey(apiKey.trim());
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Зв’язок з Google Gemini встановлено успішно! Відповідь моделі: "${res.message}"`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `Помилка зв’язку: ${res.error}`,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Помилка перевірки: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const firebaseReady = isFirebaseConfigured();

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Секція Gemini API Key */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Google Gemini API Key</h2>
              <p className="text-xs text-slate-500">
                Використовується для автоматичної генерації квізів та інтерактивних завдань
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
          >
            <span>Отримати безкоштовний ключ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Повідомлення про безпеку */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 mb-6">
          <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>Безпека понад усе:</strong> Ваш API-ключ зберігається виключно у сховищі вашого браузера (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">localStorage</code>) і ніколи не передається на сторонні сервери чи у відкриту базу даних. Запити до Gemini надсилаються безпосередньо з вашого клієнта.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start gap-2.5 mb-6 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Gemini API Ключ (AIzaSy...)
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Вставте ваш ключ з Google AI Studio..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                title={showKey ? 'Приховати ключ' : 'Показати ключ'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Зберегти ключ
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50"
              >
                {isTesting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                )}
                <span>{isTesting ? 'Перевіряємо...' : 'Тест з’єднання'}</span>
              </button>
            </div>

            {getGeminiApiKey() && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Видалити ключ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Секція статусу Firebase Firestore */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                firebaseReady
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Статус бази даних Firebase Firestore</h2>
              <p className="text-xs text-slate-500">
                Сховище для публікації завдань викладача (колекція <code>tasks</code>)
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              firebaseReady
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {firebaseReady ? 'Хмара Firestore активна' : 'Локальний режим (Mock/Local)'}
          </span>
        </div>

        {firebaseReady ? (
          <div className="text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
            <p className="font-semibold text-emerald-800 mb-1">
              Підключення до хмарного проекту Firestore успішно сконфігуровано!
            </p>
            <p>
              Project ID: <code className="font-mono text-emerald-900">{firebaseConfig.projectId}</code>
            </p>
          </div>
        ) : (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed space-y-2">
            <p className="font-medium text-slate-800">
              Наразі у файлі <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">.env</code> використовуються плейсхолдери. Додаток автоматично працює в демонстраційному локальному режимі, зберігаючи створені завдання у сховище браузера.
            </p>
            <p>
              Щоб підключити вашу базу даних Firestore:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600">
              <li>Створіть проєкт у <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Firebase Console</a>.</li>
              <li>Створіть базу даних Firestore у тестовому режимі.</li>
              <li>Скопіюйте конфігурацію веб-додатка у файл <code className="font-mono bg-white px-1 py-0.5 rounded">.env</code>.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

