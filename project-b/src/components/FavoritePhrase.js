import React, { useState, useEffect } from "react";
import { getRandomPhrase } from "./components/localStorageUtils";

const FavoritePhrase = () => {
  const [randomPhrase, setRandomPhrase] = useState("");
  const [favoritePhrase, setFavoritePhrase] = useState("");

  // Загружаем случайную и избранную фразы при монтировании
  useEffect(() => {
    const storedFavorite = localStorage.getItem("favoritePhrase");
    if (storedFavorite) {
      setFavoritePhrase(storedFavorite);
    }

    const phrase = getRandomPhrase();
    setRandomPhrase(phrase);
  }, []);

  // Сохраняем избранную фразу в localStorage при изменении
  useEffect(() => {
    if (favoritePhrase) {
      localStorage.setItem("favoritePhrase", favoritePhrase);
    }
  }, [favoritePhrase]);

  const handleSetFavorite = () => {
    setFavoritePhrase(randomPhrase);
  };

  return (
    <div>
      <h2>Случайная фраза:</h2>
      <p>{randomPhrase}</p>
      <button onClick={handleSetFavorite}>Сохранить в избранное</button>

      {favoritePhrase && (
        <div style={{ marginTop: "20px" }}>
          <h2>Избранная фраза:</h2>
          <p style={{ fontStyle: "italic", color: "green" }}>{favoritePhrase}</p>
        </div>
      )}
    </div>
  );
};

export default FavoritePhrase;
