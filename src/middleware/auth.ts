// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { API_TOKEN } from './../config.ts';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  if (token !== API_TOKEN) {
    return res.sendStatus(403);
  }

  next();
};