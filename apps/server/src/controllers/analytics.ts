import {
  getAvgDays,
  getAvgTimeToClose,
  getExistingYears,
  getListToSaleRatioByYear,
  getSalesDataByYear,
} from "@propel/drizzle";

import { formatAnalyticsData, getCurrentYear, handleError } from "../utils";

import type { Request, Response } from "express";

export const getSalesVolumeForYear = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { year } = req.query;

    const currentYear = getCurrentYear();
    const yearParam = year ? +year : currentYear;

    const usersSalesVolume = await getSalesDataByYear(userID, yearParam);

    const fullSalesVolume = formatAnalyticsData(usersSalesVolume);

    return res.status(200).json({
      message: "",
      volumes: fullSalesVolume,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getExistingSalesYears = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;

    const years = await getExistingYears(userID);

    return res.status(200).json({
      message: "",
      years: years,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getAvgListingDaysOnMarket = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { year } = req.query;

    const currentYear = getCurrentYear();
    const yearParam = year ? +year : currentYear;

    const avgDaysOnMarket = await getAvgDays(userID, yearParam);
    const fullDaysOnMarket = formatAnalyticsData(avgDaysOnMarket);

    return res.status(200).json({
      message: "",
      averages: fullDaysOnMarket,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getListToSaleRatioForYear = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { year } = req.query;

    const currentYear = getCurrentYear();
    const yearParam = year ? +year : currentYear;

    const listToSaleRatio = await getListToSaleRatioByYear(userID, yearParam);

    const fullListToSaleRatio = formatAnalyticsData(listToSaleRatio);

    return res.status(200).json({
      message: "",
      ratios: fullListToSaleRatio,
    });
  } catch (error) {
    return handleError(error, res);
  }
};

export const getAvgTimeToCloseLead = async (req: Request, res: Response) => {
  try {
    const userID = req.user.id;
    const { year } = req.query;

    const currentYear = getCurrentYear();
    const yearParam = year ? +year : currentYear;

    const avgTimeToClose = await getAvgTimeToClose(userID, yearParam);

    const fullAvgTimeToClose = formatAnalyticsData(avgTimeToClose);

    return res.status(200).json({
      message: "",
      days: fullAvgTimeToClose,
    });
  } catch (error) {
    return handleError(error, res);
  }
};
