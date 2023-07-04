import type { Request, Response } from "express";

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(400);
  }
  //check user exists
  //check password is correct

  return res.status(200).json("signing in").end();
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.sendStatus(400);
  }
  // check for existing user

  return res.status(200).json("signing up").end();
};

export const signout = async (req: Request, res: Response) => {
  // console.log("signing out");
  return res.json("signing out");
};
