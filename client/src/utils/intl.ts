import { parseISO } from 'date-fns';
import { removeTimeZone } from '.';

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const number = new Intl.NumberFormat();

export const dateIntl = (
  style: 'full' | 'long' | 'medium' | 'short' | undefined
): Intl.DateTimeFormat =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: style,
  });

export const formatDateString = (dateString: string): string => {
  return dateIntl('short').format(parseISO(removeTimeZone(dateString)));
};
