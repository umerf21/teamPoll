import express from "express";
import http from "http";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import authRouter from "./routes/auth";
import { setupWebSocket } from "./websocket";
import pollRouter from "./routes/poll";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/poll", pollRouter);

// HTTP server with WebSocket attached
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket logic
setupWebSocket(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
