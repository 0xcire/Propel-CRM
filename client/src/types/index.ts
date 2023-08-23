import type { ToasterToast } from '@/components/ui/use-toast';
// import type { Control, FieldValues, Path } from 'react-hook-form';

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

// export interface RHFCustomInput<TFieldValues extends FieldValues> {
//   control: Control<TFieldValues>;
//   name: Path<TFieldValues>;
// }

// TODO: export interface ComponentWithChildren
