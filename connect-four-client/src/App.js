import React, { useEffect } from "react";

import useGameContext from "./use-game-context";
import SessionControls from "./SessionControls";
import Game from "./Game";

import "./App.css";

function App() {
  const [state, dispatch] = useGameContext();
  const {
    sessionId,
    ws,
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
  }, [dispatch, ws]);

  return (
    <div className="App">
      {!sessionId ? <SessionControls /> : <Game />}
    </div>
  );
}

export default App;
