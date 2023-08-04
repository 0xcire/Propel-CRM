type FilterFieldParams = {
  newData: Record<string, string>;
  originalData: Record<string, string>;
};

export const filterFields = ({
  newData,
  originalData,
}: FilterFieldParams): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => {
      return value !== originalData[key as keyof typeof originalData];
    })
  );
};
