const WebSocket = require("ws");
const uuidv4 = require("uuid").v4;

const Board = require("./Board");

const wss = new WebSocket.Server({ port: 8080 });
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
        break;
      }
      case "incoming-move": {
        const { moveIndex, sessionId, color } = rest;
        const board = sessions[sessionId];
        board.move(moveIndex, color);
        response = { type, board: board.getState() };

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
