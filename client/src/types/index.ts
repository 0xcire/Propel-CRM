import type { ToasterToast } from '@/components/ui/use-toast';

export type Toast = {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
};
