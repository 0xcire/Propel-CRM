import { test, expect, describe } from "@jest/globals";
import { formatAnalyticsData } from "../../src/utils/analytics";

const noAnalyticsData = [];
const partialAnalyticsData = [
  { month: "Feb", volume: "1" },
  { month: "Apr", volume: "2" },
  { month: "Dec", volume: "3" },
];
const fullAnalyticsData = [
  { month: "Jan", volume: "1" },
  { month: "Feb", volume: "2" },
  { month: "Mar", volume: "3" },

  { month: "Apr", volume: "4" },
  { month: "May", volume: "5" },
  { month: "Jun", volume: "6" },

  { month: "Jul", volume: "7" },
  { month: "Aug", volume: "8" },
  { month: "Sep", volume: "9" },

  { month: "Oct", volume: "10" },
  { month: "Nov", volume: "11" },
  { month: "Dec", volume: "12" },
];

describe("formatAnalyticsData() formats given data properly", () => {
  test("handle empty data", async () => {
    const data = formatAnalyticsData(noAnalyticsData);
    expect(data).toEqual([]);
  });

  test("handle scattered data", async () => {
    const data = formatAnalyticsData(partialAnalyticsData);
    expect(data).toEqual([
      { month: "Jan", value: "0" },
      { month: "Feb", value: "1" },
      { month: "Mar", value: "0" },

      { month: "Apr", value: "2" },
      { month: "May", value: "0" },
      { month: "Jun", value: "0" },

      { month: "Jul", value: "0" },
      { month: "Aug", value: "0" },
      { month: "Sep", value: "0" },

      { month: "Oct", value: "0" },
      { month: "Nov", value: "0" },
      { month: "Dec", value: "3" },
    ]);
  });

  test("handle full data", async () => {
    const data = formatAnalyticsData(fullAnalyticsData);
    expect(data).toEqual([
      { month: "Jan", value: "1" },
      { month: "Feb", value: "2" },
      { month: "Mar", value: "3" },

      { month: "Apr", value: "4" },
      { month: "May", value: "5" },
      { month: "Jun", value: "6" },

      { month: "Jul", value: "7" },
      { month: "Aug", value: "8" },
      { month: "Sep", value: "9" },

      { month: "Oct", value: "10" },
      { month: "Nov", value: "11" },
      { month: "Dec", value: "12" },
    ]);
  });
});
