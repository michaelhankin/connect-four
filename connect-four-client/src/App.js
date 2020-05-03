import React, { useEffect, useState } from "react";
import "./App.css";

const ws = new WebSocket("ws://localhost:8080");

function App() {
  const [board, setBoard] = useState(undefined);
  const [color, setColor] = useState(1);

  // close ws on unmount
  useEffect(() => {
    ws.addEventListener("message", (message) => {
      const updatedBoard = JSON.parse(message.data);
      console.log("updated board state", updatedBoard);
      setBoard(updatedBoard);
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App">
      {board &&
        board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((cell, colIndex) => (
              <span
                key={colIndex}
                onClick={() => {
                  ws.send(
                    JSON.stringify({ position: [rowIndex, colIndex], color })
                  );
                  setColor((prevColor) => (prevColor === 1 ? 2 : 1));
                }}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      <button onClick={() => ws.send("reset")}>reset board</button>
    </div>
  );
}

export default App;
