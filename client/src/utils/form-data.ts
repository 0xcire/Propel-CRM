import type { FieldValues, UseFormReturn } from 'react-hook-form';

type FilterFieldParams = {
  newData: Record<string, string>;
  originalData: Record<string, unknown>;
};

export const filterEqualFields = ({
  newData,
  originalData,
}: FilterFieldParams): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => {
      return value !== originalData[key as keyof typeof originalData];
    })
  );
};

export const filterUndefined = (data: Record<string, unknown>): void => {
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
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
