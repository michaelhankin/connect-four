import React from "react";

import useGameContext from "./use-game-context";
import Status from "./Status";

function Game() {
  const [state, dispatch] = useGameContext();
  const {
    color,
    sessionId,
    board,
    winner,
    waitingForOtherPlayerToJoin,
    myTurn,
    ws,
  } = state;

  const canMove = !winner && !waitingForOtherPlayerToJoin && myTurn;

  return (
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
                  if (canMove) {
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

      <Status />
    </>
  );
}

export default Game;
