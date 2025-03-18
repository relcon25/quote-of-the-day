import client from "../core/db";
import { FavqsQuote, Quote } from "./dto";
import logger from "../core/logger";

export async function createQuote(quote: FavqsQuote) {
  const clientTransaction = await client.connect();
  try {
    await clientTransaction.query("BEGIN");

    const quoteResult = await clientTransaction.query(
      `INSERT INTO quotes (favqs_id, author, content)
             VALUES ($1, $2, $3) ON CONFLICT (favqs_id) DO NOTHING 
       RETURNING id`,
      [quote.id, quote.author, quote.body],
    );

    const quoteId = quoteResult.rows.length > 0 ? quoteResult.rows[0].id : null;
    if (quoteId) {
      // Process tags
      const tagIds: number[] = [];
      for (const tag of quote.tags) {
        const tagResult = await clientTransaction.query(
          "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
          [tag],
        );
        tagIds.push(tagResult.rows[0].id);
      }

      // Link tags to the quote
      for (const tagId of tagIds) {
        await clientTransaction.query(
          "INSERT INTO quote_tags (quote_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [quoteId, tagId],
        );
      }

      await clientTransaction.query("COMMIT");

      return { author: quote.author, content: quote.body, tags: quote.tags };
    } else {
      await clientTransaction.query("COMMIT");
      return;
    }
  } catch (error) {
    logger.error("failed to create quote", { error: (error as Error).message });
    await clientTransaction.query("ROLLBACK");
    throw error;
  } finally {
    clientTransaction.release();
  }
}

export async function getQuotes(count: number, tag?: string): Promise<Quote[]> {
  let query = `
        SELECT q.id, q.author, q.content
        FROM quotes q
    `;
  const params = tag ? [tag, count] : [count];

  if (tag) {
    query += `
            JOIN quote_tags qt ON q.id = qt.quote_id
            JOIN tags t ON qt.tag_id = t.id
            WHERE t.name = $1
        `;
  }

  query = `SELECT *
             FROM (${query}) AS temp
             ORDER BY RANDOM() LIMIT ${tag ? "$2" : "$1"}`;

  const result = await client.query(query, params);
  return result.rows.map(({ author, content }) => ({ author, content }));
}
