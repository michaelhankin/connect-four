const WebSocket = require("ws");
const uuidv4 = require("uuid").v4;

const Board = require("./Board");

const wss = new WebSocket.Server({ port: 8080 });
let sessionId;
let board;
let playerOneId;
let playerTwoId;

console.log("server listening on port 8080");

wss.on("connection", (ws) => {
  console.log("new connection opened");
  let playerId;
  let playerColor;
  if (!sessionId) {
    sessionId = uuidv4();
    console.log("new session created with id:", sessionId);
    board = new Board();
  }
  if (!playerOneId) {
    playerOneId = uuidv4();
    console.log("player one connected. id:", playerOneId);
    playerColor = 1;
    playerId = playerOneId;
  } else if (!playerTwoId) {
    playerTwoId = uuidv4();
    console.log("player two connected. id:", playerTwoId);
    playerColor = 2;
    playerId = playerTwoId;
  }

  ws.send(
    JSON.stringify(
      { type: "new", board: board.getState(), playerId, color: playerColor },
    ),
  );

  ws.on("message", (message) => {
    console.log("incoming message:", message);
    const { type, ...rest } = JSON.parse(message);
    let response;

    switch (type) {
      case "reset":
        board.reset();
        response = { type, board: board.getState() };
        break;
      case "move":
        const { colIdx, color } = rest;
        const winner = board.move(colIdx, color);
        response = { type, board: board.getState(), winner, color };
        break;
      default:
        throw new Error("Invalid message type");
    }

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    }
  });
});
