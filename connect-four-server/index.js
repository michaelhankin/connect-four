const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

console.log(new Date(), "server listening on port 8080");

function getInitialBoard() {
  return [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
}

let board = getInitialBoard();

wss.on("connection", (ws) => {
  console.log(new Date(), "new connection opened");
  ws.send(JSON.stringify(board));

  ws.on("message", (message) => {
    console.log(new Date(), "incoming message:", message);
    if (message === "reset") {
      board = getInitialBoard();
    } else {
      const move = JSON.parse(message);
      console.log("move", move);
      const { position, color } = move;
      const [row, col] = position;
      board[row][col] = color;
    }
    console.log(new Date(), "updated board state:", board);
    ws.send(JSON.stringify(board));
  });
});
