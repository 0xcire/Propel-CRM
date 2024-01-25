export const formatAnalyticsData = <T extends { month: unknown }>(
  data: Array<T>,
  getValue: (data: unknown) => unknown,
  defaultValue: string
) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const existingMonths = data.map((data) => (data as { month: unknown } & unknown).month);
  return data.length > 0
    ? months.map((month, index) => {
        if (!data[index] && !existingMonths.includes(month)) {
          return {
            month: month,
            value: defaultValue,
          };
        }

        if (!existingMonths.includes(month)) {
          return {
            month: month,
            value: defaultValue,
          };
        }

        const referenceIdx = existingMonths.indexOf(month);

        return {
          month: data && data[referenceIdx]?.month,
          value: getValue(data[referenceIdx]),
        };
      })
    : [];
};
