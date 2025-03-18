import express from "express";
import { getQuotes } from "./controller";
import { query } from "express-validator";

const router = express.Router();

router.get(
  "/",
  [query("count").isNumeric(), query("tag").optional()],
  getQuotes,
);

export default router;
