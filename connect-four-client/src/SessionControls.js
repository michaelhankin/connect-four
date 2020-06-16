import React from "react";

import useGameContext from "./use-game-context";

function SessionControls() {
  const [state, dispatch] = useGameContext();
  const { ws, joinSessionId } = state;

  return <div>
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
  </div>;
}

export default SessionControls;
