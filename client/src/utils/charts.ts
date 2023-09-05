export const findLargestMultiple = (value: number): number => {
  let targetMultiple = 1;
  while (targetMultiple * 10 <= value) {
    targetMultiple *= 10;
  }

  return targetMultiple;
};

export const yAxisRange = (minmax: Array<number>): Array<number> => {
  return minmax?.map((num, index) => {
    return index === 0
      ? Math.floor((num * 0.55) / findLargestMultiple(num)) *
          findLargestMultiple(num)
      : Math.floor((num * 1.15) / findLargestMultiple(num)) *
          findLargestMultiple(num);
  });
};
