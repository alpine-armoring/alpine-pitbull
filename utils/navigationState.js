// utils/navigationState.js
'use client';

// Global flag to track page transitions
let isPageTransitioning = false;

// Export function to set transition state
export const setPageTransitioning = () => {
  isPageTransitioning = true;
  console.log('🚀 Navigation transition started');
};

// Export function to get transition state
export const getPageTransitioning = () => {
  return isPageTransitioning;
};

// Export function to reset transition state
export const resetPageTransitioning = () => {
  isPageTransitioning = false;
  console.log('✅ Navigation transition reset');
};

// Hook to detect if we arrived via page navigation vs direct visit/refresh
export const useNavigationState = (transitionDuration = 600) => {
  const [isReady, setIsReady] = useState(false);
  const [wasNavigating, setWasNavigating] = useState(false);

  useEffect(() => {
    // Capture the initial state immediately on mount
    const initialNavigatingState = getPageTransitioning();

    console.log('🔍 Checking navigation state on mount:', {
      isPageTransitioning: initialNavigatingState,
      component: 'useNavigationState',
    });

    if (initialNavigatingState) {
      setWasNavigating(true);
      console.log(
        `⏱️ Was navigating - waiting ${transitionDuration}ms before ready`
      );

      const timer = setTimeout(() => {
        setIsReady(true);
        resetPageTransitioning();
        console.log('✨ Navigation transition complete - component ready');
      }, transitionDuration);

      return () => clearTimeout(timer);
    } else {
      setWasNavigating(false);
      setIsReady(true);
      console.log('🎯 Direct visit - component ready immediately');
    }
  }, [transitionDuration]);

  return { isReady, wasNavigating };
};

// Add React import for the hook
import { useState, useEffect } from 'react';
