const WebSocket = require("ws");
const uuidv4 = require("uuid").v4;

const Board = require("./Board");

const wss = new WebSocket.Server({ port: 8080 });
// TODO: store ws's for each player in each session
const sessions = {};

console.log("server listening on port 8080");

// after connecting, user can either create a new game
// or join an existing one
wss.on("connection", (ws) => {
  console.log("new connection opened");

  ws.on("message", (message) => {
    console.log("incoming message:", message);
    const { type, ...rest } = JSON.parse(message);

    switch (type) {
      case "create-session": {
        // TODO: make sessionIds shorter
        const sessionId = uuidv4();
        const color = 1;
        const board = new Board();
        sessions[sessionId] = board;
        const response = {
          type,
          color,
          sessionId,
          board: board.getState(),
        };
        ws.send(JSON.stringify(response));
        break;
      }
      case "join-session": {
        // TODO: fail if there are already 2 players in the session
        const color = 2;
        const board = sessions[rest.sessionId];
        const response = {
          type,
          color,
          board: board.getState(),
        };
        ws.send(JSON.stringify(response));
        for (const client of wss.clients) {
          if (
            client !== ws && client.readyState === WebSocket.OPEN
          ) {
            client.send(JSON.stringify({ type: "other-player-joined" }));
          }
        }
        break;
      }
      case "incoming-move": {
        const { moveIndex, sessionId, color } = rest;
        const board = sessions[sessionId];
        const winner = board.move(moveIndex, color);

        const responseType = winner ? "winner" : type;
        const response = {
          type: responseType,
          board: board.getState(),
        };
        if (winner) {
          response.color = color;
        }

        for (const client of wss.clients) {
          if (
            (winner || client !== ws) && client.readyState === WebSocket.OPEN
          ) {
            client.send(JSON.stringify(response));
          }
        }
        break;
      }
      case "new-game": {
        const { sessionId } = rest;
        const board = sessions[sessionId];
        board.reset();
        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, board }));
          }
        }
      }
      default:
        throw new Error("Invalid message type");
    }
  });
});
