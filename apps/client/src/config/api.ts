// just another example of bad config.
export const API_URL = import.meta.env.DEV // lol
  ? import.meta.env.VITE_DEV_PROXY_URL
  : !import.meta.env.DEV && window.location.host.includes('localhost')
    ? import.meta.env.VITE_PREVIEW_PROXY_URL
    : import.meta.env.VITE_PROD_PROXY_URL;
