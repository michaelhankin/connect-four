import React, { useEffect } from "react";

import useGameContext, { GameProvider } from "./use-game-context";
import SessionControls from "./SessionControls";

import "./App.css";

const ws = new WebSocket("ws://localhost:8080");

function App() {
  const [state, dispatch] = useGameContext();
  const {
    board,
    color,
    winner,
    sessionId,
    myTurn,
    waitingForOtherPlayerToJoin,
  } = state;

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
      {!sessionId && <SessionControls />}
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
                      if (!winner && !waitingForOtherPlayerToJoin && myTurn) {
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
          {myTurn !== undefined &&
            waitingForOtherPlayerToJoin
            ? <div>waiting for other player to join...</div>
            : <div>{myTurn ? "your turn!" : "waiting on other player..."}</div>}
          {winner &&
            <>
              <div>{winner === color ? "you win!" : "you lose :("}</div>

              <button
                onClick={() => {
                  // setWinner(undefined);
                  ws.send(JSON.stringify({ type: "reset" }));
                }}
              >
                play again
              </button>
            </>}
        </>}
    </div>
  );
}

function AppWrapper() {
  const providerProps = {
    ws,
    board: undefined,
    color: undefined,
    winner: undefined,
    sessionId: undefined,
    joinSessionId: "",
    myTurn: undefined,
    waitingForOtherPlayerToJoin: undefined,
  };

  return (
    <GameProvider {...providerProps}>
      <App />
    </GameProvider>
  );
}

export default AppWrapper;
