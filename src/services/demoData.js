// Демонстраційні завдання для негайного тестування (якщо Firestore ще не налаштовано)
export const DEMO_TASKS = [
  {
    id: "demo-quiz-1",
    title: "Основи HTTP та REST API",
    description: "Перевірка розуміння методів HTTP, кодів відповідей сервера та принципів REST-архітектури.",
    type: "quiz",
    createdAt: new Date().toISOString(),
    difficulty: "Середній",
    data: {
      questions: [
        {
          id: 1,
          question: "Який HTTP-метод відповідно до специфікації REST вважається ідемпотентним і призначений для повного оновлення ресурсу?",
          options: [
            "POST",
            "PUT",
            "PATCH",
            "CONNECT"
          ],
          correctAnswerIndex: 1,
          explanation: "Метод PUT є ідемпотентним — повторний виклик одного й того ж PUT-запиту з тими ж даними приведе до одного й того ж результату, замінюючи ресурс цілком."
        },
        {
          id: 2,
          question: "Який код статусу HTTP повертає сервер, коли клієнт намагається отримати доступ до ресурсу без дійсної аутентифікації?",
          options: [
            "400 Bad Request",
            "401 Unauthorized",
            "403 Forbidden",
            "404 Not Found"
          ],
          correctAnswerIndex: 1,
          explanation: "401 Unauthorized вказує на те, що запит не був застосований, оскільки в ньому відсутні валідні облікові дані аутентифікації."
        },
        {
          id: 3,
          question: "Що з переліченого НЕ є обов'язковим архітектурним обмеженням стилю REST?",
          options: [
            "Клієнт-серверна модель",
            "Відсутність збереження стану (Stateless)",
            "Використання протоколу WebSockets",
            "Кешування (Cacheable)"
          ],
          correctAnswerIndex: 2,
          explanation: "REST базується на принципі запит-відповідь поверх протоколів без стану (як-от HTTP) і не вимагає двосторонніх постійних з'єднань на зразок WebSockets."
        },
        {
          id: 4,
          question: "Який заголовковий рядок (Header) клієнт надсилає на сервер, щоб повідомити, який тип контенту він очікує отримати у відповіді?",
          options: [
            "Content-Type",
            "Accept",
            "User-Agent",
            "Authorization"
          ],
          correctAnswerIndex: 1,
          explanation: "Заголовок 'Accept' використовується клієнтом для вказівки типів MIME, які є прийнятними для відповіді (наприклад, application/json)."
        }
      ]
    }
  },
  {
    id: "demo-dnd-1",
    title: "Розподіл технологій: Frontend vs Backend vs Database",
    description: "Розподіліть перелічені технології, інструменти та поняття за відповідними компонентами стеку розробки.",
    type: "drag-and-drop",
    createdAt: new Date().toISOString(),
    difficulty: "Базовий",
    data: {
      instruction: "Перетягніть картки з термінами у відповідні колонки або клікніть на картку для вибору групи.",
      groups: [
        {
          id: "frontend",
          title: "Frontend (Клієнтська частина)",
          description: "Технології браузера та інтерфейсу"
        },
        {
          id: "backend",
          title: "Backend (Серверна частина)",
          description: "Бізнес-логіка, API та середовища виконання"
        },
        {
          id: "database",
          title: "Бази даних (Сховища)",
          description: "Системи керування реляційними та NoSQL даними"
        }
      ],
      items: [
        { id: "item-1", text: "React & Virtual DOM", groupId: "frontend" },
        { id: "item-2", text: "Node.js & Express", groupId: "backend" },
        { id: "item-3", text: "PostgreSQL", groupId: "database" },
        { id: "item-4", text: "CSS Flexbox / Grid", groupId: "frontend" },
        { id: "item-5", text: "Spring Boot (Java)", groupId: "backend" },
        { id: "item-6", text: "MongoDB & Mongoose", groupId: "database" },
        { id: "item-7", text: "Redux Toolkit", groupId: "frontend" },
        { id: "item-8", text: "JWT аутентифікація на сервері", groupId: "backend" },
        { id: "item-9", text: "Redis кешування даних", groupId: "database" }
      ]
    }
  }
];

