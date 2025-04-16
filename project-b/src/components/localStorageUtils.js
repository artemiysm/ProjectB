const randomPhrases = [
    "Программирование — это не работа, а образ жизни.",
    "Будь лучшей версией себя.",
    "Секрет успеха в том, чтобы начать.",
    "Не сдавайся — каждый шаг приближает тебя к цели.",
    "Все, что ты делаешь, имеет значение.",
    "Сложности делают нас сильнее.",
    "Каждое падение — это шанс подняться.",
  ];
  
  export const getRandomPhrase = () => {
    const storedPhrases = JSON.parse(localStorage.getItem("randomPhrases"));
    const phrases = storedPhrases || randomPhrases; // Если в LocalStorage нет фраз, беруться дефолтные
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex]; // Возвращаем рандом фразу
  };
  
  // Новая фраза
  export const addRandomPhrase = (newPhrase) => {
    const storedPhrases = JSON.parse(localStorage.getItem("randomPhrases")) || randomPhrases;
    storedPhrases.push(newPhrase); // Добавление новой фразы
    localStorage.setItem("randomPhrases", JSON.stringify(storedPhrases)); // Сохранение бновалённого массива 
  };
  
  // Работа LocalStorage
  export const initializeLocalStorage = () => {
    if (!localStorage.getItem("randomPhrases")) {
      localStorage.setItem("randomPhrases", JSON.stringify(randomPhrases)); 
    }
  };
  