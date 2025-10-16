'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '@/components/loader/Loader';

interface InventoryPageWrapperProps {
  children: React.ReactNode;
}

const InventoryPageWrapper = ({
  children,
}: InventoryPageWrapperProps): React.ReactElement => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset navigation state when route changes
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Handle click events on inventory item links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/inventory/"]');

      if (link && !link.getAttribute('href')?.endsWith('/inventory')) {
        setIsNavigating(true);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {isNavigating && <Loader />}
      {children}
    </>
  );
};

export default InventoryPageWrapper;
