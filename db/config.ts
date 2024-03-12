import { column, defineDb, defineTable } from 'astro:db';

const Counter = defineTable({
  columns: {
    month: column.text({ primaryKey: true }),
    count: column.number(),
  },
});

export default defineDb({
  tables: { Counter },
});
