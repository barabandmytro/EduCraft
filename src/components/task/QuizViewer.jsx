import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Info,
} from 'lucide-react';

export default function QuizViewer({ task }) {
  const { data, title, description, difficulty } = task;
  const questions = data?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600">У цьому квізі немає запитань.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Підрахунок результатів
  const correctCount = questions.reduce((count, q, idx) => {
    return selectedAnswers[idx] === q.correctAnswerIndex ? count + 1 : count;
  }, 0);
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const getScoreVerdict = () => {
    if (scorePercent === 100) return { title: 'Чудово! Бездоганний результат!', color: 'text-emerald-600' };
    if (scorePercent >= 75) return { title: 'Гарна робота! Матеріал засвоєно на високому рівні.', color: 'text-indigo-600' };
    if (scorePercent >= 50) return { title: 'Задовільно, але є прогалини в темі.', color: 'text-amber-600' };
    return { title: 'Потрібно повторити теоретичний матеріал лекції.', color: 'text-rose-600' };
  };

  return (
    <div className="space-y-6">
      {/* Заголовок та метадані */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            Квіз • {questions.length} запитань
          </span>
          {difficulty && (
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Рівень: {difficulty}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}

        {/* Прогрес-бар */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Прогрес: {answeredCount} з {questions.length} відповідей</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Якщо завершено: Екран результатів */}
      {isSubmitted ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 via-white to-slate-50 border border-indigo-100 rounded-xl p-8 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 ring-8 ring-indigo-50">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{getScoreVerdict().title}</h2>
            <p className="text-slate-600 mt-1 text-sm">Ваш підсумковий бал за тестування:</p>
            
            <div className="my-5 inline-flex items-baseline gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-4xl font-extrabold text-indigo-600">{correctCount}</span>
              <span className="text-slate-400 text-xl font-medium">/ {questions.length}</span>
              <span className="ml-3 text-sm font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {scorePercent}%
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Пройти ще раз
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Усі завдання
              </Link>
            </div>
          </div>

          {/* Розбір кожного питання */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Детальний розбір відповідей
            </h3>

            {questions.map((q, idx) => {
              const studentAnswer = selectedAnswers[idx];
              const isCorrect = studentAnswer === q.correctAnswerIndex;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
                    isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Питання {idx + 1}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Правильно (+1)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Помилка
                      </span>
                    )}
                  </div>

                  <p className="font-medium text-slate-900 text-base mb-4">{q.question}</p>

                  <div className="space-y-2 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === q.correctAnswerIndex;
                      const isOptionSelected = optIdx === studentAnswer;

                      let optClass = 'bg-slate-50 border-slate-200 text-slate-700';
                      if (isOptionCorrect) {
                        optClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium ring-1 ring-emerald-400';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        optClass = 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center justify-between p-3 rounded-lg border text-sm ${optClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-white border border-slate-300 text-slate-700">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          <div>
                            {isOptionCorrect && (
                              <span className="text-xs font-semibold text-emerald-700">Правильна відповідь</span>
                            )}
                            {isOptionSelected && !isOptionCorrect && (
                              <span className="text-xs font-semibold text-rose-700">Ваш вибір</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
                      <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="font-semibold block mb-0.5">Пояснення викладача:</strong>
                        <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Режим проходження тесту */
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Навігаційні крапки по питаннях */}
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-105'
                      : isAnswered
                      ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Питання {currentIndex + 1} з {questions.length}
            </span>
            <h2 className="text-xl font-semibold text-slate-900 mt-2 mb-6 leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Варіанти відповідей */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-sm ${isSelected ? 'font-semibold text-indigo-950' : 'text-slate-800'}`}>
                        {option}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Нижня панель керування */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Попереднє
            </button>

            <div className="flex items-center gap-3">
              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                >
                  Наступне
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Award className="w-4 h-4" />
                  Завершити та показати результати
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

