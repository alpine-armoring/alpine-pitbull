'use client';
import { useTransitionRouter } from 'next-view-transitions';
import Link from 'next/link';
import { setPageTransitioning } from '@/components/text-reveal/TextReveal';

// Global slide transition function
function slideInOut() {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translateY(0)',
      },
      {
        opacity: 0.2,
        transform: 'translateY(-35%)',
      },
    ],
    {
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    }
  );

  document.documentElement.animate(
    [
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      },
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      },
    ],
    {
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    }
  );
}

const TransitionLink = ({
  href,
  children,
  className,
  onClick = null,
  disabled = false,
  external = false,
  ...props
}) => {
  const router = useTransitionRouter();

  // Check if it's an external link
  const isExternal =
    external ||
    href?.startsWith('http') ||
    href?.startsWith('mailto:') ||
    href?.startsWith('tel:');

  const handleClick = (e) => {
    // Call any existing onClick first
    if (onClick) {
      onClick(e);
    }

    // Skip transition for external links or if disabled
    if (isExternal || disabled || e.defaultPrevented) {
      return;
    }

    e.preventDefault();
    setPageTransitioning();
    router.push(href, {
      onTransitionReady: slideInOut,
    });
  };

  // For external links, use regular Link without transition
  if (isExternal) {
    return (
      <Link href={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
