import React, { useState, useEffect } from "react";
import "./App.css";
import { categories } from "./data";

export default function App() {
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [usedItems, setUsedItems] = useState([]);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Pantalla de bienvenida y saludo
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mostrarSaludo, setMostrarSaludo] = useState(false);

  // 🔹 Nueva pantalla de carga (4 segundos)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // dura 4 segundos
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (category) {
      const catItems = categories[category];
      setItems(catItems);
      setUsedItems([]);
      setScore(0);
      setFinished(false);
      setFeedback("");
      nextWord(catItems, []);
    }
  }, [category]);

  const nextWord = (allItems, used) => {
    const remaining = allItems.filter((i) => !used.includes(i.word));
    if (remaining.length === 0) {
      setFinished(true);
      return;
    }

    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrent(next);

    const correctWord = next.word;
    const incorrectItems = allItems.filter((i) => i.word !== correctWord);
    const shuffledIncorrect = [...incorrectItems].sort(() => 0.5 - Math.random());
    const threeIncorrectWords = shuffledIncorrect.slice(0, 3).map((i) => i.word);
    const allFourOptions = [correctWord, ...threeIncorrectWords].sort(() => 0.5 - Math.random());

    setOptions(allFourOptions);
    setAnswered(false);
    setSelectedOption(null);
  };

  const speakWord = (word) => {
    if (!word || typeof window.speechSynthesis === "undefined") return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (option) => {
    if (!current || answered) return;
    setSelectedOption(option);
    setAnswered(true);

    if (option === current.word) {
      setFeedback("✅ ¡Correcto!");
      setCorrectAnswer(current.word);
      setScore(score + 1);
    } else {
      setFeedback("❌ Incorrecto");
      setCorrectAnswer(current.word);
    }

    speakWord(current.word);
    const newUsed = [...usedItems, current.word];
    setUsedItems(newUsed);
  };

  const handleNext = () => {
    const newUsed = [...usedItems];
    setFeedback("");
    setCorrectAnswer("");
    setAnswered(false);
    setSelectedOption(null);
    nextWord(items, newUsed);
  };

  const handleRestart = () => {
    setCategory(null);
    setItems([]);
    setUsedItems([]);
    setFinished(false);
    setScore(0);
  };

  const handleComenzar = () => {
    setMostrarBienvenida(false);
    setMostrarSaludo(true);
  };

  const handleRegresarBienvenida = () => {
    setMostrarSaludo(false);
    setMostrarBienvenida(true);
    setNombreUsuario("");
    setCategory(null);
    setScore(0);
  };

  // 🔹 Mostrar pantalla de carga antes de todo
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">
          <img src="/images/logo.png" alt="ENGAME Logo" className="app-logo-inline" />
          ENGAME
        </h1>
        <p className="subtitle">Aprende palabras jugando</p>
      </header>

      <main className="main">
        {/* === Pantalla de Bienvenida === */}
        {mostrarBienvenida && (
          <div className="welcome-screen">
            <h1 className="welcome-title">🎮 Bienvenidos a ENGAME</h1>
            <p className="welcome-text">Por favor, escribe tu nombre para comenzar:</p>

            <input
              type="text"
              placeholder="Escribe tu nombre..."
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="welcome-input"
            />

            <button
              className="welcome-btn"
              onClick={handleComenzar}
              disabled={nombreUsuario.trim() === ""}
            >
              ¡Comenzar!
            </button>
          </div>
        )}

        {/* === Saludo y selección de categorías === */}
        {mostrarSaludo && !category && (
          <div className="category-select">
            <h2>✨ Bienvenido {nombreUsuario} ✨</h2>
            <h3>Elige una categoría para comenzar:</h3>

            <div className="cat-grid">
              {Object.keys(categories).map((cat) => {
                let emoji = "🎯";
                if (cat.toLowerCase().includes("colores")) emoji = "🎨";
                else if (cat.toLowerCase().includes("animales")) emoji = "🐾";
                else if (cat.toLowerCase().includes("comida")) emoji = "🍎";

                return (
                  <button
                    key={cat}
                    className={`cat-btn ${cat.toLowerCase().includes("colores") ? "centered" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span className="cat-emoji">{emoji}</span>
                    <span className="cat-text">{cat}</span>
                  </button>
                );
              })}
            </div>

            <button className="back-btn" onClick={handleRegresarBienvenida}>
              ⬅️ Regresar a la Bienvenida
            </button>
          </div>
        )}

        {/* === Pantalla del juego === */}
        {category && !finished && current && (
          <div className="game-container">
            <div className="category-bar">
              <div className="category-bar-top">
                <h3>{category}</h3>
                <p className="score">Puntuación: {score}</p>
              </div>
              <button className="menu-btn" onClick={handleRestart}>
                ← Menú
              </button>
            </div>

            <div className="content-area">
              <div className="image-box">
                <img
                  src={`/images/${current.image}`}
                  alt={current.word}
                  className="word-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/220x220/5c6bc0/ffffff?text=${current.word}`;
                  }}
                />
                <p className="instruction">¿Cuál es la palabra correcta?</p>
              </div>

              <div className="options-box">
                {options.map((option, index) => {
                  const isSelected = option === selectedOption;
                  const isCorrect = option === correctAnswer;
                  let optionClass = "option-btn";

                  if (answered) {
                    if (isCorrect && option === current.word) {
                      optionClass += " correct-answer";
                    } else if (isSelected) {
                      optionClass += " incorrect-selected";
                    }
                  } else if (isSelected) {
                    optionClass += " selected";
                  }

                  return (
                    <button
                      key={index}
                      className={optionClass}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                    >
                      {option}
                    </button>
                  );
                })}

                {/* === Recuadro solo para texto === */}
                {feedback && (
                  <>
                    <div
                      className={`feedback-box ${
                        feedback.includes("Correcto") ? "correct" : "incorrect"
                      }`}
                    >
                      <p className="feedback-text">
                        {feedback.includes("Correcto")
                          ? "✅ ¡Correcto!"
                          : `❌ Incorrecto, la respuesta correcta era: ${correctAnswer}`}
                      </p>
                    </div>

                    {/* Botones fuera del recuadro */}
                    <div className="feedback-buttons">
                      <button className="audio-btn" onClick={() => speakWord(correctAnswer)}onTouchStart={() => speakword(correctAnswer)}>
                        🔊 Escuchar palabra
                      </button>
                      <button className="next-btn" onClick={handleNext}>
                        ➡️ Siguiente
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === Pantalla final === */}
        {finished && (
          <div className="end-screen">
            <h2>🎉 ¡Felicitaciones {nombreUsuario}! 🎉</h2>
            <p>
              Tu puntuación es: {score} / {items.length}
            </p>
            <button className="restart-btn" onClick={handleRestart}>
              Volver al menú
            </button>
          </div>
        )}
      </main>

      <footer className="footer"></footer>
    </div>
  );
}
