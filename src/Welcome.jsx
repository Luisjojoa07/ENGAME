import React from "react";

export default function Welcome({ onSelectCategory }) {
  const categories = [
    { id: "body", name: "🧍‍♂️ Partes del Cuerpo" },
    { id: "animals", name: "🐶 Animales" },
    { id: "objects", name: "🎒 Objetos" },
  ];

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">🎮 ENGAME</h1>
      <p className="welcome-text">Selecciona una categoría para comenzar:</p>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={category-btn color-${index}}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}