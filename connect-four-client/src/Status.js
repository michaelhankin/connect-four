import React, { useState, useEffect } from "react";

import useGameContext from "./use-game-context";

function Status() {
  const [state] = useGameContext();
  const { waitingForOtherPlayerToJoin, myTurn, winner, color } = state;
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (waitingForOtherPlayerToJoin) {
      setStatusMessage("Waiting for other player to join...");
    } else if (!winner && myTurn) {
      setStatusMessage("Your turn!");
    } else if (!winner && !myTurn) {
      setStatusMessage("Waiting on other player...");
    } else if (winner && winner === color) {
      setStatusMessage("You win!");
    } else if (winner && winner !== color) {
      setStatusMessage("You lose :(");
    }
  }, [waitingForOtherPlayerToJoin, myTurn, winner, color]);

  return (
    <div>
      {statusMessage}
    </div>
  );
}

export default Status;
