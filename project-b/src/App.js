import React, { useState, useEffect, useReducer, useRef } from "react";
import {
  initializeLocalStorage,
  getRandomPhrase,
  addRandomPhrase,
  getAllPhrases,
  editPhrase,
} from "./components/localStorageUtils";


const initialFilterState = {
  allPhrases: [],
  filteredPhrases: [],
  author: "Все",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PHRASES":
      return {
        ...state,
        allPhrases: action.payload,
        filteredPhrases: action.payload,
      };
    case "FILTER_BY_AUTHOR":
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
  const [randomPhrase, setRandomPhrase] = useState({ text: "", author: "" });
  const [newPhrase, setNewPhrase] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [favoritePhrases, setFavoritePhrases] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedPhrase, setEditedPhrase] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");
  const [state, dispatch] = useReducer(reducer, initialFilterState);

  const generateBtnRef = useRef(null);

  useEffect(() => {
    initializeLocalStorage();
    const storedFavorites = JSON.parse(localStorage.getItem("favoritePhrases")) || [];
    setFavoritePhrases(storedFavorites);
    const random = getRandomPhrase();
    setRandomPhrase(random);
    const phrases = getAllPhrases();
    dispatch({ type: "SET_PHRASES", payload: phrases });
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritePhrases", JSON.stringify(favoritePhrases));
  }, [favoritePhrases]);

  useEffect(() => {
    if (generateBtnRef.current) {
      generateBtnRef.current.focus();
    }
  }, []);

  const handleAddPhrase = () => {
    if (newPhrase.trim() !== "" && newAuthor.trim() !== "") {
      addRandomPhrase(newPhrase, newAuthor);
      setRandomPhrase(getRandomPhrase());
      setNewPhrase("");
      setNewAuthor("");
      dispatch({ type: "SET_PHRASES", payload: getAllPhrases() });
    }
  };

  const handleSetFavorite = () => {
    const isDuplicate = favoritePhrases.some(
      (p) => p.text === randomPhrase.text && p.author === randomPhrase.author
    );
    if (!isDuplicate) {
      setFavoritePhrases([...favoritePhrases, randomPhrase]);
    }
  };

  const handleGenerateNew = () => {
    setRandomPhrase(getRandomPhrase());
  };

  const handleEdit = (index, phrase) => {
    setEditIndex(index);
    setEditedPhrase(phrase.text);
    setEditedAuthor(phrase.author);
  };

  const handleSaveEdit = () => {
    if (editedPhrase.trim() && editedAuthor.trim()) {
      editPhrase(editIndex, editedPhrase, editedAuthor);
      setEditIndex(null);
      setEditedPhrase("");
      setEditedAuthor("");
      dispatch({ type: "SET_PHRASES", payload: getAllPhrases() });
    }
  };

  const authors = ["Все", ...new Set(state.allPhrases.map((p) => p.author).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-black font-sans">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-center mb-8">Random Phrase Generator</h1>

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

        {/* Добавление фразы */}
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

        {/* Фильтрация  по автору*/}
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
        
        {/* Список отфильтрованных фраз с редактированием */}
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
                        className="border p-2 rounded w-full"
                      />
                      <input
                        type="text"
                        value={editedAuthor}
                        onChange={(e) => setEditedAuthor(e.target.value)}
                        className="border p-2 rounded w-full"
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
        

        {/* Избранное */}
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