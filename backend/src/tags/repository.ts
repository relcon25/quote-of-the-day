import client from "../core/db";

export async function getTags(): Promise<string[]> {
  const result = await client.query(
    "SELECT DISTINCT name FROM tags ORDER BY name",
  );
  return result.rows.map((row) => row.name);
}
