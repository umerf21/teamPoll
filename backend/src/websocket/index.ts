import { WebSocketServer } from "ws";

export function setupWebSocket(wss: WebSocketServer) {
  wss.on("connection", (ws) => {
    console.log("Client connected via WebSocket");

    ws.on("message", (msg) => {
      console.log("Received from client:", msg.toString());
    });

    ws.send("Connected to poll WebSocket");
  });
}
