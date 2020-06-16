import React, { useReducer, useContext } from "react";

function updateBoard(board, moveIndex, color) {
  const updatedBoard = board.map((row) => [...row]);
  let moveRowIdx = -1;
  for (let i = updatedBoard.length - 1; i >= 0; i--) {
    if (updatedBoard[i][moveIndex] === 0) {
      moveRowIdx = i;
      break;
    }
  }
  if (moveRowIdx !== -1) {
    updatedBoard[moveRowIdx][moveIndex] = color;
  }
  return updatedBoard;
}

function gameReducer(state, action) {
  switch (action.type) {
    case "create-session": {
      const { sessionId, color, board } = action;
      return {
        ...state,
        board,
        color,
        sessionId,
        joinSessionId: "",
        myTurn: true,
        waitingForOtherPlayerToJoin: true,
      };
    }
    case "other-player-joined": {
      return {
        ...state,
        waitingForOtherPlayerToJoin: false,
      };
    }
    case "join-session": {
      const { color, board } = action;
      const { joinSessionId } = state;
      return {
        ...state,
        board,
        color,
        sessionId: joinSessionId,
        joinSessionId: "",
        myTurn: false,
        waitingForOtherPlayerToJoin: false,
      };
    }
    case "set-joinSessionId": {
      const { joinSessionId } = action;
      return {
        ...state,
        joinSessionId,
      };
    }
    case "incoming-move": {
      const { board } = action;
      return {
        ...state,
        board,
        myTurn: true,
      };
    }
    case "outgoing-move": {
      const { moveIndex } = action;
      const { board, color } = state;
      const updatedBoard = updateBoard(board, moveIndex, color);

      return {
        ...state,
        myTurn: false,
        board: updatedBoard,
      };
    }
    case "winner": {
      const { board, color } = action;
      return {
        ...state,
        board,
        myTurn: undefined,
        winner: color,
      };
    }
    case "new-game": {
      const { board } = action;
      const { winner, color } = state;
      return {
        ...state,
        board,
        myTurn: winner === color,
        winner: undefined,
      };
    }
    default:
      throw new Error("Invalid action type");
  }
}

const GameContext = React.createContext();

function GameProvider(props) {
  const { children, ...initialState } = props;
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  const { state, dispatch } = context;
  return [state, dispatch];
}

export { GameProvider };

export default useGameContext;
