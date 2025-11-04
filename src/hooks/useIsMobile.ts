'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the current device is mobile/touch-enabled
 * Uses multiple detection methods for better reliability
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Primary detection: Check for touch capability
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Secondary detection: Check user agent for mobile patterns
      const userAgent = navigator.userAgent.toLowerCase();
      const mobilePatterns = [
        /android/,
        /webos/,
        /iphone/,
        /ipad/,
        /ipod/,
        /blackberry/,
        /iemobile/,
        /opera mini/,
      ];
      const isMobileUserAgent = mobilePatterns.some((pattern) => pattern.test(userAgent));

      // Tertiary detection: Check screen size (tablets might have touch but larger screens)
      const isSmallScreen = window.innerWidth <= 768;

      // Consider it mobile if it has touch AND (is mobile user agent OR small screen)
      const isMobileDevice = hasTouchScreen && (isMobileUserAgent || isSmallScreen);

      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize events to handle orientation changes
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}
