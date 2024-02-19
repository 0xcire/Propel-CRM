// ref: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
// http status implementation is my own

import HttpStatus from "http-status-codes";

type StatusCodes = Omit<typeof HttpStatus, "getStatusCode" | "getStatusText">;
type StatusCodeNames = keyof StatusCodes;

export class PropelHTTPError extends Error {
  public readonly code: number;
  public readonly message: string;
  public readonly cause?: string;

  constructor(opts: { code: StatusCodeNames; message: string }) {
    super(opts.message);

    const proto = new.target.prototype;

    Object.setPrototypeOf(this, proto);
    this.name = proto.constructor.name;

    this.code = HttpStatus[opts.code];
    this.message = opts.message;
  }
}
