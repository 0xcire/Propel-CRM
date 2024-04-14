import { getHeaderFromResponse } from "./utils/headers";

export type Header = Awaited<ReturnType<typeof getHeaderFromResponse>>;
