import { Counter, db } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  db.insert(Counter).values([{ month: `${year}-${month}`, count: 0 }]);
}
