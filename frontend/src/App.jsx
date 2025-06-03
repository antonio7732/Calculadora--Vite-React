import { useState, useEffect } from "react";

function App() {
  // 1. Estados (datos que cambian)
  const [input, setInput] = useState(""); // Guarda lo que escribes (ej: "2+3")
  const [displayResult, setDisplayResult] = useState(""); // Muestra el resultado (ej: "5")
  const [theme, setTheme] = useState("dark"); // Tema oscuro/claro
  const [isScientific, setIsScientific] = useState(false); // Modo científico on/off

  // 2. Sonidos
  const playClick = () => {
    const clickSound = new Audio("/sounds/click.mp3");
    clickSound.play();
  };
  const playError = () => {
    const errorSound = new Audio("/sounds/error.mp3");
    errorSound.play();
  };

  // 3. Funciones principales
  const toggleTheme = () => {
    playClick();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleScientific = () => {
    playClick();
    setIsScientific(!isScientific);
  };

  const append = (val) => {
    playClick();
    setInput(input + val);
  };

  const clear = () => {
    playClick();
    setInput("");
    setDisplayResult("");
  };

  const backspace = () => {
    playClick();
    setInput(input.slice(0, -1));
  };

  const calculate = () => {
    try {
      const result = eval(
        input
          .replace(/π/g, "Math.PI") // Reemplaza π por 3.1416...
          .replace(/√/g, "Math.sqrt") // √4 → Math.sqrt(4)
          .replace(/sin/g, "Math.sin") // Funciones trigonométricas
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan")
          .replace(/log/g, "Math.log10") // Logaritmo base 10
          .replace(/\^/g, "**") // Potencia: 2^3 → 2**3
      );
      playClick();
      animateResult(result.toString());
    } catch {
      playError();
      animateResult("Error");
    }
  };

  const animateResult = (text) => {
    setDisplayResult("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayResult((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 40);
  };

  // 4. Detectar teclado físico
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (/[0-9+\-*/.=]/.test(key)) {
        e.preventDefault();
        if (key === "=" || key === "Enter") calculate();
        else append(key);
      } else if (key === "Backspace") backspace();
      else if (key === "Escape") clear();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  // 5. Estilos CSS (integrado en el componente)
  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    body {
      background-color: ${theme === "dark" ? "#2c3e50" : "#ecf0f1"};
      color: ${theme === "dark" ? "white" : "#2c3e50"};
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
    }
    .calculator {
      width: 320px;
      background: ${theme === "dark" ? "#34495e" : "#dfe6e9"};
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 15px;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
    }
    button {
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-size: 1.1rem;
      cursor: pointer;
      background: ${theme === "dark" ? "#3d566e" : "#bdc3c7"};
      color: ${theme === "dark" ? "white" : "#2c3e50"};
      transition: all 0.2s;
    }
    button:hover {
      opacity: 0.8;
    }
    .display {
      background: ${theme === "dark" ? "#2c3e50" : "#bdc3c7"};
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      text-align: right;
    }
    .input {
      font-size: 1.2rem;
      min-height: 25px;
    }
    .result {
      font-size: 1.8rem;
      font-weight: bold;
      color: #3498db;
      min-height: 35px;
    }
    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 10px;
    }
    .equals {
      background: #e74c3c;
      color: white;
    }
    .sci-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
  `;

  // 6. Renderizado (interfaz)
  return (
    <>
      <style>{styles}</style> {/* CSS integrado */}
      <div className="calculator">
        <div className="header">
          <h2>Calculadora Científica</h2>
          <div className="controls">
            <button onClick={toggleTheme}>
              {theme === "dark" ? "☀️ Tema Claro" : "🌙 Tema Oscuro"}
            </button>
            <button onClick={toggleScientific}>
              {isScientific ? "Básica" : "Científica"}
            </button>
          </div>
        </div>

        <div className="display">
          <div className="input">{input || "0"}</div>
          <div className="result">{displayResult}</div>
        </div>

        <div className="buttons">
          {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map((val) => (
            <button
              key={val}
              className={val === "=" ? "equals" : ""}
              onClick={() => (val === "=" ? calculate() : append(val))}
            >
              {val}
            </button>
          ))}
          <button onClick={clear}>C</button>
          <button onClick={backspace}>⌫</button>
        </div>

        {isScientific && (
          <div className="sci-buttons">
            {["√(", "sin(", "cos(", "tan(", "log(", "π", "^", "("].map((val) => (
              <button key={val} onClick={() => append(val)}>
                {val}
              </button>
            ))}
            <button onClick={() => append(")")}>)</button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;