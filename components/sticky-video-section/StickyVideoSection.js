'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StickyVideoSection.module.scss';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const StickyVideoSection = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  const sections = [
    {
      id: 1,
      video:
        'https://assets.alpineco.com/vxt_main_video_5_29_25_b9d85e3667.mp4',
      title: 'ONE WITH THE WIND',
      text: 'The MISTRAL is a one-of-a-kind wind that heralds the new seasons in southern France, stirring awe in all who experience it. The W16 MISTRAL embodies this and the spirit of BUGATTI, offering freedom, elegance, and speed with the incredible power of the iconic W16 engine.',
    },
    {
      id: 2,
      video: 'https://assets.alpineco.com/7018_web_vid_db1c365a40.mp4',
      title: 'SKY IS THE LIMIT',
      text: "The most intense roofless experience courtesy of the W16 power. With only 99 units produced, never to be replicated, one thing is clear: you're witnessing automotive history being made.",
    },
    {
      id: 3,
      video:
        'https://assets.alpineco.com/Alpine_Armoring_homepage_video_6_16_25_7c8ebcf56e.webm',
      title: 'NEXT ICON. LAST OF ITS KIND.',
      text: 'The last road-going model to be produced with the supreme power of the 1600 PS W16 Quad-Turbo, the W16 MISTRAL delivers dizzying high speeds in a body built for winding across scenic vistas.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const sectionElements = sectionsRef.current.filter(Boolean);

      if (!container || sectionElements.length === 0) return;

      // Set initial positions - all sections start at y: 0, but we'll control visibility with transforms
      sectionElements.forEach((section, index) => {
        if (index === 0) {
          // First section is visible
          gsap.set(section, { yPercent: 0, zIndex: sections.length - index });
        } else {
          // Other sections start below viewport
          gsap.set(section, { yPercent: 100, zIndex: sections.length - index });
        }
      });

      // Create the main ScrollTrigger that pins the container
      // const mainTimeline = gsap.timeline({
      //   scrollTrigger: {
      //     trigger: container,
      //     start: 'top top',
      //     end: `+=${sections.length * 100}%`, // Each section gets 100% of viewport height worth of scroll
      //     pin: true,
      //     scrub: 1, // Smooth scrubbing with slight lag
      //     anticipatePin: 1,
      //     onUpdate: (self) => {
      //       const progress = self.progress;
      //       const totalSections = sections.length;
      //       const sectionIndex = Math.floor(progress * totalSections);
      //       const sectionProgress = (progress * totalSections) % 1;

      //       // Update sections based on overall progress
      //       sectionElements.forEach((section, index) => {
      //         const textBox = section.querySelector(`.${styles.textBox}`);

      //         if (index < sectionIndex) {
      //           // Previous sections - fully moved up and out
      //           gsap.set(section, { yPercent: -100 });
      //           if (textBox) gsap.set(textBox, { yPercent: -100 });
      //         } else if (index === sectionIndex) {
      //           // Current section
      //           gsap.set(section, { yPercent: 0 });
      //           if (textBox) {
      //             // Text box moves up as we progress through this section
      //             gsap.set(textBox, { yPercent: -sectionProgress * 100 });
      //           }
      //         } else if (index === sectionIndex + 1) {
      //           // Next section - starts coming up when text box reaches top
      //           const nextSectionProgress = Math.max(0, sectionProgress);
      //           gsap.set(section, { yPercent: 100 - (nextSectionProgress * 100) });
      //           if (textBox) gsap.set(textBox, { yPercent: 0 });
      //         } else {
      //           // Future sections - stay below
      //           gsap.set(section, { yPercent: 100 });
      //           if (textBox) gsap.set(textBox, { yPercent: 0 });
      //         }
      //       });
      //     }
      //   }
      // });

      // Alternative approach using batch ScrollTriggers
      // Uncomment this section and comment out the above if you prefer individual triggers
      /*
      sectionElements.forEach((section, index) => {
        const textBox = section.querySelector(`.${styles.textBox}`);
        const nextSection = sectionElements[index + 1];
        
        if (index < sections.length - 1 && nextSection && textBox) {
          // Create individual ScrollTrigger for each section transition
          ScrollTrigger.create({
            trigger: container,
            start: `top+=${index * window.innerHeight} top`,
            end: `top+=${(index + 1) * window.innerHeight} top`,
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              
              // Move text box up
              gsap.set(textBox, { yPercent: -progress * 100 });
              
              // Move next section up
              gsap.set(nextSection, { yPercent: 100 - (progress * 100) });
            }
          });
        }
      });
      */
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {sections.map((section, index) => (
        <div
          key={section.id}
          ref={(el) => (sectionsRef.current[index] = el)}
          className={styles.section}
        >
          <video className={styles.video} autoPlay muted loop playsInline>
            <source src={section.video} type="video/mp4" />
            <source src={section.video} type="video/webm" />
          </video>

          <div className={styles.textBox}>
            <h3 className={styles.title}>{section.title}</h3>
            <p className={styles.text}>{section.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StickyVideoSection;
