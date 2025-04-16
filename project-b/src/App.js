import React, { useState, useEffect } from "react";
import {
  initializeLocalStorage,
  getRandomPhrase,
  addRandomPhrase,
} from "./components/localStorageUtils";

const App = () => {
  const [randomPhrase, setRandomPhrase] = useState("");
  const [newPhrase, setNewPhrase] = useState("");
  const [favoritePhrases, setFavoritePhrases] = useState([]);

  useEffect(() => {
    initializeLocalStorage();

    const storedFavorites = JSON.parse(localStorage.getItem("favoritePhrases")) || [];
    setFavoritePhrases(storedFavorites);

    setRandomPhrase(getRandomPhrase());
  }, []);

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

      {/* Список избранных */}
      {favoritePhrases.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Избранные фразы:</h2>
          <ul>
            {favoritePhrases.map((phrase, index) => (
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
