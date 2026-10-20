import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GripVertical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function DragAndDropViewer({ task }) {
  const { data, title, description, difficulty } = task;
  const groups = data?.groups || [];
  const items = data?.items || [];

  // assignments: { [itemId]: groupId | null }
  const [assignments, setAssignments] = useState({});
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [selectedMobileItem, setSelectedMobileItem] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  // Список нерозподілених елементів
  const unassignedItems = items.filter((item) => !assignments[item.id]);

  // Елементи у кожній групі
  const getGroupItems = (groupId) => {
    return items.filter((item) => assignments[item.id] === groupId);
  };

  // Переміщення елемента в групу або назад у пул
  const moveItem = (itemId, targetGroupId) => {
    if (isChecked) return;
    setAssignments((prev) => ({
      ...prev,
      [itemId]: targetGroupId,
    }));
    setSelectedMobileItem(null);
  };

  // Drag and Drop обробники
  const handleDragStart = (e, itemId) => {
    if (isChecked) return;
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropToGroup = (e, groupId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      moveItem(itemId, groupId);
    }
    setDraggedItemId(null);
  };

  const handleDropToPool = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      moveItem(itemId, null);
    }
    setDraggedItemId(null);
  };

  // Перевірка результатів
  const handleCheckAnswers = () => {
    setIsChecked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAssignments({});
    setIsChecked(false);
    setSelectedMobileItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Підрахунок правильно розподілених
  const correctCount = items.reduce((acc, item) => {
    return assignments[item.id] === item.groupId ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / items.length) * 100);

  const allAssigned = unassignedItems.length === 0;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            Drag-and-Drop • {items.length} карток • {groups.length} категорій
          </span>
          {difficulty && (
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Рівень: {difficulty}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}

        <p className="text-xs text-indigo-800 bg-indigo-50/70 p-3 rounded-lg border border-indigo-100 mt-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            {data?.instruction ||
              'Перетягуйте картки мишкою у відповідні блоки або клікніть по картці, щоб вибрати категорію.'}
          </span>
        </p>
      </div>

      {/* Якщо перевірено: підсумковий результат */}
      {isChecked && (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 border border-indigo-100 rounded-xl p-6 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {scorePercent === 100
              ? 'Чудово! Усі терміни розподілено вірно!'
              : scorePercent >= 60
              ? 'Гарна спроба! Перегляньте виправлення нижче.'
              : 'Є помилки. Спробуйте розібратися та повторити.'}
          </h2>

          <div className="my-4 inline-flex items-baseline gap-2 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-3xl font-extrabold text-indigo-600">{correctCount}</span>
            <span className="text-slate-400 text-lg">/ {items.length}</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {scorePercent}%
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Спробувати ще раз
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Усі завдання
            </Link>
          </div>
        </div>
      )}

      {/* Пул нерозподілених карток */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDropToPool}
        className={`bg-slate-50/80 rounded-xl border-2 border-dashed p-5 transition-colors ${
          unassignedItems.length > 0
            ? 'border-indigo-200 bg-indigo-50/20'
            : 'border-slate-200 text-center'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Картки для сортування ({unassignedItems.length} залишилось)
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Клікніть або перетягніть у потрібну групу
          </span>
        </div>

        {unassignedItems.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            Усі картки розподілено по колонках! Натисніть кнопку перевірки нижче.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {unassignedItems.map((item) => (
              <div
                key={item.id}
                draggable={!isChecked}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={() => !isChecked && setSelectedMobileItem(selectedMobileItem === item.id ? null : item.id)}
                className={`relative px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow transition-all flex items-center gap-2 select-none ${
                  selectedMobileItem === item.id
                    ? 'border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50/40'
                    : 'border-slate-200'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Швидкий вибір групи при кліку на картку (для смартфонів та зручності) */}
        {selectedMobileItem && !isChecked && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Перемістити вибрану картку в:
            </p>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => moveItem(selectedMobileItem, group.id)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                >
                  {group.title}
                </button>
              ))}
              <button
                onClick={() => setSelectedMobileItem(null)}
                className="px-3 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-100 border border-slate-200"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Колонки/Категорії */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(groups.length, 3)} gap-4`}>
        {groups.map((group) => {
          const groupItems = getGroupItems(group.id);
          return (
            <div
              key={group.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropToGroup(e, group.id)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[300px] overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Шапка колонки */}
              <div className="p-4 bg-slate-50/80 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{group.title}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {groupItems.length}
                  </span>
                </div>
                {group.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{group.description}</p>
                )}
              </div>

              {/* Зона скидання карток */}
              <div className="p-3 flex-1 flex flex-col gap-2 bg-slate-50/30">
                {groupItems.length === 0 ? (
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center p-4 text-center">
                    <p className="text-xs text-slate-400">
                      Перетягніть картки сюди
                    </p>
                  </div>
                ) : (
                  groupItems.map((item) => {
                    const isCorrect = item.groupId === group.id;

                    let cardStyle = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
                    if (isChecked) {
                      if (isCorrect) {
                        cardStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium ring-1 ring-emerald-400';
                      } else {
                        cardStyle = 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-400';
                      }
                    }

                    return (
                      <div
                        key={item.id}
                        draggable={!isChecked}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className={`p-3 rounded-lg border text-sm shadow-xs flex items-center justify-between gap-2 select-none transition-all ${cardStyle} ${
                          !isChecked ? 'cursor-grab active:cursor-grabbing' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {!isChecked && <GripVertical className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                          <span>{item.text}</span>
                        </div>

                        {/* Індикатори перевірки або кнопка повернення */}
                        {isChecked ? (
                          <div>
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <div className="flex items-center gap-1 text-rose-600">
                                <XCircle className="w-4 h-4 flex-shrink-0" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => moveItem(item.id, null)}
                            className="text-xs text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100"
                            title="Повернути в пул"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка перевірки */}
      {!isChecked && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">
            {allAssigned ? (
              <span className="text-emerald-700 font-medium">Усі елементи розподілено! Можна перевіряти.</span>
            ) : (
              <span>Залишилось розподілити {unassignedItems.length} карток.</span>
            )}
          </div>
          <button
            onClick={handleCheckAnswers}
            disabled={items.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Перевірити відповіді
          </button>
        </div>
      )}
    </div>
  );
}

