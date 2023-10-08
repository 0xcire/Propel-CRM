export const removeTimeZone = (dateString: string): string => {
  return dateString.split('T')[0] as string;
};
