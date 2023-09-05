import type { Request, Response } from "express";
import { db } from "../db";
import { listings, soldListings } from "../db/schema";
import { and, between, eq, isNotNull, sql } from "drizzle-orm";
import { getExistingYears, getSalesDataByYear } from "../db/queries/analytics";

export const getPeriodicSalesVolume = async (req: Request, res: Response) => {
  const userID = req.user.id;
  // const {year} = req.query
  // year = 2023

  // TODO: need to update schema to allow user ( agent ) to update sale price
  // also attach contact id to soldListings table to include additional info
  // for additional analytics features

  const usersSalesVolume = await getSalesDataByYear(userID);

  return res.status(200).json({
    message: "",
    analytics: usersSalesVolume,
  });
};

export const getExistingSalesYears = async (req: Request, res: Response) => {
  const userID = req.user.id;

  const years = await getExistingYears(userID);

  return res.status(200).json({
    message: "",
    years: years,
  });
};

// GCI - Gross Commission Income
export const getGCIData = async () => {
  return 0;
};
