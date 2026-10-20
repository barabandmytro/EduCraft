import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  UploadCloud,
  Eye,
  Code,
  AlertCircle,
  CheckCircle,
  Copy,
  BookOpen,
  FileText,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { generateEducationalTask, getGeminiApiKey } from '../../services/gemini';
import { saveTask } from '../../services/firebase';
import QuizViewer from '../task/QuizViewer';
import DragAndDropViewer from '../task/DragAndDropViewer';

// Готові зразки IT-матеріалів для швидкого тестування викладачем
const SAMPLE_MATERIALS = [
  {
    title: 'REST API та HTTP протокол',
    type: 'quiz',
    text: `Архітектурний стиль REST (Representational State Transfer) розроблений Роєм Філдінгом у 2000 році.
Основні принципи REST:
1. Клієнт-серверна архітектура: розділення обов'язків інтерфейсу та зберігання даних.
2. Відсутність збереження стану (Stateless): кожен запит від клієнта повинен містити всю інформацію, необхідну для його обробки сервером. Сервер не зберігає стан сесії між запитами.
3. Кешування: відповіді мають явно позначатися як такі, що можуть або не можуть бути кешовані.
4. Однорідний інтерфейс (Uniform Interface): ресурси ідентифікуються за допомогою URI.

HTTP методи в REST:
- GET: отримання представлення ресурсу (безпечний, ідемпотентний).
- POST: створення нового підпорядкованого ресурсу (небезпечний, неідемпотентний).
- PUT: повне оновлення або створення ресурсу за фіксованим URI (ідемпотентний).
- PATCH: часткове оновлення існуючого ресурсу (не обов'язково ідемпотентний).
- DELETE: видалення ресурсу (ідемпотентний).

Коди відповідей:
- 200 OK: успішний запит з тілом відповіді.
- 201 Created: ресурс успішно створено (часто у відповідь на POST).
- 204 No Content: дія успішна, але тіло відповіді порожнє (часто DELETE).
- 400 Bad Request: помилка валідації на стороні клієнта.
- 401 Unauthorized: відсутня автентифікація.
- 403 Forbidden: автентифікація успішна, але немає прав доступу.
- 404 Not Found: запитаний ресурс не існує на сервері.
- 500 Internal Server Error: неочікувана помилка на сервері.`
  },
  {
    title: 'Реляційні (SQL) vs Документні (NoSQL) бази даних',
    type: 'drag-and-drop',
    text: `Порівняльний аналіз систем керування базами даних (СУБД).
Реляційні бази даних (SQL):
- Представники: PostgreSQL, MySQL, Oracle, SQLite, Microsoft SQL Server.
- Модель даних: таблиці з рядками (кортежами) та стовпцями з фіксованою схемою (Schema-first).
- Гарантії транзакцій: сувора відповідність вимогам ACID (Atomicity, Consistency, Isolation, Durability).
- Масштабування: переважно вертикальне (Vertical Scaling) шляхом нарощування потужності одного сервера (CPU, RAM).
- Мова запитів: стандартизована мова SQL зі складними операціями об'єднання таблиць (JOIN).

Документоорієнтовані NoSQL бази даних:
- Представники: MongoDB, CouchDB, Amazon DocumentDB.
- Модель даних: гнучкі документи у форматах JSON / BSON без обов'язкової фіксованої схеми (Schema-less).
- Масштабування: горизонтальне масштабування з коробки (Sharding, шардування між кластерами серверів).
- Модель узгодженості: концепція BASE (Basically Available, Soft state, Eventual consistency).
- Відсутність класичних JOIN — денормалізація даних та вкладені документи (Embedded Documents).`
  }
];

