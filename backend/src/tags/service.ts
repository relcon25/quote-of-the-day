import cache from "../core/cache";
import logger from "../core/logger";
import _ from "lodash";
import { getTags } from "./repository";

class TagsService {
  async fetchTagsFromDb() {
    const tagsFromDb = await getTags();
    if (!_.isEmpty(tagsFromDb)) {
      await cache.set("cached_tags", JSON.stringify(tagsFromDb), "EX", 30);
    }
  }

  async getTags(): Promise<string[]> {
    let cachedTags = await cache.get("cached_tags");
    if (!cachedTags) {
      logger.info("No cached tags found. Prefetching from DB");
      await this.fetchTagsFromDb();
      cachedTags = await cache.get("cached_tags");
      if (!cachedTags) {
        throw new Error("Unable to fetch tags from DB.");
      }
    }
    return JSON.parse(cachedTags);
  }
}

export default new TagsService();
