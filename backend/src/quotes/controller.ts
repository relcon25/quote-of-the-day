import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import quotesService from "./service";
import logger from "../core/logger";

const MAX_QUOTES = parseInt(process.env.MAX_QUOTES ?? "500");

export const getQuotes = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const requestedCount = parseInt(req.query.count as string);
  const tag = req.query.tag as string | undefined;

  if (requestedCount > MAX_QUOTES) {
    res
      .status(400)
      .json({ error: `Cannot request more than ${MAX_QUOTES} quotes.` });
    return;
  }
  try {
    const quotes = await quotesService.getQuotes(requestedCount, tag);
    res.json({
      quotes: quotes,
    });
  } catch (e) {
    logger.error("failed to fetch quotes.", (e as Error).message);
    res.status(400).json({ error: "failed to fetch quotes." });
  }
});
