// Импортируем React и нужные хуки из react
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Создаём контекст (глобальное хранилище) для избранных фраз
const FavoritesContext = createContext();

// Компонент-обёртка, который будет предоставлять доступ к контексту
export const FavoritesProvider = ({ children }) => {
  // Создаём состояние для массива избранных фраз
  const [favoritePhrases, setFavoritePhrases] = useState([]);

  // При первом состояние компонента загружаем избранные фразы из localStorage
  useEffect(() => {
    // Получаем строку из localStorage, парсим её в массив (или пустой массив, если данных нет)
    const storedFavorites = JSON.parse(localStorage.getItem("favoritePhrases")) || [];
    // Устанавливаем полученные данные в состояние
    setFavoritePhrases(storedFavorites);
  }, []);

  // Каждый раз при изменении favoritePhrases — сохраняем его в localStorage
  useEffect(() => {
    // Преобразуем массив в строку и сохраняем
    localStorage.setItem("favoritePhrases", JSON.stringify(favoritePhrases));
  }, [favoritePhrases]);

  // Возвращаем контекст, который оборачивает дочерние компоненты
  // и передаёт в них текущее состояние и функцию для его изменения
  return (
    <FavoritesContext.Provider value={{ favoritePhrases, setFavoritePhrases }}>
      {children} {/* Дочерние элементы, которым будет доступен контекст */}
    </FavoritesContext.Provider>
  );
};

// Пользовательский хук для получения доступа к контексту из любого компонента
export const useFavorites = () => useContext(FavoritesContext);
