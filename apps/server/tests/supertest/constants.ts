// maybe configurable env var
export const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "http://localhost:9090/api" : "http://localhost:8080/api";
