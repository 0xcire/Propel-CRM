import type { Dispatch, SetStateAction } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { ToasterToast } from '@/components/ui/use-toast';

export type Toast = {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  lastLogin?: Date | null;
  isAdmin?: boolean;
  isVerified?: boolean;
};

export interface BaseResponse {
  message?: string;
  status?: number;
}

export interface UserResponse extends BaseResponse {
  user?: User;
}

export interface FormMode {
  isCreate?: boolean;
  isLoading: boolean;
}

export type DefaultParams = Array<{ name: string; value: string }>;

export type TableProps<TData> = {
  columns: Array<ColumnDef<TData>>;
  data: Array<TData>;
  isLoading: boolean;
  isFetching: boolean;
  setQuery: Dispatch<SetStateAction<string | undefined>>;
};
