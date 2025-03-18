export interface Config {
  email: Email;
  postgres: Postgres;
  redis: Redis;
  session: Session;
  secret: Secret;
  saltRounds: number;
  oneHour: number;
}

export interface Email {
  resendKey: string;
  recoveryEmail: string;
  verifyEmail: string;
}

export interface Postgres {
  url: string;
}

export interface Session {
  idleLength: number;
  absoluteLength: number;
  preAuthLength: number;
}

export interface Redis {
  host: string;
  password: string;
  username: string;
  port: string;
}

export interface Secret {
  csrf: string;
  preAuthCsrf: string;
  cookie: string;
}
