import { Request, Response } from "express";

// getListing

export const getAllListings = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    return 0;
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
