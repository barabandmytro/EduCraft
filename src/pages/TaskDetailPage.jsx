import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { getTaskById } from '../services/firebase';
import QuizViewer from '../components/task/QuizViewer';
import DragAndDropViewer from '../components/task/DragAndDropViewer';

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const item = await getTaskById(id);
        if (!item) {
          setError('Завдання з таким ID не знайдено в базі даних.');
        } else {
          setTask(item);
        }
      } catch (err) {
        console.error('Помилка завантаження завдання:', err);
        setError('Не вдалося завантажити завдання: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-600" />
        <p className="text-sm font-medium text-slate-600">Завантажуємо завдання...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Завдання не знайдено</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'Можливо, воно було видалене викладачем.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Повернутися до каталогу завдань
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Кнопка повернення */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад до списку завдань</span>
        </Link>
      </div>

      {/* Динамічний рендер залежно від типу завдання */}
      {task.type === 'quiz' ? (
        <QuizViewer task={task} />
      ) : task.type === 'drag-and-drop' ? (
        <DragAndDropViewer task={task} />
      ) : (
        <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
          Невідомий формат завдання: {task.type}
        </div>
      )}
    </div>
  );
}

