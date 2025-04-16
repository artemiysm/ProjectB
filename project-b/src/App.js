import React, { useState, useEffect } from "react";
import { initializeLocalStorage, getRandomPhrase, addRandomPhrase } from "./components/localStorageUtils";

const App = () => {
  const [randomPhrase, setRandomPhrase] = useState(""); // рандом фразы
  const [newPhrase, setNewPhrase] = useState(""); // ввод новой фразы

  // Инициализация при первом рендере
  useEffect(() => {
    initializeLocalStorage(); 
    setRandomPhrase(getRandomPhrase()); // случайная фраза при загрузке компонента
  }, []);

  // Обработчик новой фразы
  const handleAddPhrase = () => {
    if (newPhrase.trim() !== "") {
      addRandomPhrase(newPhrase); // Добавление фразы в localStorage
      setRandomPhrase(getRandomPhrase()); // Новая случайную фразу
      setNewPhrase(""); // Очистка поля ввода
    }
  };

  return (
    <div className="App">
      <h1>Random Phrase</h1>

       {/* Отображение случайной фразы  */}
      <div>
        <h2>Случайная фраза:</h2>
        <p>{randomPhrase}</p>
      </div>

      {/* Форма для добавления новой фразы */}
      <div>
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          placeholder="Введите новую фразу"
        />
        <button onClick={handleAddPhrase}>Добавить фразу</button>
      </div>
    </div>
  );
};

export default App;
