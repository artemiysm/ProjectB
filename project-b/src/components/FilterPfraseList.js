import React, { useMemo } from "react";

/**
 * @param {Array} props.phrases - Все фразы: [{ text, author }]
 * @param {string} props.author - Выбранный автор для фильтрации
 */
const FilteredPhraseList = ({ phrases, author }) => {
  // useMemo кэширует результат фильтрации, если phrases или author не изменились
  const filtered = useMemo(() => {
    console.log("🔍 Фильтрация происходит...");
    if (author === "Все") return phrases;
    return phrases.filter((phrase) => phrase.author === author);
  }, [phrases, author]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Результаты фильтрации:</h2>
      {filtered.length === 0 ? (
        <p>Фраз не найдено.</p>
      ) : (
        <ul>
          {filtered.map((phrase, index) => (
            <li key={index}>
              "{phrase.text}" — <strong>{phrase.author}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredPhraseList;