import { Request, Response, NextFunction } from "express";
import users from "../database/users.json";

const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({ error: "Must enter a valid token" });

  const validate = users.find((u) => u.token === token);

  if (!validate) return res.status(401).json({ error: "Incorrect token" });

  next();
};

export { validateAuth };
