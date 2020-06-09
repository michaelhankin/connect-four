import { useReducer } from "react";

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
    default:
      throw new Error("Invalid action type");
  }
}

export default function useGameReducer(initialState) {
  return useReducer(gameReducer, initialState);
}
