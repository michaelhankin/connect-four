import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { GameProvider } from "./use-game-context";

import "./index.css";

const ws = new WebSocket("ws://localhost:8080");
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

ReactDOM.render(
  <React.StrictMode>
    <GameProvider {...providerProps}>
      <App />
    </GameProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
