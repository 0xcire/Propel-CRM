import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { contacts, listings, listingsToContacts, soldListings } from "./schema";

import type { PgSelect } from "drizzle-orm/pg-core";
import type { Limit, ListingStatus } from "../types";

export function withPagination<T extends PgSelect>(qb: T, page: number, limit: number = 10) {
  return qb.limit(limit).offset((page - 1) * limit);
}
