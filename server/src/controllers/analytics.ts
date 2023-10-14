import type { Request, Response } from "express";
import { getAvgDays, getExistingYears, getSalesDataByYear } from "../db/queries/analytics";

export const getPeriodicSalesVolume = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;

  // TODO: need to update schema to allow user ( agent ) to update sale price
  // also attach contact id to soldListings table to include additional info
  // for additional analytics features
  const currentYear = new Date().getFullYear();
  const yearParam = !!year ? +year : currentYear;

  const usersSalesVolume = await getSalesDataByYear(userID, yearParam);

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

export const getAvgListingDaysOnMarket = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;

  const currentYear = new Date().getFullYear();
  const yearParam = !!year ? +year : currentYear;

  const avgDaysOnMarket = await getAvgDays(userID, yearParam);

  return res.status(200).json({
    message: "",
    averages: avgDaysOnMarket,
  });
};
