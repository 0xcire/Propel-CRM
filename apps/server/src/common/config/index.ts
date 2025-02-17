import dotenv from "dotenv";

dotenv.config();

// export const configStore: Config = {
//   email: {
//     resendKey: <string>process.env[ENV.RESEND_KEY],
//     verifyEmail: <string>process.env[ENV.VERIFY_EMAIL],
//     recoveryEmail: <string>process.env[ENV.RECOVERY_EMAIL],
//   },
//   redis: {
//     host: <string>process.env[ENV.REDIS_HOST],
//     username: <string>process.env[ENV.REDIS_USERNAME],
//     password: <string>process.env[ENV.REDIS_PW],
//     port: <string>process.env[ENV.REDIS_PORT],
//   },
//   postgres: {
//     url: <string>process.env[ENV.PG_URL],
//   },
//   session: {
//     idleLength: <number>+(process.env[ENV.IDLE_SESSION_LENGTH] || DEFAULT.IDLE_SESSION_LENGTH),
//     preAuthLength: <number>+(process.env[ENV.PRE_AUTH_SESSION_LENGTH] || DEFAULT.PRE_AUTH_SESSION_LENGTH),
//     absoluteLength: <number>+(process.env[ENV.ABSOLUTE_SESSION_LENGTH] || DEFAULT.ABSOLUTE_SESSION_LENGTH),
//   },
//   secret: {
//     preAuthCsrf: <string>process.env[ENV.PRE_AUTH_CSRF_SECRET],
//     csrf: <string>process.env[ENV.CSRF_SECRET],
//     cookie: <string>process.env[ENV.COOKIE_SECRET],
//   },
//   saltRounds: <number>+(process.env[ENV.SALT_ROUNDS] || DEFAULT.SALT_ROUNDS),
//   oneHour: DEFAULT.ONE_HOUR as number,
// };

// export const config = {
//   get: (key: string) => {
//     if (key.includes(".")) {
//       const split = key.split(".");
//       if (split.length === 2) {
//         const key = split[0];
//         const nestedKey = split[1];

//         //@ts-ignore - unless im missing something relatively simple, typing nested index signatures seems like a pain so I'm just going to pretend
//         return configStore[key][nestedKey];
//       }
//     }

//     return configStore[key as keyof typeof configStore];
//   },
// };

export const NODE_ENV = process.env.NODE_ENV;

export const RESEND_KEY = process.env.RESEND_KEY;
export const RECOVERY_EMAIL = process.env.RECOVERY_EMAIL;
export const VERIFY_EMAIL = process.env.VERIFY_EMAIL;

export const IDLE_SESSION_COOKIE = "idle-propel-session";
export const IDLE_SESSION_LENGTH = process.env.IDLE_SESSION_LENGTH;

export const ABSOLUTE_SESSION_COOKIE = "absolute-propel-session";
export const ABSOLUTE_SESSION_LENGTH = process.env.ABSOLUTE_SESSION_LENGTH;

export const PRE_AUTH_SESSION_COOKIE = "pre-auth-session";
export const PRE_AUTH_SESSION_LENGTH = process.env.PRE_AUTH_SESSION_LENGTH;

// for quick testing
// export const IDLE_SESSION_LENGTH = "1000";
// export const ABSOLUTE_SESSION_LENGTH = "5000";
// export const PRE_AUTH_SESSION_LENGTH = "5000";

export const CSRF_COOKIE = "csrf-token";

export const CSRF_SECRET = process.env.CSRF_SECRET as string;
export const PRE_AUTH_CSRF_SECRET = process.env.PRE_AUTH_CSRF_SECRET as string;

export const COOKIE_SECRET = process.env.COOKIE_SECRET;

export const SALT_ROUNDS = process.env.SALT_ROUNDS;

export const ONE_HOUR = 3600000;

export const sessionRelatedCookies = [ABSOLUTE_SESSION_COOKIE, IDLE_SESSION_COOKIE, CSRF_COOKIE, "idle"];
