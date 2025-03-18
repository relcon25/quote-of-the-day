import dotenv from "dotenv";

dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import quotesRouter from "./quotes/router";
import tagsRouter from "./tags/router";
import expressWinston from "express-winston";
import { connectDB } from "./core/db";
import logger from "./core/logger";
import { incomingLogger, requestLogger } from "./middleware/requestLogger";
import quotesService from "./quotes/service";

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(incomingLogger);
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    expressFormat: true,
    colorize: false,
    dynamicMeta: (req) => {
      return {
        requestId: req.requestId,
        reqBody: req.body,
      };
    },
  }),
);

app.get("/health", (req: Request, res: Response) => {
  res.status(202).json({ message: "I'm alive" });
});
app.use("/v1/api/quotes", quotesRouter);
app.use("/v1/api/tags", tagsRouter);
(async () => {
  await connectDB();
  quotesService.prefetchQuotesFromApi().catch(() => {
    logger.error("failed to fetch quotes on startup");
  });
  app.listen(PORT, () => {
    logger.info(`Server is running on port:${PORT}`);
  });
})();

export default app;
