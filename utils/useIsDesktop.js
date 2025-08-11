'use client';

import { useEffect, useState } from 'react';

export const useIsDesktop = (breakpoint = 768) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    // Check on mount
    checkIsDesktop();

    // Listen for resize events
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, [breakpoint]);

  return isDesktop;
};
