import type { Completed } from "@propel/types";
import type { PaginationQuery } from "src/types";

export interface TaskSearchQuery extends PaginationQuery {
  completed: Completed,
  title: string;
  priority: string;
}

export type UpdatedTask = {
  id: number;
  title: string;
  description: string | null;
  notes: string | null;
  dueDate: string | null;
  completed: boolean | null;
  priority: string | null;
}

export interface IdParams {
  contactID: number;
  listingID: number
}