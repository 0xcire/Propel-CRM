import z, { ZodError } from "zod";
import { Config } from "./types";

export const configSchema = z.object({
  email: z.object({
    resendKey: z.string().min(1),
    verifyEmail: z.string().min(1),
    recoveryEmail: z.string().min(1),
  }),
  redis: z.object({
    host: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(1),
    port: z.string().min(1),
  }),
  postgres: z.object({
    url: z.string().min(1),
  }),
  session: z.object({
    idleLength: z.number().min(0),
    preAuthLength: z.number().min(0),
    absoluteLength: z.number().min(0),
  }),
  secret: z.object({
    preAuthCsrf: z.string().min(1),
    csrf: z.string().min(1),
    cookie: z.string().min(1),
  }),
  saltRounds: z.number().min(0).max(100),
  oneHour: z.number().min(0),
});

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === "undefined") {
      if (issue.path[1]) {
        const path = issue.path;
        return { message: `${path[0]}.${path[1]} is required.` };
      }
      return { message: `${issue.path[0]} required.` };
    }

    if (issue.expected === "string") {
      if (issue.path[1]) {
        const path = issue.path;
        return {
          message: `${path[0]}.${path[1]} should be of type ${issue.expected}`,
        };
      }
      return { message: `${issue.path[0]} should be of type ${issue.expected}` };
    }
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export function validateConfig(config: Config) {
  try {
    configSchema.parse(config);
  } catch (error) {
    console.log("error:", error);
    if (error instanceof ZodError) {
      console.log("message:", typeof error.message);
      throw new Error(error.message);
    }
  }
}
