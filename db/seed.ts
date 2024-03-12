import { Counter, db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Counter).values([
    { month: `2020-01`, count: 1 },
    { month: `2020-02`, count: 1 },
    { month: `2020-03`, count: 1 },
  ]);
}
