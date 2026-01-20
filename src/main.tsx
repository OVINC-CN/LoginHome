import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '@/contexts/I18nContext';
import App from '@/App';
import '@/styles/global.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <I18nProvider>
                <App />
            </I18nProvider>
        </BrowserRouter>
    </StrictMode>,
);
