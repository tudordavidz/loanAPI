import { Request, Response, NextFunction } from "express";

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"] as string;
  const validApiKey = process.env.API_KEY || "your-secret-api-key-here";

  if (!apiKey) {
    res.status(401).json({ error: "API key is required" });
    return;
  }

  if (apiKey !== validApiKey) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  next();
};
