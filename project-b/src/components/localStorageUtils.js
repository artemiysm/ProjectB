// localStorageUtils.js

const PHRASES_KEY = "phrases";

// Инициализация при первом запуске
export const initializeLocalStorage = () => {
  const existing = localStorage.getItem(PHRASES_KEY);
  if (!existing) {
    const defaultPhrases = [
      { text: "Будь собой — прочие роли уже заняты", author: "Оскар Уайльд" },
      { text: "Лучше сделать и пожалеть, чем не сделать и пожалеть", author: "Неизвестен" },
      { text: "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма", author: "Уинстон Черчилль" },
    ];
    localStorage.setItem(PHRASES_KEY, JSON.stringify(defaultPhrases));
  }
};

// Получить все фразы
export const getAllPhrases = () => {
  const phrases = JSON.parse(localStorage.getItem(PHRASES_KEY)) || [];
  return phrases;
};

// Получить случайную фразу
export const getRandomPhrase = () => {
  const phrases = getAllPhrases();
  if (phrases.length === 0) return { text: "", author: "" };
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

// Добавить новую фразу
export const addRandomPhrase = (text, author) => {
  const phrases = getAllPhrases();
  phrases.push({ text, author });
  localStorage.setItem(PHRASES_KEY, JSON.stringify(phrases));
};
// Редактировать фразу
export const editPhrase = (index, newText, newAuthor) => {
  const phrases = JSON.parse(localStorage.getItem("phrases")) || [];
  if (phrases[index]) {
    phrases[index] = { text: newText, author: newAuthor };
    localStorage.setItem("phrases", JSON.stringify(phrases));
  }
};
