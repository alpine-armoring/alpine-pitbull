'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Timeline.module.scss';

gsap.registerPlugin(ScrollTrigger);

const Timeline = ({ data }) => {
  const timelineRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = sectionsRef.current;

    if (!sections.length) return;

    sections.forEach((section) => {
      const heading = section.querySelector('h3');
      const image = section.querySelector(`.${styles.timeline_section_image}`);

      if (!heading || !image) return;

      /* Set animation start state */
      gsap.set(heading, {
        opacity: 0,
        y: 50,
      });
      gsap.set(image, {
        opacity: 0,
        y: 50,
      });

      const sectionTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: `+=${window.innerHeight}`,
          toggleActions: 'play reverse play reverse',
        },
      });

      sectionTl
        .to(image, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        })
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          0.1
        );
    });

    // Reason: Cleanup function to kill ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div ref={timelineRef} className={`${styles.timeline} container_small`}>
      {data.map((item, index) => (
        <section
          key={index}
          className={styles.timeline_section}
          style={{ '--i': item.index }}
          ref={addToRefs}
        >
          <div className={styles.timeline_container}>
            <h3 className={styles.timeline_section_heading}>
              {item.year && <span>{item.year}</span>}
              {item.Caption && <span>{item.Caption}</span>}
            </h3>
            {item.image.data && (
              <div className={styles.timeline_section_image}>
                <img
                  src={
                    item.image.data[0].attributes.formats?.medium.url ||
                    item.image.data[0].attributes.url
                  }
                  width={
                    item.image.data[0].attributes.formats?.medium.width ||
                    item.image.data[0].attributes.width
                  }
                  height={
                    item.image.data[0].attributes.formats?.medium.height ||
                    item.image.data[0].attributes.height
                  }
                  alt={`${item.image.data[0].attributes.alternativeText} || ${item.Caption} (${item.year})`}
                />
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Timeline;
