import {
  getAvgDays,
  getAvgTimeToClose,
  getExistingYears,
  getListToSaleRatioByYear,
  getSalesDataByYear,
} from "@propel/drizzle/queries/analytics";
import { formatAnalyticsData, getCurrentYear } from "../utils";

import type { Request, Response } from "express";

export const getSalesVolumeForYear = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;

  const currentYear = getCurrentYear();
  const yearParam = !!year ? +year : currentYear;

  const usersSalesVolume = await getSalesDataByYear(userID, yearParam);

  const fullSalesVolume = formatAnalyticsData(
    usersSalesVolume,
    (data) =>
      (
        data as {
          month: unknown;
          volume: unknown;
        }
      ).volume,
    "0"
  );

  return res.status(200).json({
    message: "",
    volumes: fullSalesVolume,
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

  const currentYear = getCurrentYear();
  const yearParam = !!year ? +year : currentYear;

  const avgDaysOnMarket = await getAvgDays(userID, yearParam);
  const fullDaysOnMarket = formatAnalyticsData(
    avgDaysOnMarket,
    (data) =>
      (
        data as {
          month: unknown;
          average: unknown;
        }
      ).average,
    "0"
  );

  return res.status(200).json({
    message: "",
    averages: fullDaysOnMarket,
  });
};

export const getListToSaleRatioForYear = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;

  try {
    const currentYear = getCurrentYear();
    const yearParam = !!year ? +year : currentYear;

    const listToSaleRatio = await getListToSaleRatioByYear(userID, yearParam);

    const fullListToSaleRatio = formatAnalyticsData(
      listToSaleRatio,
      (data) =>
        (
          data as {
            month: unknown;
            ratio: unknown;
          }
        ).ratio,
      "0"
    );

    return res.status(200).json({
      message: "",
      ratios: fullListToSaleRatio,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

export const getAvgTimeToCloseLead = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;
  try {
    const currentYear = getCurrentYear();
    const yearParam = !!year ? +year : currentYear;

    const avgTimeToClose = await getAvgTimeToClose(userID, yearParam);

    const fullAvgTimeToClose = formatAnalyticsData(
      avgTimeToClose,
      (data) =>
        (
          data as {
            month: unknown;
            days: unknown;
          }
        ).days,
      "0"
    );

    return res.status(200).json({
      message: "",
      days: fullAvgTimeToClose,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