export default function TaskGenerator({ onTaskPublished }) {
  const [material, setMaterial] = useState('');
  const [activityType, setActivityType] = useState('quiz');
  const [customTitle, setCustomTitle] = useState('');
  const [itemsCount, setItemsCount] = useState(4);
  const [difficulty, setDifficulty] = useState('Середній');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedTask, setGeneratedTask] = useState(null);
  const [previewTab, setPreviewTab] = useState('interactive'); // 'interactive' | 'json'
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedTaskResult, setPublishedTaskResult] = useState(null);

  const hasApiKey = Boolean(getGeminiApiKey());

  // Вставка готового прикладу
  const loadSample = (sample) => {
    setMaterial(sample.text);
    setActivityType(sample.type);
    setCustomTitle(sample.title);
    setGeneratedTask(null);
    setPublishedTaskResult(null);
    setErrorMessage('');
  };

  // Виклик генерації Gemini API
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!hasApiKey) {
      setErrorMessage(
        'Спочатку додайте ваш Gemini API Ключ у вкладці "Налаштування"!'
      );
      return;
    }

    if (!material.trim()) {
      setErrorMessage('Будь ласка, вставте текст лекції або матеріалу.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setPublishedTaskResult(null);

    try {
      const task = await generateEducationalTask({
        material,
        activityType,
        customTitle,
        itemsCount: Number(itemsCount),
        difficulty,
      });

      setGeneratedTask(task);
      setPreviewTab('interactive');
    } catch (err) {
      console.error('Помилка генератора:', err);
      setErrorMessage(err.message || 'Не вдалося згенерувати завдання через Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  // Публікація завдання у Firestore
  const handlePublish = async () => {
    if (!generatedTask) return;

    setIsPublishing(true);
    setErrorMessage('');

    try {
      const result = await saveTask(generatedTask);
      setPublishedTaskResult(result);
      if (onTaskPublished) onTaskPublished(result);
    } catch (err) {
      console.error('Помилка публікації:', err);
      setErrorMessage('Не вдалося опублікувати завдання: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Форма генератора */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              AI Генератор завдань
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Вставте текст лекції — Google Gemini автоматично сформує перевірене інтерактивне завдання
            </p>
          </div>

          {/* Швидкі зразки */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Швидкі приклади:</span>
            {SAMPLE_MATERIALS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(sample)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border border-slate-200"
              >
                {sample.type === 'quiz' ? 'Квіз: ' : 'DnD: '}
                {sample.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {!hasApiKey && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Gemini API ключ ще не встановлено. Перейдіть до Налаштувань, щоб зберегти ключ.
              </span>
            </div>
            <Link
              to="/admin/settings"
              className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              До налаштувань
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Виникла помилка:</p>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Вибір типу активності та параметри */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Тип активності
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="quiz">Квіз (тест з варіантами відповідей)</option>
                <option value="drag-and-drop">Drag-and-Drop (сортування по групах)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Кількість запитань / категорій
              </label>
              <select
                value={itemsCount}
                onChange={(e) => setItemsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={3}>3 {activityType === 'quiz' ? 'питання' : 'категорії'}</option>
                <option value={4}>4 {activityType === 'quiz' ? 'питання' : 'категорії'}</option>
                <option value={5}>5 {activityType === 'quiz' ? 'питань' : 'категорій'}</option>
                <option value={6}>6 {activityType === 'quiz' ? 'питань' : 'категорій'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Рівень складності
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Базовий">Базовий (Junior / Вступний)</option>
                <option value="Середній">Середній (Middle / Стандартний)</option>
                <option value="Поглиблений">Поглиблений (Senior / Високий)</option>
              </select>
            </div>
          </div>

          {/* Бажана назва (опціонально) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Назва теми або завдання <span className="text-slate-400 font-normal lowercase">(опціонально)</span>
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Наприклад: Архітектура комп’ютерних мереж та модель OSI"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Текстове поле для лекційного матеріалу */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Текст лекції або навчальні матеріали
              </label>
              <span className="text-xs text-slate-400">
                {material.length} символів
              </span>
            </div>
            <textarea
              rows={8}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Вставте сюди конспект лекції, документацію, опис технологій або фрагменти коду..."
              className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 leading-relaxed font-sans placeholder:text-slate-400"
            />
          </div>

          {/* Кнопка генерації */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !material.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>ШІ аналізує матеріал та формує JSON...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Згенерувати за допомогою AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Блок попереднього перегляду (Preview) */}
      {generatedTask && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Успішно згенеровано
                </span>
                <span className="text-xs text-slate-400">
                  Тип: {generatedTask.type === 'quiz' ? 'Квіз' : 'Drag-and-Drop'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Попередній перегляд: {generatedTask.title}
              </h3>
            </div>

            {/* Перемикач вкладок прев'ю */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewTab('interactive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  previewTab === 'interactive'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Інтерактивний тест
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  previewTab === 'json'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Структура JSON
              </button>
            </div>
          </div>

          {/* Вміст прев'ю */}
          <div>
            {previewTab === 'interactive' ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                {generatedTask.type === 'quiz' ? (
                  <QuizViewer task={generatedTask} />
                ) : (
                  <DragAndDropViewer task={generatedTask} />
                )}
              </div>
            ) : (
              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed">
                  {JSON.stringify(generatedTask, null, 2)}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(generatedTask, null, 2));
                    alert('JSON скопійовано в буфер обміну!');
                  }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Копіювати
                </button>
              </div>
            )}
          </div>

          {/* Повідомлення про публікацію */}
          {publishedTaskResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">Завдання успішно опубліковано у базі даних!</p>
                  <p className="text-emerald-700 mt-0.5">
                    ID завдання: <code className="font-mono">{publishedTaskResult.id}</code>. Студенти вже можуть проходити його.
                  </p>
                </div>
              </div>
              <Link
                to={`/task/${publishedTaskResult.id}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Відкрити завдання</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Кнопка Опублікувати */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Перевірили завдання? Натисніть "Опублікувати", щоб надати доступ студентам.
            </span>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || Boolean(publishedTaskResult)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isPublishing ? 'Публікуємо у Firestore...' : publishedTaskResult ? 'Опубліковано ✓' : 'Опублікувати завдання'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

