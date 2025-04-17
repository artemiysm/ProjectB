// Импортируем необходимые хуки из React
import React, { useMemo, useState } from "react";
// Импортируем функцию для получения всех фраз из localStorage
import { getAllPhrases } from "./localStorageUtils";

// Компонент для отображения и фильтрации списка фраз по автору
const FilteredPhraseList = ({ phrases, author }) => {
  // useMemo используется для фильтрации фраз только тогда, когда фразы или автор меняются
  const filtered = useMemo(() => {
    if (author === "Все") return phrases; // Если выбран "Все", возвращаем весь список
    return phrases.filter((phrase) => phrase.author === author); // Иначе фильтруем по автору
  }, [phrases, author]);

  // Состояния для редактирования: индекс редактируемой фразы, текст и автор
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // Функция начала редактирования — загружаем текущий текст и автора
  const handleEdit = (index) => {
    const phrase = filtered[index]; // Берём фразу из отфильтрованного списка
    setEditText(phrase.text);      // Устанавливаем текст в состояние
    setEditAuthor(phrase.author);  // Устанавливаем автора в состояние
    setEditingIndex(index);        // Запоминаем индекс редактируемой фразы
  };

  // Сохраняем изменения после редактирования
  const handleSave = () => {
    // Получаем все фразы из localStorage
    const updatedPhrases = getAllPhrases().map((phrase, i) => {
      // Ищем индекс фразы в полном списке, чтобы её заменить
      const filteredIndex = phrases.findIndex(
        (p) =>
          p.text === filtered[editingIndex].text &&
          p.author === filtered[editingIndex].author
      );

      // Если это нужная фраза — заменяем на отредактированную
      if (i === filteredIndex) {
        return { text: editText, author: editAuthor };
      }
      return phrase; // Остальные фразы не трогаем
    });

    // Сохраняем обновлённый список в localStorage
    localStorage.setItem("phrases", JSON.stringify(updatedPhrases));

    // Завершаем редактирование
    setEditingIndex(null);

    // Обновляем страницу, чтобы отобразить новые данные
    window.location.reload();
  };

  // Рендер компонента
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Результаты фильтрации:</h2>

      {/* Если список пуст — показываем сообщение */}
      {filtered.length === 0 ? (
        <p>Фраз не найдено.</p>
      ) : (
        <ul>
          {/* Перебираем отфильтрованные фразы */}
          {filtered.map((phrase, index) => (
            <li key={index}>
              {/* Если эта фраза редактируется */}
              {editingIndex === index ? (
                <>
                  {/* Поле ввода для текста фразы */}
                  <input
                    type="text"
                    value={editText}
                    placeholder="Введите текст"
                    onChange={(e) => setEditText(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black bg-white"
                  />

                  {/* Поле ввода для автора */}
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="border border-gray-300 p-2 rounded text-black bg-white"
                  />

                  {/* Кнопка сохранить */}
                  <button onClick={handleSave} className="text-green-600 mr-2">
                    Сохранить
                  </button>

                  {/* Кнопка отмены */}
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="text-red-600"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  {/* Отображаем текст и автора фразы */}
                  "{phrase.text}" — <strong>{phrase.author}</strong>{" "}
                  {/* Кнопка редактирования */}
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

// Экспортируем компонент
export default FilteredPhraseList;
