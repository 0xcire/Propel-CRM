import { currency } from '@/utils/intl';

import type { TooltipProps } from 'recharts';
import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

export function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>): JSX.Element {
  if (active && payload && payload[0] && label && payload[0].value) {
    return (
      <div className='rounded-md border-2 border-slate-800 bg-gray-300 p-4'>
        <div>
          <p className='font-bold'>{label}</p>
          <p>Volume: {currency.format(+payload[0].value)}</p>
        </div>
      </div>
    );
  }
  return <></>;
}
