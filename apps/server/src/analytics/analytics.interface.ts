import type { AnalyticsData, SalesYears } from "./types";

export interface IAnalyticsService {
    getSalesVolumeForYear(userId: number, year: number): Promise<AnalyticsData>
    getExistingSalesYears(userId: number): Promise<SalesYears>;
    getAvgListingDaysOnMarket(userId: number, year: number): Promise<AnalyticsData>
    getListToSaleRatioForYear(userId: number, year: number): Promise<AnalyticsData>
    getAvgTimeToCloseLead(userId: number, year: number): Promise<AnalyticsData>
}