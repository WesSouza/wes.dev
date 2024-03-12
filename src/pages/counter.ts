import type { APIRoute } from 'astro';
import { Counter, db, eq, sql } from 'astro:db';

export const GET: APIRoute = async function get() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dbMonth = `${year}-${month}`;

  const [currentMonth, sum] = await db.batch([
    db.select().from(Counter).where(eq(Counter.month, dbMonth)),
    db
      .select({
        sum: sql<number>`cast(sum(${Counter.count}) as int)`,
      })
      .from(Counter),
  ]);

  if (currentMonth[0]) {
    const { count } = currentMonth[0];
    await db
      .update(Counter)
      .set({
        count: count + 1,
      })
      .where(eq(Counter.month, dbMonth));
  } else {
    await db.insert(Counter).values({
      month: dbMonth,
      count: 1,
    });
  }

  return new Response(JSON.stringify({ count: (sum[0]?.sum ?? 0) + 1 }));
};
