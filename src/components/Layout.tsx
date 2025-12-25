import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

export function Layout() {
  const { mainLoading, setMainLoading, loadMetaConfig } = useAppStore();

  useEffect(() => {
    loadMetaConfig().finally(() => setMainLoading(false));
  }, [loadMetaConfig, setMainLoading]);

  if (mainLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
