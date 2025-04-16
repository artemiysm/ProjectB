import React, { useState, useEffect, useReducer } from "react";
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
    <div className="App">
      <h1>Random Phrase</h1>

      <div>
        <h2>Случайная фраза:</h2>
        <p>
          {randomPhrase.text ? `"${randomPhrase.text}" — ` : ""}
          <strong>{randomPhrase.author}</strong>
        </p>
        <button onClick={handleSetFavorite}>Добавить в избранное</button>
        <button onClick={handleGenerateNew} style={{ marginLeft: "10px" }}>
          Сгенерировать
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          placeholder="Введите новую фразу"
        />
        <input
          type="text"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          placeholder="Автор фразы"
          style={{ marginLeft: "10px" }}
        />
        <button onClick={handleAddPhrase} style={{ marginLeft: "10px" }}>
          Добавить фразу
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Фильтрация по автору:</h2>
        <select
          value={state.author}
          onChange={(e) =>
            dispatch({ type: "FILTER_BY_AUTHOR", payload: e.target.value })
          }
        >
          {authors.map((author, idx) => (
            <option key={idx} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>
      <FilteredPhraseList phrases={state.allPhrases} author={state.author} />
      <div style={{ marginTop: "30px" }}>
        <h2>Фразы по автору:</h2>
        {state.filteredPhrases.length > 0 ? (
          <ul>
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
        <div style={{ marginTop: "30px" }}>
          <h2>Избранные фразы:</h2>
          <ul>
            {favoritePhrases.map((phrase, index) => (
              <li key={index} style={{ color: "green", fontStyle: "italic" }}>
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
