import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { DEMO_TASKS } from "./demoData";

// Конфігурація Firebase з плейсхолдерами та підтримкою змінних середовища (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyYOUR_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Перевірка чи заповнені справжні облікові дані
export const isFirebaseConfigured = () => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.projectId.includes("your-project-id")
  );
};

// Ініціалізація Firebase (якщо конфігурація задана)
let app = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Помилка ініціалізації Firebase:", error);
}

const LOCAL_STORAGE_TASKS_KEY = "educraft_local_tasks";

// Отримання локальних завдань для резервного тестування
const getLocalTasks = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalTasks = (tasks) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Не вдалося зберегти в localStorage:", e);
  }
};

/**
 * Збереження завдання у Firestore (або локально, якщо Firestore ще не підключено)
 * @param {Object} taskData
 * @returns {Promise<{id: string, ...taskData}>}
 */
export async function saveTask(taskData) {
  const secretKey =
    import.meta.env.VITE_ADMIN_SECRET_KEY || "qzgA6iQbhDANb4(mg26gKi62:110M{FVI";

  const preparedData = {
    ...taskData,
    secretKey,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...preparedData,
        firebaseCreatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...preparedData };
    } catch (firestoreError) {
      console.error("Помилка запису у Firestore, зберігаємо локально:", firestoreError);
    }
  }

  // Резервне збереження у LocalStorage
  const localList = getLocalTasks();
  const newLocalTask = {
    ...preparedData,
    id: `local-${Date.now()}`,
    isLocalFallback: true,
  };
  saveLocalTasks([newLocalTask, ...localList]);
  return newLocalTask;
}

/**
 * Отримання списку всіх опублікованих завдань
 * @returns {Promise<Array>}
 */
export async function getAllTasks() {
  let firestoreTasks = [];

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      firestoreTasks = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    } catch (error) {
      console.warn("Не вдалося отримати завдання з Firestore (перевірте правила доступу):", error);
    }
  }

  const localTasks = getLocalTasks();
  
  // Якщо немає завдань ні в базі, ні локально, надаємо демонстраційні
  const combined = [...firestoreTasks, ...localTasks];
  if (combined.length === 0) {
    return DEMO_TASKS;
  }
  
  // Додаємо демонстраційні завдання, якщо їх ще немає в списку
  const allIds = new Set(combined.map(t => t.id));
  const remainingDemos = DEMO_TASKS.filter(d => !allIds.has(d.id));
  
  return [...combined, ...remainingDemos];
}

/**
 * Отримання одного завдання за ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getTaskById(id) {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "tasks", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      console.warn("Помилка завантаження завдання з Firestore:", error);
    }
  }

  // Пошук у локальних збереженнях
  const localTasks = getLocalTasks();
  const foundLocal = localTasks.find((t) => t.id === id);
  if (foundLocal) return foundLocal;

  // Пошук у демонстраційних
  const foundDemo = DEMO_TASKS.find((t) => t.id === id);
  if (foundDemo) return foundDemo;

  return null;
}

/**
 * Видалення завдання за ID
 * @param {string} id
 */
export async function deleteTask(id) {
  if (isFirebaseConfigured() && db && !id.startsWith("demo-") && !id.startsWith("local-")) {
    try {
      await deleteDoc(doc(db, "tasks", id));
      return true;
    } catch (error) {
      console.error("Помилка видалення з Firestore:", error);
    }
  }

  // Видалення з localStorage
  const localList = getLocalTasks().filter((t) => t.id !== id);
  saveLocalTasks(localList);
  return true;
}

export { db, app, firebaseConfig };

