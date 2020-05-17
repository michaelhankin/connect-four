const WebSocket = require("ws");
const Board = require("./Board");

const wss = new WebSocket.Server({ port: 8080 });

console.log("server listening on port 8080");

wss.on("connection", (ws) => {
  console.log("new connection opened");

  const board = new Board();
  ws.send(JSON.stringify({ type: "reset", board: board.getState() }));

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

    ws.send(JSON.stringify(response));
  });
});
