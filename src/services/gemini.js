import { GoogleGenerativeAI } from "@google/generative-ai";

const STORAGE_KEY = "gemini_api_key";

// Актуальні моделі Gemini (основна gemini-3.8-flash з автоматичним fallback на gemini-2.5-flash)
export const PRIMARY_GEMINI_MODEL = "gemini-3.8-flash";
export const FALLBACK_GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Отримання збереженого API ключа Gemini
 */
export function getGeminiApiKey() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

/**
 * Збереження API ключа Gemini
 */
export function setGeminiApiKey(key) {
  const trimmed = key ? key.trim() : "";
  if (trimmed) {
    localStorage.setItem(STORAGE_KEY, trimmed);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Очищення ключа
 */
export function removeGeminiApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Очищення тексту від можливого Markdown огортання JSON (```json ... ```)
 */
function cleanJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Перевірка дійсності API ключа швидким запитом
 */
export async function testGeminiApiKey(apiKey) {
  try {
    const key = apiKey || getGeminiApiKey();
    if (!key) {
      throw new Error("API ключ не надано.");
    }
    const genAI = new GoogleGenerativeAI(key);
    
    let modelName = PRIMARY_GEMINI_MODEL;
    let result;
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent("Відповідай одним словом: OK");
    } catch (modelError) {
      // Якщо основна модель не знайдена (404), пробуємо fallback модель
      if (modelError.message && (modelError.message.includes("404") || modelError.message.includes("not found"))) {
        modelName = FALLBACK_GEMINI_MODEL;
        const fallbackModel = genAI.getGenerativeModel({ model: modelName });
        result = await fallbackModel.generateContent("Відповідай одним словом: OK");
      } else {
        throw modelError;
      }
    }

    const response = await result.response;
    return { success: true, message: `${response.text().trim()} (модель: ${modelName})` };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Помилка авторизації в Gemini API.",
    };
  }
}

/**
 * Генерація завдання на основі лекційного матеріалу
 * @param {Object} params
 * @param {string} params.material - Текст лекції або матеріалів
 * @param {'quiz'|'drag-and-drop'} params.activityType - Тип активності
 * @param {string} [params.customTitle] - Опціональна назва
 * @param {number} [params.itemsCount] - Кількість запитань/термінів
 * @param {string} [params.difficulty] - Рівень складності
 */
