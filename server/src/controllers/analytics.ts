import {
  getAvgDays,
  getAvgTimeToClose,
  getExistingYears,
  getListToSaleRatioByYear,
  getSalesDataByYear,
} from "../db/queries/analytics";
import { getCurrentYear } from "../utils";

import type { Request, Response } from "express";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// is there a way to clean up formatting data function?

export const getSalesVolumeForYear = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;

  const currentYear = getCurrentYear();
  const yearParam = !!year ? +year : currentYear;

  const usersSalesVolume = await getSalesDataByYear(userID, yearParam);
  const existingMonths = usersSalesVolume.map((data) => data.month);

  const fullSalesVolume =
    usersSalesVolume.length > 0
      ? months.map((month, index) => {
          if (!usersSalesVolume[index] && !existingMonths.includes(month)) {
            return {
              month: month,
              volume: 0,
            };
          }

          if (!existingMonths.includes(month)) {
            return {
              month: month,
              volume: 0,
            };
          }

          if (existingMonths.includes(month)) {
            const referenceIdx = existingMonths.indexOf(month);

            return {
              month: usersSalesVolume[referenceIdx].month,
              volume: usersSalesVolume[referenceIdx].volume,
            };
          }
        })
      : [];

  return res.status(200).json({
    message: "",
    analytics: fullSalesVolume,
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
  const existingMonths = avgDaysOnMarket.map((data) => data.month);

  const fullAvgDaysOnMarket =
    avgDaysOnMarket.length > 0
      ? months.map((month, index) => {
          if (!avgDaysOnMarket[index] && !existingMonths.includes(month)) {
            return {
              month: month,
              average: "0 days",
            };
          }

          if (!existingMonths.includes(month)) {
            return {
              month: month,
              average: "0 days",
            };
          }

          if (existingMonths.includes(month)) {
            const referenceIdx = existingMonths.indexOf(month);

            return {
              month: avgDaysOnMarket[referenceIdx].month,
              average: avgDaysOnMarket[referenceIdx].average,
            };
          }
        })
      : [];

  return res.status(200).json({
    message: "",
    averages: fullAvgDaysOnMarket,
  });
};

export const getListToSaleRatioForYear = async (req: Request, res: Response) => {
  const userID = req.user.id;
  const { year } = req.query;

  try {
    const currentYear = getCurrentYear();
    const yearParam = !!year ? +year : currentYear;

    const listToSaleRatio = await getListToSaleRatioByYear(userID, yearParam);
    const existingMonths = listToSaleRatio.map((data) => data.month);

    const fullListToSaleRatio =
      listToSaleRatio.length > 0
        ? months.map((month, index) => {
            if (!listToSaleRatio[index] && !existingMonths.includes(month)) {
              return {
                month: month,
                ratio: "0",
              };
            }

            if (!existingMonths.includes(month)) {
              return {
                month: month,
                ratio: "0",
              };
            }

            if (existingMonths.includes(month)) {
              const referenceIdx = existingMonths.indexOf(month);

              return {
                month: listToSaleRatio[referenceIdx].month,
                ratio: listToSaleRatio[referenceIdx].ratio,
              };
            }
          })
        : [];

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
    const existingMonths = avgTimeToClose.map((data) => data.month);

    const fullAvgTimeToClose =
      avgTimeToClose.length > 0
        ? months.map((month, index) => {
            if (!avgTimeToClose[index] && !existingMonths.includes(month)) {
              return {
                month: month,
                days: "0 days",
              };
            }

            if (!existingMonths.includes(month)) {
              return {
                month: month,
                days: "0 days",
              };
            }

            if (existingMonths.includes(month)) {
              const referenceIdx = existingMonths.indexOf(month);

              return {
                month: avgTimeToClose[referenceIdx].month,
                days: avgTimeToClose[referenceIdx].days,
              };
            }
          })
        : [];

    return res.status(200).json({
      message: "",
      days: fullAvgTimeToClose,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};
