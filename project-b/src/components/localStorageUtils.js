// Ключ, под которым будут храниться фразы в localStorage
const PHRASES_KEY = "phrases";

// Функция для инициализации фраз при первом запуске приложения
export const initializeLocalStorage = () => {
  const existing = localStorage.getItem(PHRASES_KEY); // Проверяем, есть ли уже данные в localStorage
  if (!existing) {
    // Если данных нет, создаём список стандартных фраз
    const defaultPhrases = [
      { text: "Будь собой — прочие роли уже заняты", author: "Оскар Уайльд" },
      { text: "Лучше сделать и пожалеть, чем не сделать и пожалеть", author: "Неизвестен" },
      { text: "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма", author: "Уинстон Черчилль" },
    ];

    // Сохраняем стандартные фразы в localStorage
    localStorage.setItem(PHRASES_KEY, JSON.stringify(defaultPhrases));
  }
};

// Функция для получения всех фраз из localStorage
export const getAllPhrases = () => {
  // Пытаемся получить и распарсить список фраз, если их нет — возвращаем пустой массив
  const phrases = JSON.parse(localStorage.getItem(PHRASES_KEY)) || [];
  return phrases;
};

// Функция для получения случайной фразы
export const getRandomPhrase = () => {
  const phrases = getAllPhrases(); // Получаем все фразы
  if (phrases.length === 0) return { text: "", author: "" }; // Если фраз нет, возвращаем пустую
  const randomIndex = Math.floor(Math.random() * phrases.length); // Генерируем случайный индекс
  return phrases[randomIndex]; // Возвращаем случайную фразу
};

// Функция для добавления новой фразы
export const addRandomPhrase = (text, author) => {
  const phrases = getAllPhrases(); // Получаем текущий список
  phrases.push({ text, author }); // Добавляем новую фразу
  localStorage.setItem(PHRASES_KEY, JSON.stringify(phrases)); // Сохраняем обновлённый список
};

// Функция для редактирования уже существующей фразы по индексу
export const editPhrase = (index, newText, newAuthor) => {
  const phrases = JSON.parse(localStorage.getItem("phrases")) || []; // Получаем список фраз
  if (phrases[index]) {
    phrases[index] = { text: newText, author: newAuthor }; // Обновляем фразу по индексу
    localStorage.setItem("phrases", JSON.stringify(phrases)); // Сохраняем список обратно
  }
};
