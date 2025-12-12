import { useEffect } from 'react';

// Dynamic browser tab title with live data
export function useDynamicTitle(data = {}) {
  useEffect(() => {
    const { ticker, edgeScore, price, prefix = 'The House' } = data;

    let title = prefix;

    if (ticker && edgeScore !== undefined) {
      title = `${ticker} Edge: ${edgeScore} | ${prefix}`;
    } else if (ticker && price !== undefined) {
      title = `${ticker} $${price} | ${prefix}`;
    } else if (ticker) {
      title = `${ticker} | ${prefix}`;
    }

    document.title = title;

    // Update on visibility change (shows latest data when tab becomes visible)
    const handleVisibility = () => {
      if (!document.hidden && ticker) {
        document.title = title;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.title = 'The House';
    };
  }, [data]);
}

// Favicon with dynamic badge
export function useDynamicFavicon(hasNotification = false) {
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    
    // SVG favicon with optional notification dot
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="6" fill="#0a0a0a"/>
        <text x="16" y="22" text-anchor="middle" font-size="18" fill="#dc2626">♠</text>
        ${hasNotification ? '<circle cx="26" cy="6" r="5" fill="#22c55e"/>' : ''}
      </svg>
    `;
    
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    document.head.appendChild(link);
  }, [hasNotification]);
}

export default useDynamicTitle;