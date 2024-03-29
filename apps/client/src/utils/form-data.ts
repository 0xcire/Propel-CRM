import { isValid } from 'date-fns/esm';
import { removeTimeZone } from './index';

import type { FieldValues, UseFormReturn } from 'react-hook-form';

type FilterFieldParams = {
  newData: Record<string, unknown>;
  originalData: Record<string, unknown>;
};

export const filterEqualFields = ({
  newData,
  originalData,
}: FilterFieldParams): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => {
      return value !== originalData[key as keyof typeof originalData];
    })
  );
};

export const filterUndefined = (data: Record<string, unknown>): void => {
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined || data[key] === '') {
      delete data[key];
    }
  });
};

export const fieldsAreDirty = <T extends FieldValues>(
  form: UseFormReturn<T>,
  fields: Array<keyof T> | keyof T
): boolean => {
  const dirtyFields = Object.keys(form.formState.dirtyFields);

  if (fields instanceof Array) {
    return dirtyFields.some((field) => fields.includes(field));
  }
  return dirtyFields.includes(fields as string);
};

export const generateDefaultValues = (
  initialData: Record<string, unknown>
): Record<string, unknown> => {
  const initialEntries: Array<[string, unknown]> = Object.entries(
    initialData
  ).map(([key, value]) => {
    if (!value) {
      value = '';
      return [key, value];
    }
    if (typeof value === 'number') {
      value = value.toString();
      return [key, value];
    }

    if (typeof value === 'string' && isValid(new Date(value))) {
      value = new Date(removeTimeZone(value));
      return [key, value];
    }

    return [key, value];
  });

  return Object.fromEntries(initialEntries);
};

export const fieldsAreEqual = (
  field: unknown,
  confirmField: unknown
): boolean => {
  return field === confirmField;
};
