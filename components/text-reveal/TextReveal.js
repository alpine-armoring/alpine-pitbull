'use client';

import React, { useRef } from 'react';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function TextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  word = false,
  line = false,
}) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);
  const lines = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      let elements = [];
      if (containerRef.current.hasAttribute('data-copy-wrapper')) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      splitRefs.current = [];
      lines.current = [];
      elementRefs.current = [];

      elements.forEach((element) => {
        elementRefs.current.push(element);

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
        lines.current.push(...elementsToAnimate);
      });

      // Set initial positions BEFORE making visible
      gsap.set(lines.current, { y: '100%' });

      // Now make the container visible by adding the data attribute
      elements.forEach((element) => {
        element.setAttribute('data-gsap-ready', 'true');
      });

      const animationProps = {
        y: '0%',
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, animationProps);
      }

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay, word, line] }
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
