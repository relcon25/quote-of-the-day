import { FavqsQuote, Quote } from "./dto";
import cache from "../core/cache";
import logger from "../core/logger";
import _ from "lodash";
import axios from "axios";
import { createQuote, getQuotes } from "./repository";
import "./scheduler";

const EXTERNAL_SERVER_QUOTE_AMOUNT = 25;
const FAVQS_API_KEY = process.env.FAVQS_API_KEY;
const MAX_QUOTES = parseInt(process.env.MAX_QUOTES ?? "500");
import pLimit from "p-limit";

const limit = pLimit(5);

interface FavqsResponse {
  quotes: FavqsQuote[];
}
const redisKey = (tag?: string) =>
  tag ? "cached_quotes:" + tag : "cached_quotes";
class QuotesService {
  isQuoteValid(quote: FavqsQuote) {
    return (
      !_.isEmpty(quote.author) &&
      !_.isEmpty(quote.body) &&
      !_.isEmpty(quote.tags)
    );
  }

  async fetchQuotesFromDb(tag?: string) {
    const quotesFromDb = await getQuotes(MAX_QUOTES, tag);
    if (!_.isEmpty(quotesFromDb)) {
      await cache.set(redisKey(tag), JSON.stringify(quotesFromDb), "EX", 30);
    }
  }

  async prefetchQuotesFromApi() {
    logger.info(`start fetching quotes from api`);
    let allQuotes: FavqsQuote[] = [];
    const pagesToFetch = Math.ceil(MAX_QUOTES / EXTERNAL_SERVER_QUOTE_AMOUNT);

    for (let i = 1; i <= pagesToFetch; i++) {
      try {
        const response = await axios.get("https://favqs.com/api/quotes", {
          headers: {
            Authorization: `Token token="${FAVQS_API_KEY}"`,
          },
          params: { page: i },
        });
        const data = response.data as FavqsResponse;
        if (data && data.quotes && data.quotes.length > 0) {
          allQuotes = allQuotes.concat(data.quotes);
        } else {
          break;
        }
        if (allQuotes.length >= MAX_QUOTES) break;
      } catch (err) {
        logger.error(`Error fetching quotes on page ${i}:`, {
          error: (err as Error).message,
        });
        break;
      }
    }
    if (_.isEmpty(allQuotes)) {
      return;
    }
    const filteredQuotes = await Promise.all(
      allQuotes
        .filter(this.isQuoteValid)
        .map((quote) => limit(() => createQuote(quote))),
    );
    logger.info(`Fetched ${filteredQuotes.length} quotes.`);
  }

  async getQuotes(requestedCount: number, tag?: string): Promise<Quote[]> {
    let cachedQuotes = await cache.get(redisKey(tag));
    if (!cachedQuotes) {
      logger.info("No cached quotes found. Prefetching from DB", {
        key: redisKey(tag),
      });
      await this.fetchQuotesFromDb(tag);
      cachedQuotes = await cache.get(redisKey(tag));
      if (!cachedQuotes) {
        throw new Error("Unable to fetch quotes from DB.");
      }
    } else {
      logger.info("cached quotes found.", { key: redisKey(tag) });
    }

    const parsedCachedQuotes = JSON.parse(cachedQuotes);
    const shuffled = _.shuffle(parsedCachedQuotes);
    return shuffled.slice(0, requestedCount);
  }
}

export default new QuotesService();
