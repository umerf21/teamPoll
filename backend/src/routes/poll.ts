import { Router } from "express";
import { db } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { requireAuth, AuthedRequest } from "../middleware/authMiddleware";
import { getUserId } from "../controllers/authController.js";
import { rateLimit } from "../middleware/rateLimitMiddleware.js";
import { broadcastPollUpdate } from "../websocket/index.js";

const router = Router();

router.post("/", async (req, res) => {
    const { question, options, expiresAt } = req.body;
  
    if (!question || !options?.length || !expiresAt) {
       res.status(400).json({ error: "Invalid poll data" });
    }
  
    const pollId = uuidv4();
  
    try {
      await db.query("BEGIN");
  
      await db.query(
        `INSERT INTO polls (id, question, expires_at) VALUES ($1, $2, $3)`,
        [pollId, question, new Date(expiresAt)]
      );
  
      console.log("options", options);
      
      const insertOptions = options?.map((text: string) => ({
        id: uuidv4(),
        poll_id: pollId,
        text,
      }));
  
      const values = insertOptions
        ?.map((o:unknown, i:number) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        ?.join(", ");
  
      const params = insertOptions?.flatMap((o:{id:string, poll_id:string,text:string}) => [o.id, o.poll_id, o.text]);
  
      await db.query(
        `INSERT INTO poll_options (id, poll_id, text) VALUES ${values}`,
        params
      );
  
      await db.query("COMMIT");
  
       res.json({ id: pollId });
    } catch (err) {
      await db.query("ROLLBACK");
      console.error(err);
      res.status(500).json({ error: "Poll creation failed", err });
    }
  });

// POST /poll/:id/vote
router.post("/:id/vote", requireAuth, rateLimit, async (req: AuthedRequest, res) => {
  const pollId = req.params.id;
  const { optionId } = req.body;
  const userId = getUserId(req?.headers?.authorization ?? '');

  if (!optionId) res.status(400).json({ error: "Missing optionId" });

  try {
    // Check if poll is expired
    const pollRes = await db.query(`SELECT expires_at FROM polls WHERE id = $1`, [pollId]);
    if (pollRes.rows.length === 0)  res.status(404).json({ error: "Poll not found" });

    const expiresAt = new Date(pollRes.rows[0].expires_at);
    if (expiresAt < new Date())  res.status(400).json({ error: "Poll has expired" });

    // Insert vote if not already exists (idempotent)
    await db.query("BEGIN");

    const existingVote = await db.query(
      `SELECT * FROM poll_votes WHERE poll_id = $1 AND user_id = $2`,
      [pollId, userId]
    );

    if (existingVote.rows.length > 0) {
        const previousOptionId = existingVote.rows?.[0]?.option_id
        console.log("previousOptionId",previousOptionId, existingVote.rows);
        
        await db.query(
            `UPDATE poll_votes SET option_id = $1 WHERE poll_id = $2 AND user_id = $3`,
            [optionId,pollId, userId]
          );

          await db.query(
            `UPDATE poll_options SET votes = votes + 1 WHERE id = $1`,
            [optionId]
          );

          await db.query(
            `UPDATE poll_options SET votes = votes - 1 WHERE id = $1`,
            [previousOptionId]
          );

          await db.query("COMMIT");
          broadcastPollUpdate(pollId)
           res.status(200).json({ message: "Vote cast" });
    //   await db.query("ROLLBACK");
    //    res.status(200).json({ message: "Vote already cast" });
    }
    const voteId = uuidv4();
    await db.query(
      `INSERT INTO poll_votes (id, poll_id, user_id, option_id) VALUES ($1, $2, $3, $4)`,
      [voteId, pollId, userId, optionId]
    );

    await db.query(
      `UPDATE poll_options SET votes = votes + 1 WHERE id = $1`,
      [optionId]
    );

    await db.query("COMMIT");
    broadcastPollUpdate(pollId)
     res.status(200).json({ message: "Vote cast" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
     res.status(500).json({ error: "Vote failed" });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const pollId = req.params.id;
  
      const result = await db.query(
        `SELECT * FROM polls WHERE id = $1`,
        [pollId]
      );
  
      if (result.rows.length === 0) {
         res.status(404).json({ message: "Poll not found" });
      }
  
      const poll = result.rows[0];
  
      const optionsRes = await db.query(
        `SELECT * FROM poll_options WHERE poll_id = $1`,
        [pollId]
      );
      poll.options = optionsRes.rows;
  
       res.status(200).json({ data: {...poll, options:optionsRes} });
  
    } catch (error) {
      console.error("Error fetching poll:", error);
       res.status(500).json({ error: "Internal server error" });
    }
  });

export default router
