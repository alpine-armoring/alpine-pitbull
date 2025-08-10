'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxElement({
  children,
  className = '',
  speed = 0.3,
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    // Create parallax animation
    gsap.to(element, {
      y: () => -element.offsetHeight * speed, // Move up based on element height and speed
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom', // Start when element enters viewport
        end: 'bottom top', // End when element leaves viewport
        scrub: true, // Smooth animation tied to scroll position
        invalidateOnRefresh: true, // Recalculate on window resize
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
