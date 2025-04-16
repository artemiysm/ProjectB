import { createContext, useContext, useState, useEffect } from "react";
//useContext – для глобального состояния избранных цитат.
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoritePhrases, setFavoritePhrases] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoritePhrases")) || [];
    setFavoritePhrases(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritePhrases", JSON.stringify(favoritePhrases));
  }, [favoritePhrases]);

  return (
    <FavoritesContext.Provider value={{ favoritePhrases, setFavoritePhrases }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);