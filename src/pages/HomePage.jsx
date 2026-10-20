import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  CheckSquare,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { getAllTasks } from '../services/firebase';

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'quiz' | 'drag-and-drop'

  useEffect(() => {
    async function loadTasks() {
      setIsLoading(true);
      try {
        const data = await getAllTasks();
        setTasks(data);
      } catch (err) {
        console.error('Помилка завантаження завдань:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Фільтрація
  const filteredTasks = tasks.filter((task) => {
    const matchesType = filterType === 'all' || task.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      task.title?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero банер */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium text-indigo-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Інтерактивні навчальні матеріали для IT-студентів</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Практикуйте знання з ІТ-дисциплін
          </h1>
          <p className="mt-3 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Виконуйте інтерактивні квізи та завдання на класифікацію понять, згенеровані штучним інтелектом безпосередньо з лекцій викладача.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs text-indigo-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              Доступно завдань: <strong className="text-white font-semibold">{tasks.length}</strong>
            </span>
            <span className="text-xs text-indigo-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              Тести з детальними поясненнями
            </span>
          </div>
        </div>

        {/* Фонова декоративна сітка */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Пошук та фільтри */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Пошук */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук завдання за назвою або темою..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs placeholder:text-slate-400"
          />
        </div>

        {/* Фільтр за типом */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Усі ({tasks.length})
          </button>
          <button
            onClick={() => setFilterType('quiz')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'quiz'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Квізи
          </button>
          <button
            onClick={() => setFilterType('drag-and-drop')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'drag-and-drop'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Drag-and-Drop
          </button>
        </div>
      </div>

      {/* Список карток завдань */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-600" />
          <p className="text-sm font-medium text-slate-600">Завантажуємо навчальні завдання...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">Завдань не знайдено</h3>
          <p className="text-xs text-slate-500 mt-1">
            Спробуйте змінити пошуковий запит або перевірте фільтри.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const isQuiz = task.type === 'quiz';
            const count = isQuiz
              ? task.data?.questions?.length || 0
              : task.data?.items?.length || 0;

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Беджі типу та складності */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${
                        isQuiz
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {isQuiz ? <CheckSquare className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                      {isQuiz ? 'Квіз' : 'Drag-and-Drop'}
                    </span>

                    {task.difficulty && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {task.difficulty}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {task.description || 'Інтерактивне практичне завдання для перевірки знань.'}
                  </p>
                </div>

                {/* Нижня частина картки */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {isQuiz ? `${count} запитань` : `${count} карток для сортування`}
                    </span>

                    <Link
                      to={`/task/${task.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Почати</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

