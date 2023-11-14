import { MoonStarIcon, SunIcon } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { useThemeContext } from '@/context/ThemeContext';

export function ThemeToggle(): JSX.Element {
  const [theme, saveTheme] = useThemeContext();

  return (
    <DropdownMenuItem
      className='cursor-pointer'
      onClick={(): void => {
        const themeValue = theme === 'light' ? 'dark' : 'light';
        saveTheme(themeValue);
      }}
    >
      {theme === 'light' ? (
        <>
          <SunIcon
            size={18}
            className='mr-1 mt-[2px]'
          />
          Light
        </>
      ) : (
        <>
          <MoonStarIcon
            size={18}
            className='mr-1 mt-[2px]'
          />
          Dark
        </>
      )}
    </DropdownMenuItem>
  );
}
