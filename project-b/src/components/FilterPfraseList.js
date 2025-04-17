import React, { useMemo, useState } from "react";
import { getAllPhrases } from "./localStorageUtils";

const FilteredPhraseList = ({ phrases, author }) => {
  const filtered = useMemo(() => {
    if (author === "Все") return phrases;
    return phrases.filter((phrase) => phrase.author === author);
  }, [phrases, author]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const handleEdit = (index) => {
    const phrase = filtered[index];
    setEditText(phrase.text);
    setEditAuthor(phrase.author);
    setEditingIndex(index);
  };

  const handleSave = () => {
    const updatedPhrases = getAllPhrases().map((phrase, i) => {
      const filteredIndex = phrases.findIndex(
        (p) =>
          p.text === filtered[editingIndex].text &&
          p.author === filtered[editingIndex].author
      );
      if (i === filteredIndex) {
        return { text: editText, author: editAuthor };
      }
      return phrase;
    });
    localStorage.setItem("phrases", JSON.stringify(updatedPhrases));
    setEditingIndex(null);
    window.location.reload(); // Обновим данные
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Результаты фильтрации:</h2>
      {filtered.length === 0 ? (
        <p>Фраз не найдено.</p>
      ) : (
        <ul>
          {filtered.map((phrase, index) => (
            <li key={index}>
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ color: "black" }}
                    className="border px-2 py-1 mr-2" 
                  />
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    style={{ color: "black" }}
                    className="border px-2 py-1 mr-2" 
                  />
                  <button onClick={handleSave} className="text-green-600 mr-2">Сохранить</button>
                  <button onClick={() => setEditingIndex(null)} className="text-red-600">Отмена</button>
                </>
              ) : (
                <>
                  "{phrase.text}" — <strong>{phrase.author}</strong>{" "}
                  <button
                    onClick={() => handleEdit(index)}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    ✏️ Редактировать
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredPhraseList;