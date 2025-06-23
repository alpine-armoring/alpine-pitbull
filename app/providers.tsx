'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { TransitionRouter } from 'next-transition-router';

export function Providers({ children }: { children: React.ReactNode }) {
  const firstLayer = useRef<HTMLDivElement | null>(null);
  const secondLayer = useRef<HTMLDivElement | null>(null);

  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        const tl = gsap
          .timeline({
            onComplete: next,
          })
          .fromTo(
            firstLayer.current,
            { y: '100%' },
            {
              y: 0,
              duration: 0.5,
              ease: 'circ.inOut',
            }
          )
          .fromTo(
            secondLayer.current,
            {
              y: '100%',
            },
            {
              y: 0,
              duration: 0.5,
              ease: 'circ.inOut',
            },
            '<50%'
          );

        return () => {
          tl.kill();
        };
      }}
      enter={(next) => {
        const tl = gsap
          .timeline()
          .fromTo(
            firstLayer.current,
            { y: 0 },
            {
              y: '-100%',
              duration: 0.5,
              ease: 'circ.inOut',
            }
          )
          .call(next, undefined, 0) // Call next immediately when enter starts
          .fromTo(
            secondLayer.current,
            { y: 0 },
            {
              y: '-100%',
              duration: 0.3,
              ease: 'circ.inOut',
            },
            '<50%'
          );

        return () => {
          tl.kill();
        };
      }}
    >
      <main>{children}</main>

      <div
        ref={firstLayer}
        className="first-layer fixed inset-0 z-50 translate-y-full bg-primary"
      />
      <div
        ref={secondLayer}
        className="second-layer fixed inset-0 z-50 translate-y-full bg-foreground"
      />
    </TransitionRouter>
  );
}
