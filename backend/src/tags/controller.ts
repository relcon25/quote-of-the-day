import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import tagsService from "./service";
import logger from "../core/logger";

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  try {
    const tags = await tagsService.getTags();
    res.json({
      tags: tags,
    });
  } catch (e) {
    logger.error("failed to fetch tags.", { error: (e as Error).message });
    res.status(400).json({ error: "failed to fetch tags." });
  }
});
