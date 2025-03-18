import cron from "node-cron";
import quotesService from "./service";
import logger from "../core/logger";
import cache from "../core/cache";

const LOCK_KEY = "prefetchQuoteLock";
const LOCK_EXPIRATION_SECONDS = 599;

async function runScheduledTask() {
  try {
    const lockAcquired = await cache.set(
      LOCK_KEY,
      "locked",
      "EX",
      LOCK_EXPIRATION_SECONDS,
      "NX",
    );

    if (lockAcquired) {
      logger.info("Distributed lock acquired, running prefetchQuotes...");
      await quotesService.prefetchQuotesFromApi();
    } else {
      logger.info(
        "Another instance is running the scheduled task. Skipping this cycle.",
      );
    }
  } catch (error) {
    logger.error("Error in scheduled task:", error);
  }
}

cron.schedule("*/10 * * * *", () => {
  runScheduledTask();
});
