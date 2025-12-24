declare global {
  interface Window {
    ENV?: {
      VITE_BACKEND_URL?: string;
      VITE_SITE_URL?: string;
    };
  }
}

const globalContext = {
  siteUrl: window.ENV?.VITE_SITE_URL || import.meta.env.VITE_SITE_URL || '',
  backendUrl: window.ENV?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL || '',
};

export default globalContext;
