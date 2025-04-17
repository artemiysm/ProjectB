import React, { useState, useEffect, useReducer, useRef } from "react";
// Импорт утилит для работы с localStorage
import {
  initializeLocalStorage,
  getRandomPhrase,
  addRandomPhrase,
  getAllPhrases,
  editPhrase,
} from "./components/localStorageUtils";

// Начальное состояние для фильтрации фраз
const initialFilterState = {
  allPhrases: [],          // Все доступные фразы
  filteredPhrases: [],     // Отфильтрованные фразы
  author: "Все",           // Выбранный автор для фильтра
};

// Редуктор для управления фильтрацией
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PHRASES": // Установка всех фраз
      return {
        ...state,
        allPhrases: action.payload,
        filteredPhrases: action.payload,
      };
    case "FILTER_BY_AUTHOR": // Фильтрация по автору
      return {
        ...state,
        author: action.payload,
        filteredPhrases:
          action.payload === "Все"
            ? state.allPhrases
            : state.allPhrases.filter(
                (phrase) =>
                  phrase.author &&
                  phrase.author.toLowerCase() === action.payload.toLowerCase()
              ),
      };
    default:
      return state;
  }
};

const App = () => {
  // Состояние для текущей случайной фразы
  const [randomPhrase, setRandomPhrase] = useState({ text: "", author: "" });

  // Состояния для формы добавления новой фразы
  const [newPhrase, setNewPhrase] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  // Состояния для избранных фраз
  const [favoritePhrases, setFavoritePhrases] = useState([]);

  // Состояния для редактирования
  const [editIndex, setEditIndex] = useState(null);           // Индекс редактируемой фразы
  const [editedPhrase, setEditedPhrase] = useState("");       // Текст редактируемой фразы
  const [editedAuthor, setEditedAuthor] = useState("");       // Автор редактируемой фразы

  // Используем useReducer для фильтрации фраз
  const [state, dispatch] = useReducer(reducer, initialFilterState);

  // Ссылка на кнопку генерации фразы (для фокуса при загрузке)
  const generateBtnRef = useRef(null);

  // useEffect для инициализации данных при первом рендере
  useEffect(() => {
    initializeLocalStorage(); // Инициализация localStorage, если данных нет
    const storedFavorites = JSON.parse(localStorage.getItem("favoritePhrases")) || [];
    setFavoritePhrases(storedFavorites); // Загрузка избранного
    const random = getRandomPhrase(); // Получаем случайную фразу
    setRandomPhrase(random);
    const phrases = getAllPhrases(); // Загружаем все фразы
    dispatch({ type: "SET_PHRASES", payload: phrases }); // Устанавливаем их в состояние
  }, []);

  // useEffect для обновления localStorage при изменении избранного
  useEffect(() => {
    localStorage.setItem("favoritePhrases", JSON.stringify(favoritePhrases));
  }, [favoritePhrases]);

  // Фокус на кнопку генерации при первом рендере
  useEffect(() => {
    if (generateBtnRef.current) {
      generateBtnRef.current.focus();
    }
  }, []);

  // Добавление новой фразы
  const handleAddPhrase = () => {
    if (newPhrase.trim() !== "" && newAuthor.trim() !== "") {
      addRandomPhrase(newPhrase, newAuthor);               // Сохраняем в localStorage
      setRandomPhrase(getRandomPhrase());                  // Показываем новую случайную
      setNewPhrase("");                                    // Очищаем поля формы
      setNewAuthor("");
      dispatch({ type: "SET_PHRASES", payload: getAllPhrases() }); // Обновляем список
    }
  };

  // Добавление текущей фразы в избранное
  const handleSetFavorite = () => {
    const isDuplicate = favoritePhrases.some(
      (p) => p.text === randomPhrase.text && p.author === randomPhrase.author
    );
    if (!isDuplicate) {
      setFavoritePhrases([...favoritePhrases, randomPhrase]);
    }
  };

  // Генерация новой случайной фразы
  const handleGenerateNew = () => {
    setRandomPhrase(getRandomPhrase());
  };

  // Начать редактирование фразы
  const handleEdit = (index, phrase) => {
    setEditIndex(index);
    setEditedPhrase(phrase.text);
    setEditedAuthor(phrase.author);
  };

  // Сохранение отредактированной фразы
  const handleSaveEdit = () => {
    if (editedPhrase.trim() && editedAuthor.trim()) {
      editPhrase(editIndex, editedPhrase, editedAuthor); // Сохраняем изменения
      setEditIndex(null);                                // Сбрасываем режим редактирования
      setEditedPhrase("");
      setEditedAuthor("");
      dispatch({ type: "SET_PHRASES", payload: getAllPhrases() }); // Обновляем список
    }
  };

  // Список авторов для фильтрации (уникальные + "Все")
  const authors = ["Все", ...new Set(state.allPhrases.map((p) => p.author).filter(Boolean))];

  return (
    // Главный контейнер приложения
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-black font-sans">
      <div className="container mx-auto px-6 py-12">

        {/* Заголовок */}
        <h1 className="text-4xl font-semibold text-center text-white mb-8">Генератор случайных цитат</h1>

        {/* Случайная фраза */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Случайная фраза:</h2>
          <div className="text-center mb-6">
            <p className="text-lg italic text-gray-600">
              {randomPhrase.text ? `"${randomPhrase.text}" - ` : ""}
              <strong className="text-gray-800">{randomPhrase.author}</strong>
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSetFavorite}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Добавить в избранное
            </button>
            <button
              ref={generateBtnRef}
              onClick={handleGenerateNew}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Сгенерировать
            </button>
          </div>
        </div>

        {/* Форма добавления новой фразы */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Добавить свою фразу:</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
            <input
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Введите новую фразу"
              className="border-2 p-4 rounded-lg w-full text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Автор фразы"
              className="border-2 p-4 rounded-lg w-full text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAddPhrase}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Добавить фразу
            </button>
          </div>
        </div>

        {/* Фильтрация по автору */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Фильтрация по автору:</h2>
          <select
            value={state.author}
            onChange={(e) =>
              dispatch({ type: "FILTER_BY_AUTHOR", payload: e.target.value })
            }
            className="border-2 p-4 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-400"
          >
            {authors.map((author, idx) => (
              <option key={idx} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        {/* Список фраз с возможностью редактирования */}
        {state.filteredPhrases.length > 0 ? (
          <ul className="space-y-4">
            {state.filteredPhrases.map((phrase, index) => {
              const globalIndex = state.allPhrases.findIndex(
                (p) => p.text === phrase.text && p.author === phrase.author
              );

              return (
                <li key={index} className="flex flex-col gap-2 border-b pb-4">
                  {editIndex === globalIndex ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={editedPhrase}
                        onChange={(e) => setEditedPhrase(e.target.value)}
                        className="border p-2 rounded w-full text-black bg-white"
                      />
                      <input
                        type="text"
                        value={editedAuthor}
                        onChange={(e) => setEditedAuthor(e.target.value)}
                        className="border p-2 rounded w-full text-black bg-white"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-gray-800">
                        "{phrase.text}" — <strong>{phrase.author}</strong>
                      </p>
                      <button
                        onClick={() => handleEdit(globalIndex, phrase)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Редактировать
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Нет фраз для выбранного автора.</p>
        )}

        {/* Секция избранных фраз */}
        {favoritePhrases.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Избранные фразы:</h2>
            <ul className="list-disc list-inside text-green-600">
              {favoritePhrases.map((phrase, index) => (
                <li key={index} className="italic">
                  "{phrase.text}" — <strong>{phrase.author}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;