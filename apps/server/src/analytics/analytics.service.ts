import { getAvgDaysOnMarketQuery, getAvgTimeToCloseQuery, getExistingYearsQuery, getListToSaleRatioByYearQuery, getSalesVolumeByYearQuery } from "@propel/drizzle";
import type { AnalyticsData, SalesYears } from "./types";
import type { IAnalyticsService } from "./analytics.interface";
import { months } from "./types"

export class AnalyticsService implements IAnalyticsService {
    async getSalesVolumeForYear(userId: number, year: number): Promise<AnalyticsData> {
        const salesVolume = await getSalesVolumeByYearQuery(userId, year);
        // TODO: add logger

        return this.formatAnalyticsData(salesVolume);
    }

    async getExistingSalesYears(userId: number): Promise<SalesYears> {
        const existingYears = await getExistingYearsQuery(userId)
        
        return existingYears.map((data) => data.year);
    }

    async getAvgListingDaysOnMarket(userId: number, year: number): Promise<AnalyticsData> {
        const avgDaysOnMarket = await getAvgDaysOnMarketQuery(userId, year)
        // TODO: add logger

        return this.formatAnalyticsData(avgDaysOnMarket)
    }

    async getListToSaleRatioForYear(userId: number, year: number): Promise<AnalyticsData> {
        const listToSaleRatio = await getListToSaleRatioByYearQuery(userId, year);
        
        return this.formatAnalyticsData(listToSaleRatio);
    }

    async getAvgTimeToCloseLead(userId: number, year: number): Promise<AnalyticsData> {
        const averageTimeToClose = await getAvgTimeToCloseQuery(userId, year)

        return this.formatAnalyticsData(averageTimeToClose)
    }

    public formatAnalyticsData <
      T extends { month: string; [key: string]: string | number }
    >(
      data: Array<T>
    ) {
      if (data.length === 0) {
        return [];
      }
    
      // if data has length, data[0] can't be T | undefined?
      const key = Object.keys(data[0] as T).find((key) => key !== "month") ?? "";
    
      const formatData = months.map((month) => {
        const dataPointByMonth = data.find((item) => item.month === month);
    
        if (!dataPointByMonth) {
          return {
            month: month,
            value: "0",
          };
        }
        return {
          month: month,
          value: dataPointByMonth[key],
        };
      });
    
      return formatData;
    }
}
