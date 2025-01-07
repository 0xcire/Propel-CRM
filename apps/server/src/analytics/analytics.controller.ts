import { PropelResponse } from "../lib/response";
import {
  getCurrentYear,
  handleError,
} from "../common/utils";
import type { Request, Response } from "express";
import type { IAnalyticsService } from "./analytics.interface";

export class AnalyticsController {
  private analyticsService: IAnalyticsService;

  constructor(analyticsService: IAnalyticsService) {
    this.analyticsService = analyticsService
  }

  public async handleGetSalesVolumeForYear(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const year = this.getValidYear(req.query)

      const salesVolume = await this.analyticsService.getSalesVolumeForYear(userId, year)

      return PropelResponse(200, {
        message: '', // TODO: fix on client
        volumes: salesVolume
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  public async handleGetExistingSalesYears(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const years = await this.analyticsService.getExistingSalesYears(userId)

      return PropelResponse(200, {
        message: '', // TODO: fix
        years: years
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  public async handleGetAvgListingDaysOnMarket(req: Request, res: Response) {
    try {
      const userID = req.user.id;
      const year = this.getValidYear(req.query)

      const averageDaysOnMarket = await this.analyticsService.getAvgListingDaysOnMarket(userID, year)

      return PropelResponse(200, {
        message: '',
        averages: averageDaysOnMarket
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  public async handleGetListToSaleRatioForYear(req: Request, res: Response) {
    try {
      const userID = req.user.id;
      const year = this.getValidYear(req.query)

      const listToSaleRatio = await this.analyticsService.getListToSaleRatioForYear(userID, year)

      return PropelResponse(200, {
        message: '',
        ratios: listToSaleRatio // TODO: ratio. and fix everywhere else
      })
    } catch (error) {
      return handleError(error, res);
    }
  }

  public async handleGetAvgTimeToCloseLead(req: Request, res: Response) {
    try {
      const userID = req.user.id;
      const year = this.getValidYear(req.query)

      const averageTimeToClose = await this.analyticsService.getAvgTimeToCloseLead(userID, year)

      return PropelResponse(200, {
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
