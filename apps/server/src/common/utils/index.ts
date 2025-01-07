export * from "./crypto";
export * from "./email";
export * from "./cookies";
export * from "./analytics";
export * from "./sessions";
export * from "./handle-error";

export const objectNotEmpty = (object: Record<string, unknown>) => {
  return Object.keys(object).length > 0;
};

export const getCurrentYear = () => new Date().getFullYear();
