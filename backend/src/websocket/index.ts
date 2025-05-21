import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";
import url from "url";
import { db } from "../config/db";

type Client = {
  socket: WebSocket;
  pollId?: string;
};

const clients: Client[] = [];

export function setupWebSocket(wss: WebSocketServer) {
  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const parsedUrl = url.parse(req.url || "", true);
    const pollId = parsedUrl.pathname?.split("/").pop() ?? '';
 console.log("pollId",pollId);
 
    broadcastPollUpdate(pollId)
    try {

      const client = { socket: ws, pollId };
      clients.push(client);
      
    //   console.log(`User ${userId} connected to poll ${pollId}`);

    } catch (err) {
      ws.close();
      console.error("Invalid WebSocket auth:", err);
    }
  });

  
}


export const broadcastPollUpdate = async (pollId: string) => {
    const result = await db.query(
      `SELECT id, text, votes FROM poll_options WHERE poll_id = $1`,
      [pollId]
    );
  
    const options = result.rows;
  
    clients
      .filter((c) => c.pollId === pollId)
      .forEach((client) => {
        if (client.socket.readyState === client.socket.OPEN) {
          client.socket.send(JSON.stringify({ type: 'update', options }));
        }
      });
  };

