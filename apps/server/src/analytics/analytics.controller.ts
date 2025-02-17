import { AnalyticsService } from "./analytics.service";
import { PropelResponse } from "../lib/response";

import {
  getCurrentYear,
  handleError,
} from "../common/utils";
import type { Request, Response } from "express";


export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor(analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService
  }

  handleGetSalesVolumeForYear = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const year = this.getValidYear(req.query)

      const salesVolume = await this.analyticsService.getSalesVolumeForYear(userId, year)

      return PropelResponse(res, 200, {
        message: '', // TODO: fix on client
        volumes: salesVolume
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  handleGetExistingSalesYears = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;

      const years = await this.analyticsService.getExistingSalesYears(userId)

      return PropelResponse(res, 200, {
        message: '', // TODO: fix
        years: years
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  handleGetAvgListingDaysOnMarket = async (req: Request, res: Response) => {
    try {
      const userID = req.user.id;
      const year = this.getValidYear(req.query)

      const averageDaysOnMarket = await this.analyticsService.getAvgListingDaysOnMarket(userID, year)

      return PropelResponse(res, 200, {
        message: '',
        averages: averageDaysOnMarket
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  handleGetListToSaleRatioForYear = async (req: Request, res: Response) => {
    try {
      const userID = req.user.id;
      const year = this.getValidYear(req.query)

      const listToSaleRatio = await this.analyticsService.getListToSaleRatioForYear(userID, year)

      return PropelResponse(res, 200, {
        message: '',
        ratios: listToSaleRatio // TODO: ratio. and fix everywhere else
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  handleGetAvgTimeToCloseLead = async (req: Request, res: Response) => {
    try {
      const userID = req.user.id;
      const year = this.getValidYear(req.query)

      const averageTimeToClose = await this.analyticsService.getAvgTimeToCloseLead(userID, year)

      return PropelResponse(res, 200, {
        message: '',
        days: averageTimeToClose
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  private getValidYear<T extends Record<string, unknown>>(query: T): number {
    if (!query || !query.year) return getCurrentYear();
    if (typeof query.year !== 'string') return getCurrentYear();

    return +query.year;
  }
}
