'use client';

import React, { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useNavigationState } from '@/utils/navigationState';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function TextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  word = false,
  line = false,
  transitionDuration = 600,
}) {
  const containerRef = useRef(null);
  const splitRefs = useRef([]);
  const tl = useRef(null);

  // Use the global navigation-based ready state
  const { isReady } = useNavigationState(transitionDuration);

  // Memoize animation config to prevent unnecessary re-renders
  const animationConfig = useMemo(
    () => ({
      y: '0%',
      duration: 0.8, // Reduced from 1s for better performance
      stagger: 0.05, // Reduced stagger for smoother effect
      ease: 'power3.out', // Changed to power3 for better performance
      delay: delay,
    }),
    [delay]
  );

  useGSAP(
    () => {
      // Only run animation when transition is ready
      if (!isReady || !containerRef.current) return;

      let elements = [];
      if (containerRef.current.hasAttribute('data-copy-wrapper')) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      splitRefs.current = [];
      const allTargets = [];

      elements.forEach((element) => {
        // Determine split type based on props
        const splitType = word ? 'words' : 'lines';

        const splitConfig = {
          type: splitType,
        };

        if (!word) {
          splitConfig.mask = 'lines';
          splitConfig.linesClass = 'line++';
          splitConfig.lineThreshold = 0.1;
        } else {
          splitConfig.wordsClass = 'word++';
        }

        const split = SplitText.create(element, splitConfig);
        splitRefs.current.push(split);

        // Handle text-indent for lines
        if (!word) {
          const computedStyle = window.getComputedStyle(element);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== '0px') {
            if (split.lines.length > 0) {
              split.lines[0].style.paddingLeft = textIndent;
            }
            element.style.textIndent = '0';
          }
        }

        const elementsToAnimate = word ? split.words : split.lines;
        allTargets.push(...elementsToAnimate);
      });

      // Set initial positions with better transform properties
      gsap.set(allTargets, {
        y: '100%',
        force3D: true,
        transformOrigin: 'center bottom',
        willChange: 'transform', // Add will-change for better performance
      });

      // Make the container visible
      elements.forEach((element) => {
        element.setAttribute('data-gsap-ready', 'true');
      });

      // Create timeline for better performance
      tl.current = gsap.timeline();

      if (animateOnScroll) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 80%', // Slightly adjusted for better timing
          once: true,
          onEnter: () => {
            tl.current.to(allTargets, animationConfig);
          },
        });
      } else {
        tl.current.to(allTargets, animationConfig);
      }

      // Cleanup function
      return () => {
        if (tl.current) {
          tl.current.kill();
        }
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [
        isReady,
        animateOnScroll,
        delay,
        word,
        line,
        transitionDuration,
      ],
    }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
