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
};

export interface BaseResponse {
  message?: string;
  status?: number;
}

export interface UserResponse extends BaseResponse {
  user?: User;
}

// TODO: export interface ComponentWithChildren
