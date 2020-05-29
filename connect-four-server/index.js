const WebSocket = require("ws");
const uuidv4 = require("uuid").v4;

const Board = require("./Board");

const wss = new WebSocket.Server({ port: 8080 });
let sessionId;
// let board;
let playerOneId;
let playerTwoId;

/** 
 * session schema
 * players: { id: Color }
 * board: Board
 * id: string
 */
const sessions = {};

console.log("server listening on port 8080");

// after connecting, user can either create a new game
// or join an existing one
wss.on("connection", (ws) => {
  console.log("new connection opened");

  ws.on("message", (message) => {
    console.log("incoming message:", message);
    const { type, ...rest } = JSON.parse(message);
    // let response;

    switch (type) {
      case "create-session": {
        const playerId = uuidv4();
        const sessionId = uuidv4();
        const color = 1;
        const board = new Board();
        const session = {
          id: sessionId,
          players: {
            [playerId]: color,
          },
          board,
        };
        sessions[sessionId] = session;
        const response = {
          type,
          board: board.getState(),
          sessionId,
          playerId,
          color,
        };
        ws.send(JSON.stringify(response));
        break;
      }
      case "join-session": {
        // TODO: fail if there are already 2 players in the session
        const playerId = uuidv4();
        const color = 2;
        const { board, players } = sessions[rest.sessionId];
        players[playerId] = color;
        const response = {
          type,
          board: board.getState(),
          color,
          playerId,
        };
        ws.send(JSON.stringify(response));
        break;
      }
      // case "reset":
      //   board.reset();
      //   response = { type, board: board.getState() };
      //   break;
      case "move": {
        // TODO: rename `colIdx` to `column`
        const { colIdx, sessionId, playerId } = rest;
        const { board, players } = sessions[sessionId];
        const { color } = players[playerId];
        const winner = board.move(colIdx, color);
        response = { type, board: board.getState(), winner, color };
        // TODO: send a separate message if there's a winner

        for (const client of wss.clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(response));
          }
        }
        break;
      }
      default:
        throw new Error("Invalid message type");
    }
  });
});
