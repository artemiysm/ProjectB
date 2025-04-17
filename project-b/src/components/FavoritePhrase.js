// Импортируем React и хуки useState и useEffect
import React, { useState, useEffect } from "react";
// Импортируем функцию для получения случайной фразы из utils
import { getRandomPhrase } from "./components/localStorageUtils";

// Создаём функциональный компонент
const FavoritePhrase = () => {
  // Состояние для случайной фразы
  const [randomPhrase, setRandomPhrase] = useState("");
  // Состояние для сохранённой (избранной) фразы
  const [favoritePhrase, setFavoritePhrase] = useState("");

  // useEffect срабатывает один раз при загрузке компонента
  useEffect(() => {
    // Проверяем, есть ли сохранённая фраза в localStorage
    const storedFavorite = localStorage.getItem("favoritePhrase");
    if (storedFavorite) {
      // Если есть — сохраняем её в состояние
      setFavoritePhrase(storedFavorite);
    }

    // Получаем случайную фразу с помощью нашей утилитки
    const phrase = getRandomPhrase();
    // Устанавливаем эту фразу в состояние
    setRandomPhrase(phrase);
  }, []);

  // Второй useEffect — отслеживает изменения favoritePhrase
  useEffect(() => {
    // Если избранная фраза изменилась — сохраняем её в localStorage
    if (favoritePhrase) {
      localStorage.setItem("favoritePhrase", favoritePhrase);
    }
  }, [favoritePhrase]); // Срабатывает каждый раз, когда favoritePhrase меняется

  // Обработчик кнопки — сохраняет текущую случайную фразу как избранную
  const handleSetFavorite = () => {
    setFavoritePhrase(randomPhrase);
  };

  // Возвращаем JSX — структура отображаемой страницы
  return (
    <div>
      {/* Заголовок и текст случайной фразы */}
      <h2>Случайная фраза:</h2>
      <p>{randomPhrase}</p>

      {/* Кнопка для сохранения фразы в избранное */}
      <button onClick={handleSetFavorite}>Сохранить в избранное</button>

      {/* Если есть избранная фраза — показываем её */}
      {favoritePhrase && (
        <div style={{ marginTop: "20px" }}>
          <h2>Избранная фраза:</h2>
          <p style={{ fontStyle: "italic", color: "green" }}>
            {favoritePhrase}
          </p>
        </div>
      )}
    </div>
  );
};

// Экспортируем компонент, чтобы его можно было использовать в других частях проекта
export default FavoritePhrase;
