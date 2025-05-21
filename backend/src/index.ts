import express from "express";
import http from "http";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import authRouter from "./routes/auth";
import { setupWebSocket } from "./websocket";
import pollRouter from "./routes/poll";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// Add this before your routes
app.use(cors({
  origin: "http://localhost:3000", // allow frontend dev origin
  credentials: true                // if you're using cookies or auth headers
}));
// Routes
app.use("/auth", authRouter);
app.use("/poll", pollRouter);

// HTTP server with WebSocket attached
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket logic
setupWebSocket(wss);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
