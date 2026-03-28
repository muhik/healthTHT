'use client';

import { useEffect } from 'react';
import { PIXEL_ID } from '@/lib/data';

interface PixelTrackerProps {
    event?: string;
    data?: any;
}

export default function PixelTracker({ event, data }: PixelTrackerProps) {
    useEffect(() => {
        // Initialize standard Facebook Pixel
        if (typeof window !== 'undefined') {
            const storedPixelId = localStorage.getItem('pixel_id') || PIXEL_ID;

            const script = document.createElement('script');
            script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${storedPixelId}');
          fbq('track', 'PageView');
        `;
            document.head.appendChild(script);
        }
    }, []);

    useEffect(() => {
        if (event && typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', event, data);
        }
    }, [event, data]);

    return null;
}
