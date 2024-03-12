import type { APIRoute } from 'astro';
import { Counter, db, eq } from 'astro:db';

export const GET: APIRoute = async function get() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dbMonth = `${year}-${month}`;

  const row = await db.select().from(Counter).where(eq(Counter.month, dbMonth));
  let newCount = 1;

  if (row[0]) {
    const { count } = row[0];
    newCount = count + 1;
    await db
      .update(Counter)
      .set({
        count: newCount,
      })
      .where(eq(Counter.month, dbMonth));
  } else {
    await db.insert(Counter).values({
      month: dbMonth,
      count: newCount,
    });
  }

  return new Response(JSON.stringify({ count: newCount }));
};
