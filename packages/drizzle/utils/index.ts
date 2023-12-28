import type { PgSelect } from "drizzle-orm/pg-core";

export function withPagination<T extends PgSelect>(qb: T, page: number, limit: number = 10) {
  return qb.limit(limit).offset((page - 1) * limit);
}
