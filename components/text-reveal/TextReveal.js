'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Remove ScrollTrigger import since we're using Intersection Observer
// gsap.registerPlugin(SplitText, ScrollTrigger);
gsap.registerPlugin(SplitText);

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
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

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

  // Intersection Observer setup - replaces ScrollTrigger
  useEffect(() => {
    if (!animateOnScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -20% 0px', // Similar to ScrollTrigger's "top 80%"
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [animateOnScroll, hasAnimated]);

  useGSAP(
    () => {
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

      // Handle immediate animation (when animateOnScroll is false)
      if (!animateOnScroll) {
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
      dependencies: [animateOnScroll, delay, word, line, transitionDuration],
    }
  );

  // Trigger animation when element comes into view (replaces ScrollTrigger onEnter)
  useEffect(() => {
    if (isInView && !hasAnimated && tl.current) {
      const allTargets = [];
      splitRefs.current.forEach((split) => {
        const elementsToAnimate = word ? split.words : split.lines;
        allTargets.push(...elementsToAnimate);
      });

      if (allTargets.length > 0) {
        tl.current.to(allTargets, {
          ...animationConfig,
          onComplete: () => {
            setHasAnimated(true);
          },
        });
      }
    }
  }, [isInView, hasAnimated, animationConfig, word]);

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
