import React, { useEffect, useState } from "react";

import "./App.css";

const ws = new WebSocket("ws://localhost:8080");

function App() {
  const [board, setBoard] = useState();
  const [color, setColor] = useState();
  const [winner, setWinner] = useState();
  const [playerId, setPlayerId] = useState();
  const [sessionId, setSessionId] = useState();
  const [joinSessionId, setJoinSessionId] = useState("");
  const [myTurn, setMyTurn] = useState();
  // const [waitingForOtherPlayer, setWaitingForOtherPlayer] = useState()

  // close ws on unmount
  useEffect(() => {
    ws.addEventListener("message", (message) => {
      const { type, ...rest } = JSON.parse(message.data);

      // TODO: create reducer, map message types to actions
      switch (type) {
        case "create-session": {
          setSessionId(rest.sessionId);
          console.log("session id", rest.sessionId);
          setPlayerId(rest.playerId);
          setColor(rest.color);
          // console.log(rest.board[0]);
          setBoard(rest.board);
          setMyTurn(true);
          setJoinSessionId("");
          break;
        }
        case "join-session": {
          console.log(message.data);
          setPlayerId(rest.playerId);
          setColor(rest.color);
          setBoard(rest.board);
          setMyTurn(false);
          setSessionId(joinSessionId);
          setJoinSessionId("");
          break;
        }
        // case "new":
        //   setColor(rest.color);
        //   setPlayerId(rest.playerId);
        //   setBoard(rest.board);
        //   break;
        // case "reset":
        //   setBoard(rest.board);
        //   break;
        case "move":
          setMyTurn(true);
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
  }, [joinSessionId]);

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
            setJoinSessionId(e.target.value);
          }}
        />
      </div>}
      {sessionId &&
        <>
          {playerId && <div>Player {color}</div>}
          {board &&
            board.map((row, rowIndex) => (
              <div key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <span
                    key={colIndex}
                    onClick={() => {
                      if (!winner && myTurn) {
                        setBoard((prevBoard) => {
                          let moveRowIdx = -1;
                          for (let i = prevBoard.length - 1; i >= 0; i--) {
                            if (prevBoard[i][colIndex] === 0) {
                              moveRowIdx = i;
                              break;
                            }
                          }
                          if (moveRowIdx !== -1) {
                            prevBoard[moveRowIdx][colIndex] = color;
                            ws.send(
                              JSON.stringify(
                                { type: "move", colIdx: colIndex, color },
                              ),
                            );
                            setMyTurn(false);
                          }
                          return prevBoard;
                        });
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
        </>}
    </div>
  );
}

export default App;
