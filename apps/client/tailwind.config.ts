import sharedConfig from '@propel/tailwind-config';
import {} from '@propel/redis';

// import { setRedisSession } from '@propel/redis';
// import defaultTheme from 'tailwindcss/defaultTheme';

import daisyui from 'daisyui';
import tailwindcssAnimate from 'tailwindcss-animate';

import type { Config } from 'tailwindcss';

const config: Pick<Config, 'content' | 'presets' | 'plugins'> & {
  daisyui: unknown;
} = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [sharedConfig],
  plugins: [daisyui, tailwindcssAnimate],
  daisyui: {
    themes: [],
    base: false,
    styled: true,
    utils: false,
    logs: false,
  },
};

export default config;