export async function generateEducationalTask({
  material,
  activityType,
  customTitle = "",
  itemsCount = 5,
  difficulty = "Середній",
}) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API ключ не знайдено. Будь ласка, вкажіть його у вкладці 'Налаштування' адмін-панелі."
    );
  }

  if (!material || material.trim().length < 20) {
    throw new Error("Будь ласка, вставте більш детальний текст матеріалу або лекції (мінімум 20 символів).");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Фабрика моделі з конфігурацією суворого JSON
  const createModelInstance = (modelName) =>
    genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3, // низька температура для структурованості та точності
      },
    });

  let activeModel = createModelInstance(PRIMARY_GEMINI_MODEL);

  let systemPrompt = "";
  let userPrompt = "";

  if (activityType === "quiz") {
    systemPrompt = `
Ти — провідний методист та Senior IT-викладач.
Твоє завдання: на основі наданих навчальних матеріалів створити професійний, якісний та актуальний тест (квіз) з варіантами відповідей для студентів технічних спеціальностей.

ПРАВИЛА ТА ВИМОГИ:
1. Мова контенту: ВИКЛЮЧНО УКРАЇНСЬКА.
2. Створи рівно ${itemsCount} якісних запитань.
3. Питання мають бути практичними, без неоднозначностей. Варіанти відповідей повинні бути правдоподібними (дистрактори).
4. Обов'язково надай стисле, але змістовне пояснення (explanation) для правильної відповіді.
5. Формат відповіді: СУВОРИЙ JSON за наступною схемою:
{
  "title": "Лаконічна назва теми тесту",
  "description": "Короткий опис того, що перевіряє цей тест (1-2 речення)",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Текст практичного або теоретичного запитання?",
      "options": [
        "Варіант 1",
        "Варіант 2",
        "Варіант 3",
        "Варіант 4"
      ],
      "correctAnswerIndex": 0, // число від 0 до 3, індекс правильного варіанту
      "explanation": "Чому саме цей варіант є правильним та чому інші ні."
    }
  ]
}
`.trim();

    userPrompt = `
НАВЧАЛЬНИЙ МАТЕРІАЛ ЛЕКЦІЇ:
\"\"\"
${material}
\"\"\"

${customTitle ? `Бажана тема або заголовок: "${customTitle}".` : ""}
Кількість запитань: ${itemsCount}.
Складність: ${difficulty}.

Згенеруй JSON об'єкт відповідно до зазначеної схеми.
`.trim();

  } else if (activityType === "drag-and-drop") {
    systemPrompt = `
Ти — провідний методист та Senior IT-викладач.
Твоє завдання: на основі наданих навчальних матеріалів створити інтерактивну вправу типу Drag-and-Drop (сортування карток з термінами / поняттями / кодом по відповідних категоріях або групах).

ПРАВИЛА ТА ВИМОГИ:
1. Мова контенту: ВИКЛЮЧНО УКРАЇНСЬКА.
2. Створи від 2 до 4 чітких, взаємовиключних категорій (груп), наприклад: "Frontend vs Backend", "Реляційні vs NoSQL", "Стек vs Купа", "TCP vs UDP" тощо.
3. Згенеруй загалом ${itemsCount * 2} термінів або тверджень (items), які рівномірно розподіляються між цими групами.
4. Кожен елемент повинен чітко належати лише одній групі.
5. Формат відповіді: СУВОРИЙ JSON за наступною схемою:
{
  "title": "Назва завдання на сортування",
  "description": "Опис завдання та контекст",
  "difficulty": "${difficulty}",
  "instruction": "Перетягніть кожен термін до відповідної категорії або клікніть для вибору.",
  "groups": [
    {
      "id": "group_1",
      "title": "Назва 1-ї категорії",
      "description": "Коротке пояснення категорії"
    },
    {
      "id": "group_2",
      "title": "Назва 2-ї категорії",
      "description": "Коротке пояснення категорії"
    }
  ],
  "items": [
    {
      "id": "item_1",
      "text": "Термін, технологія, код або твердження",
      "groupId": "group_1" // ID групи, до якої належить елемент
    },
    {
      "id": "item_2",
      "text": "Інший термін",
      "groupId": "group_2"
    }
  ]
}
`.trim();

    userPrompt = `
НАВЧАЛЬНИЙ МАТЕРІАЛ ЛЕКЦІЇ:
\"\"\"
${material}
\"\"\"

${customTitle ? `Бажана назва або тема: "${customTitle}".` : ""}
Орієнтовна кількість карток для сортування: ${Math.max(6, itemsCount * 2)}.
Складність: ${difficulty}.

Згенеруй JSON об'єкт відповідно до зазначеної схеми.
`.trim();
  }

  try {
    const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
    let result;

    try {
      result = await activeModel.generateContent(fullPrompt);
    } catch (primaryError) {
      // Якщо gemini-3.8-flash повернула 404/not found, автоматично перемикаємось на gemini-2.5-flash
      if (
        primaryError.message &&
        (primaryError.message.includes("404") || primaryError.message.includes("not found"))
      ) {
        console.warn(
          `Модель ${PRIMARY_GEMINI_MODEL} повернула 404, виконуємо запит через ${FALLBACK_GEMINI_MODEL}...`
        );
        const fallbackModel = createModelInstance(FALLBACK_GEMINI_MODEL);
        result = await fallbackModel.generateContent(fullPrompt);
      } else {
        throw primaryError;
      }
    }

    const response = await result.response;
    const rawText = response.text();
    const cleanedText = cleanJsonResponse(rawText);
    
    const parsedData = JSON.parse(cleanedText);

    // Валідація структури
    if (activityType === "quiz") {
      if (!Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
        throw new Error("ШІ згенерував відповідь без масиву запитань.");
      }
    } else if (activityType === "drag-and-drop") {
      if (!Array.isArray(parsedData.groups) || !Array.isArray(parsedData.items)) {
        throw new Error("ШІ згенерував некоректну структуру груп чи елементів для Drag-and-Drop.");
      }
    }

    return {
      type: activityType,
      title: customTitle || parsedData.title || "Навчальне завдання з ІТ",
      description: parsedData.description || "Інтерактивне завдання для закріплення матеріалу",
      difficulty: parsedData.difficulty || difficulty,
      data: parsedData,
    };
  } catch (err) {
    console.error("Помилка генерації через Gemini:", err);
    if (err instanceof SyntaxError) {
      throw new Error("ШІ повернув некоректний JSON. Спробуйте згенерувати ще раз.");
    }
    throw err;
  }
}

