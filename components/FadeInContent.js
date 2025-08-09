'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedElement({
  children,
  className = '',
  delay = 0,
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        filter: 'blur(20px)',
        y: 20,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.5,
        delay: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          // Optional: add markers for debugging
          // markers: true
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [delay]);

  return (
    <div ref={elementRef} className={`fadeInText ${className}`}>
      {children}
    </div>
  );
}
