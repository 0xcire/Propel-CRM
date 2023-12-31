export type Completed = "true" | "false";

export type Limit = "10" | "20" | "30" | "40" | "50";

export type ListingStatus = "active" | "sold";

export type Priority = "low" | "medium" | "high";

export interface PaginationParams {
  page: number;
  limit: Limit;
}
