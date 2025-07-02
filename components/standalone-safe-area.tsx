"use client"

import { useStandaloneMode } from "@/hooks/use-standalone"

export function StandaloneSafeArea() {
  const isStandalone = useStandaloneMode();
  
  if (!isStandalone) return null;
  
  return (
    <>
      {/* Top safe area with blur effect - increased z-index to ensure it's above all content */}
      <div 
        className="fixed top-0 left-0 right-0 w-full pointer-events-none"
        style={{
          height: 'env(safe-area-inset-top, 0)',
          zIndex: 100, // Increased z-index to be above all other content
          background: 'rgba(15, 23, 42, 0.95)', // Dark background that matches header
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      />
      
      {/* Bottom safe area blur (if needed) */}
      <div 
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{ 
          height: 'env(safe-area-inset-bottom, 0)',
          zIndex: 100, // Increased z-index to match top
          background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 70%, rgba(15, 23, 42, 0.85) 100%)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)'
        }}
      />
    </>
  );
}
