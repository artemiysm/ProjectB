import React, { useState, useEffect, useReducer } from "react";
import {
  initializeLocalStorage,
  getRandomPhrase,
  addRandomPhrase,
} from "./components/localStorageUtils";

import { useFavorites } from "./components/FavoritesContext";


// Начальное состояние фильтра
const initialFilterState = {
  search: "",
};

// Редьюсер фильтра
const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "RESET":
      return initialFilterState;
    default:
      return state;
  }
};


const App = () => {
  const [randomPhrase, setRandomPhrase] = useState("");
  const [newPhrase, setNewPhrase] = useState("");
  const { favoritePhrases, setFavoritePhrases } = useFavorites();
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

  useEffect(() => {
    localStorage.setItem("favoritePhrases", JSON.stringify(favoritePhrases));
  }, [favoritePhrases]);

  const handleAddPhrase = () => {
    if (newPhrase.trim() !== "") {
      addRandomPhrase(newPhrase);
      setRandomPhrase(getRandomPhrase());
      setNewPhrase("");
    }
  };

  const handleSetFavorite = () => {
    if (!favoritePhrases.includes(randomPhrase)) {
      setFavoritePhrases([...favoritePhrases, randomPhrase]);
    }
  };

  const handleGenerateNew = () => {
    setRandomPhrase(getRandomPhrase());
  };
  const filteredFavorites = favoritePhrases.filter((phrase) =>
    phrase.toLowerCase().includes(filterState.search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Random Phrase</h1>

      {/* Случайная фраза */}
      <div>
        <h2>Случайная фраза:</h2>
        <p>{randomPhrase}</p>
        <button onClick={handleSetFavorite}>Добавить в избранное</button>
        <button onClick={handleGenerateNew} style={{ marginLeft: "10px" }}>
          Сгенерировать
        </button>
      </div>

      {/* Добавление новой фразы */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          placeholder="Введите новую фразу"
        />
        <button onClick={handleAddPhrase}>Добавить фразу</button>
      </div>

      
      {/* Фильтр по ключевому слову */}
      {favoritePhrases.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Фильтр:</h2>
          <input
            type="text"
            value={filterState.search}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            placeholder="Фильтр по ключевому слову"
          />
          <button
            onClick={() => dispatch({ type: "RESET" })}
            style={{ marginLeft: "10px" }}
          >
            Сбросить фильтр
          </button>
        </div>
      )}

      {/* Список избранных (фильтрованных) */}
      {filteredFavorites.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Избранные фразы:</h2>
          <ul>
            {filteredFavorites.map((phrase, index) => (
              <li key={index} style={{ color: "green", fontStyle: "italic" }}>
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
