import React, { useEffect } from "react";

import useGameReducer from "./use-game-reducer";

import "./App.css";

const ws = new WebSocket("ws://localhost:8080");

function App() {
  const [state, dispatch] = useGameReducer({
    board: undefined,
    color: undefined,
    winner: undefined,
    sessionId: undefined,
    joinSessionId: "",
    myTurn: undefined,
  });
  const { board, color, winner, sessionId, joinSessionId, myTurn } = state;

  // close ws on unmount
  useEffect(() => {
    ws.addEventListener("close", () => {
      console.log("connection closing :(");
    });

    ws.addEventListener("message", (message) => {
      console.log("incoming message:", message.data);
      const action = JSON.parse(message.data);

      try {
        dispatch(action);
      } catch (err) {
        if (err.message === "Invalid action type") {
          throw new Error("Invalid message type");
        } else {
          throw err;
        }
      }
    });

    return () => {
      ws.close();
    };
  }, [dispatch]);

  return (
    <div className="App">
      {!sessionId && <div>
        <button
          onClick={() => {
            const message = {
              type: "create-session",
            };
            ws.send(JSON.stringify(message));
          }}
        >
          create session
        </button>
        <button
          onClick={() => {
            const message = {
              type: "join-session",
              sessionId: joinSessionId,
            };
            ws.send(JSON.stringify(message));
          }}
        >
          join session
        </button>
        <input
          type="text"
          value={joinSessionId}
          onChange={(e) => {
            dispatch(
              { type: "set-joinSessionId", joinSessionId: e.target.value },
            );
          }}
        />
      </div>}
      {sessionId &&
        <>
          <div>Player {color}</div>
          <div>Session ID: {sessionId}</div>
          {board &&
            board.map((row, rowIndex) => (
              <div key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <span
                    key={colIndex}
                    onClick={() => {
                      if (!winner && myTurn) {
                        dispatch(
                          { type: "outgoing-move", moveIndex: colIndex },
                        );
                        ws.send(
                          JSON.stringify(
                            {
                              type: "incoming-move",
                              moveIndex: colIndex,
                              sessionId,
                              color,
                            },
                          ),
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
              // setWinner(undefined);
              ws.send(JSON.stringify({ type: "reset" }));
            }}
          >
            reset board
          </button>
          {winner && <div>player {winner} wins!</div>}
        </>}
    </div>
  );
}

export default App;
