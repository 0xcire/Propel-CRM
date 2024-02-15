export const formatAnalyticsData = <T extends { month: string; [key: string]: string | number }>(data: Array<T>) => {
  if (data.length === 0) {
    return [];
  }

  // if data has length, data[0] can't be T | undefined?
  const key = Object.keys(data[0] as T).find((key) => key !== "month") ?? "";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
};
