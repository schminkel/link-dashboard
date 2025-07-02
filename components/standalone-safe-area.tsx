"use client"

import { useStandaloneMode } from "@/hooks/use-standalone"

export function StandaloneSafeArea() {
  const isStandalone = useStandaloneMode();
  
  if (!isStandalone) return null;
  
  return (
    <>
      {/* Top safe area with blur effect */}
      <div className="safe-area-blur" />
      
      {/* Bottom safe area blur (if needed) */}
      <div 
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{ 
          height: 'env(safe-area-inset-bottom, 0)',
          zIndex: 50,
          background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 70%, rgba(15, 23, 42, 0.85) 100%)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)'
        }}
      />
    </>
  );
}
