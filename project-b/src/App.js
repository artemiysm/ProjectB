import React, { useState, useEffect, useReducer, useRef } from "react";
import {
  initializeLocalStorage,
  getRandomPhrase,
  addRandomPhrase,
  getAllPhrases,
} from "./components/localStorageUtils";
import FilteredPhraseList from "./components/FilterPfraseList";

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

  const authors = ["Все", ...new Set(state.allPhrases.map((p) => p.author).filter(Boolean))];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Random Phrase</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Случайная фраза:</h2>
        <p className="text-lg italic">
        {randomPhrase.text ? '"${randomPhrase.text}" - ': ""}
          <strong>{randomPhrase.author}</strong>
        </p>
        <div className="mt-4 space-x-2">
          <button
            onClick={handleSetFavorite}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Добавить в избранное
          </button>

          <button
            ref={generateBtnRef}
            onClick={handleGenerateNew}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Сгенерировать
          </button>
        </div>
      </div>

Степанолас, [17.04.2025 0:28]
<div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Добавить свою фразу:</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            placeholder="Введите новую фразу"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Автор фразы"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddPhrase}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Добавить фразу
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Фильтрация по автору:</h2>
        <select
          value={state.author}
          onChange={(e) =>
            dispatch({ type: "FILTER_BY_AUTHOR", payload: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          {authors.map((author, idx) => (
            <option key={idx} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      <FilteredPhraseList phrases={state.allPhrases} author={state.author} />

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Фразы по автору:</h2>
        {state.filteredPhrases.length > 0 ? (
          <ul className="list-disc list-inside">
            {state.filteredPhrases.map((phrase, index) => (
              <li key={index}>
                "{phrase.text}" — <strong>{phrase.author}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет фраз для выбранного автора.</p>
        )}
      </div>

      {favoritePhrases.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">Избранные фразы:</h2>
          <ul className="list-disc list-inside">
            {favoritePhrases.map((phrase, index) => (
              <li key={index} className="text-green-700 italic">
                "{phrase.text}" — <strong>{phrase.author}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;