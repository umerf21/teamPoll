import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post('/anon', (req: Request, res: Response) => {

        const userId = uuidv4();

  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

   res.status(201).json({ token });
  
  
});


export default router;
