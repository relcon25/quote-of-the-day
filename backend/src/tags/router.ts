import express from "express";
import { getTags } from "./controller";

const router = express.Router();

router.get("/", getTags);

export default router;
