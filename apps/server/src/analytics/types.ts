export type AnalyticsData = Array<{
    month: string;
    value: string | number | undefined; // TODO: fix. number. or string.
}>

export type SalesVolume =  Array<{
    month: string;
    value: string | number | undefined; // TODO: fix. number. or string.
}>

export type SalesYears = Array<string>

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
