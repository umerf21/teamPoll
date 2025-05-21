import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthedRequest extends Request {
  user?: { userId: string };
}

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction)=> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token" });
  }

  if(auth)
    {const token = auth?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
     res.status(401).json({ error: "Invalid or expired token" });
  }}
}


