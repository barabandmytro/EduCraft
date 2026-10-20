# EduCraft AI — MVP освітнього веб-додатку для викладача ІТ-дисциплін

EduCraft AI — це сучасний освітній веб-додаток, створений для швидкої підготовки інтерактивних навчальних завдань з IT-дисциплін за допомогою штучного інтелекту Google Gemini та синхронізації з хмарною базою даних Firebase Firestore.

---

## 🛠 Технологічний стек
- **Frontend-фреймворк:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Маршрутизація:** [React Router v6](https://reactrouter.com/)
- **Стилізація:** [Tailwind CSS v3](https://tailwindcss.com/) (академічний, охайний мінімалізм)
- **База даних:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Штучний інтелект:** [Google Gemini API (@google/generative-ai)](https://ai.google.dev/)
- **Іконки:** [Lucide React](https://lucide.dev/)

---

## 🚀 Швидкий старт

### 1. Встановлення залежностей
```bash
npm install
```

### 2. Запуск локального сервера розробки
```bash
npm run dev
```
Після запуску відкрийте браузер за адресою: `http://localhost:5173`

### 3. Збірка для продакшну
```bash
npm run build
```

---

## ⚙️ Налаштування оточення (.env)

У корені проєкту створіть або відредагуйте файл `.env`:

```env
# PIN-код для входу викладача в адмін-панель (/admin)
VITE_ADMIN_PIN=1234

# Конфігурація Firebase Firestore (отримайте у консолі Firebase)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```

> **Примітка щодо автономності (Offline/Mock Mode):**  
> Якщо конфігурацію Firebase ще не налаштовано, додаток автоматично працює в демонстраційному режимі з вбудованими зразками завдань та зберігає згенеровані завдання у `localStorage`. Як тільки ви додасте реальні ключі в `.env`, збереження автоматично переключиться на живий Firebase Firestore!

---

## 🔑 Налаштування Gemini API Key

Згідно з вимогами безпеки, **Gemini API Key зберігається виключно в пам'яті браузера (`localStorage`) викладача**:
1. Перейдіть до роуту `/admin`.
2. Введіть PIN-код (за замовчуванням: `1234`).
3. Відкрийте вкладку **«Налаштування»**.
4. Вставте ключ Gemini API (отримати безкоштовно можна на [Google AI Studio](https://aistudio.google.com/app/apikey)).
5. Натисніть **«Зберегти ключ»** та перевірте з'єднання кнопкою **«Тест з’єднання»**.

---

## 📂 Структура проєкту

```text
Quiz_APP/
├── index.html                  # Головний HTML-шаблон з українською локалізацією
├── package.json                # Залежності та скрипти
├── tailwind.config.js          # Конфігурація теми та палітри Tailwind CSS
├── vite.config.js              # Конфігурація збирача Vite
├── .env.example                # Приклад змінних оточення
└── src/
    ├── components/
    │   ├── admin/
    │   │   ├── AdminPinModal.jsx   # Екран блокування адмінки з PIN-кодом
    │   │   ├── TaskGenerator.jsx   # Форма генератора лекцій, ШІ-запит та прев'ю
    │   │   ├── SettingsTab.jsx     # Керування Gemini API ключем у localStorage
    │   │   └── TaskListTab.jsx     # Список та видалення завдань
    │   ├── common/
    │   │   └── Badge.jsx           # Універсальний компонент беджів
    │   ├── layout/
    │   │   ├── Navbar.jsx          # Шапка сайту з навігацією
    │   │   └── Footer.jsx          # Підвал платформи
    │   └── task/
    │       ├── QuizViewer.jsx      # Інтерактивний тест з покроковим розбором
    │       └── DragAndDropViewer.jsx # Інтерактивне сортування карток (DnD + touch)
    ├── pages/
    │   ├── HomePage.jsx        # Публічний каталог завдань для студентів
    │   ├── TaskDetailPage.jsx  # Динамічний роут завдання (/task/:id)
    │   └── AdminPage.jsx       # Роут адмін-панелі викладача (/admin)
    ├── services/
    │   ├── demoData.js         # Демонстраційні завдання з IT для швидкого тесту
    │   ├── firebase.js         # Ініціалізація та CRUD операції Firestore (tasks)
    │   └── gemini.js           # SDK Gemini з чіткими промтами для строгого JSON
    ├── App.jsx                 # Головний Router та структура макету
    ├── index.css               # Стилі Tailwind та налаштування шрифтів
    └── main.jsx                # Точка входу додатку
```

---

## 🧠 Логіка роботи системних промтів Gemini AI

У модулі `src/services/gemini.js` реалізовано:
1. Використання моделі `gemini-3.8-flash` (з автоматичним fallback на `gemini-2.5-flash`) з конфігурацією `responseMimeType: "application/json"`.
2. Суворі схеми валідації для типів активностей:
   - **Квіз (`quiz`):** генерація запитань із 4 правдоподібними варіантами відповідей, індексом правильної відповіді та детальним дидактичним поясненням (`explanation`).
   - **Drag-and-Drop (`drag-and-drop`):** розбивка на 2–4 категорії та терміни, що чітко відповідають конкретним категоріям.
3. Очищення та безпечний парсинг JSON з обробкою помилок.

