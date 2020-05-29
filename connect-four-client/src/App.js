import React, { useEffect, useState } from "react";

import "./App.css";

const ws = new WebSocket("ws://localhost:8080");

function App() {
  const [board, setBoard] = useState();
  const [color, setColor] = useState();
  const [winner, setWinner] = useState();
  const [playerId, setPlayerId] = useState();

  // close ws on unmount
  useEffect(() => {
    ws.addEventListener("message", (message) => {
      const { type, ...rest } = JSON.parse(message.data);

      switch (type) {
        case "new":
          setColor(rest.color);
          setPlayerId(rest.playerId);
          setBoard(rest.board);
          break;
        case "reset":
          setBoard(rest.board);
          break;
        case "move":
          if (rest.winner) {
            setWinner(rest.color);
          }
          setBoard(rest.board);
          break;
        default:
          throw new Error("Invalid message type");
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App">
      {playerId && <div>Player {color}</div>}
      {board &&
        board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((cell, colIndex) => (
              <span
                key={colIndex}
                onClick={() => {
                  if (!winner) {
                    ws.send(
                      JSON.stringify({ type: "move", colIdx: colIndex, color }),
                    );
                  }
                }}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      <button
        onClick={() => {
          setWinner(undefined);
          ws.send(JSON.stringify({ type: "reset" }));
        }}
      >
        reset board
      </button>
      {winner && <div>player {winner} wins!</div>}
    </div>
  );
}

export default App;
