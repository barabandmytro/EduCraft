import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  CheckSquare,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { getAllTasks, deleteTask } from '../../services/firebase';

export default function TaskListTab() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error('Помилка завантаження завдань:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id, title) => {
    if (confirm(`Видалити завдання "${title}"?`)) {
      setDeleteId(id);
      try {
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        alert('Не вдалося видалити: ' + err.message);
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Усі опубліковані завдання</h2>
          <p className="text-xs text-slate-500 mt-1">
            Керуйте завданнями, доступними для проходження студентами
          </p>
        </div>

        <button
          onClick={fetchTasks}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          Оновити
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
          <p className="text-sm">Завантаження списку завдань...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <p className="text-base font-semibold text-slate-800">Поки що немає опублікованих завдань</p>
          <p className="text-xs text-slate-400 mt-1">
            Скористайтеся вкладкою "Генератор", щоб створити своє перше завдання за допомогою ШІ.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const isQuiz = task.type === 'quiz';
            const count = isQuiz
              ? task.data?.questions?.length || 0
              : task.data?.items?.length || 0;

            const dateStr = task.createdAt
              ? new Date(task.createdAt).toLocaleDateString('uk-UA', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Нещодавно';

            return (
              <div
                key={task.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isQuiz
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {isQuiz ? <CheckSquare className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                      {isQuiz ? 'Квіз' : 'Drag-and-Drop'}
                    </span>

                    {task.difficulty && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {task.difficulty}
                      </span>
                    )}

                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    Елементів: <span className="font-medium text-slate-600">{count}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to={`/task/${task.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    <span>Відкрити</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleDelete(task.id, task.title)}
                    disabled={deleteId === task.id}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Видалити завдання"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

