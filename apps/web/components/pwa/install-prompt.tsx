'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <Card className="retro-card bg-card/90 backdrop-blur-sm fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom">
      <CardHeader>
        <CardTitle className="retro-text text-sm text-primary">📱 INSTALL APP</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Install Gamify to your device for quick access and offline support!
        </p>
        <div className="flex gap-2">
          <Button onClick={handleInstall} className="retro-button flex-1">
            INSTALL
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowInstallPrompt(false)}
            className="retro-button"
          >
            LATER
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

