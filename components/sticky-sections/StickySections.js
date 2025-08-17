'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import Image from 'next/image';
import CustomMarkdown from 'components/CustomMarkdown';
import styles from './StickySections.module.scss';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const StickySections = ({ data, media, text }) => {
  const lenis = useLenis();
  const contentRefs = useRef([]);

  useEffect(() => {
    // Handle scroll-triggered animations
    const scroll = () => {
      contentRefs.current.forEach((el) => {
        if (el) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: el,
                start: 'center center',
                end: 'max',
                scrub: true,
              },
            })
            .to(
              el,
              {
                ease: 'none',
                startAt: { filter: 'blur(0px)' },
                filter: 'blur(3px)',
                scrollTrigger: {
                  trigger: el,
                  start: 'center center',
                  end: '+=100%',
                  scrub: true,
                },
              },
              0
            )
            .to(
              el,
              {
                ease: 'none',
                scale: 0.7,
                yPercent: -20,
              },
              0
            );
        }
      });
    };

    // Only proceed if lenis is available
    if (!lenis) {
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      scroll();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [lenis]);

  // Helper function to add refs to content elements
  const addToRefs = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  // Return null if no data
  if (!data || !Array.isArray(data)) {
    return null;
  }

  return (
    <div className={styles.stickySections_wrap}>
      {(text || media.data) && (
        <div
          className={`
            ${styles.stickySections_wrap_left} 
            ${
              text && !media?.data
                ? `${styles.stickySections_wrap_left_justText}`
                : ''
            }
            ${
              !text && media?.data
                ? `${styles.stickySections_wrap_left_justMedia}`
                : ''
            }
          `}
        >
          {text && (
            <div className={`static ${styles.stickySections_wrap_text}`}>
              <CustomMarkdown>{text}</CustomMarkdown>
            </div>
          )}

          {media?.data && (
            <div className={styles.stickySections_wrap_image}>
              {media.data?.attributes?.mime?.startsWith('video/') ? (
                <video
                  src={
                    media.data?.attributes?.formats?.large?.url ||
                    media.data?.attributes?.url
                  }
                  width={
                    media.data?.attributes?.formats?.large?.width ||
                    media.data?.attributes?.width
                  }
                  height={
                    media.data?.attributes?.formats?.large?.height ||
                    media.data?.attributes?.height
                  }
                  muted
                  autoPlay
                  playsInline
                  loop
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={
                    media.data?.attributes?.formats?.large?.url ||
                    media.data?.attributes?.url
                  }
                  alt={media.data?.attributes?.alternativeText || ''}
                  width={
                    media.data?.attributes?.formats?.large?.width ||
                    media.data?.attributes?.width
                  }
                  height={
                    media.data?.attributes?.formats?.large?.height ||
                    media.data?.attributes?.height
                  }
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.stickySections_list}>
        {data.map((item, index) => (
          <div
            key={index}
            className={styles.stickySections_card}
            ref={addToRefs}
          >
            {/* {item.image?.data && (
                            <Image
                                src={
                                    item.image.data?.attributes.formats?.medium?.url ||
                                    item.image.data?.attributes.url
                                }
                                alt={item.image.data?.attributes.alternativeText || item.title || ''}
                                width={
                                    item.image.data?.attributes.formats?.medium?.width ||
                                    item.image.data?.attributes.width ||
                                    400
                                }
                                height={
                                    item.image.data?.attributes.formats?.medium?.height ||
                                    item.image.data?.attributes.height ||
                                    300
                                }
                                quality={100}
                                className="stickySections_card_image"
                            />
                        )} */}

            {item.year && (
              <h3 className={styles.stickySections_card_title}>{item.year}</h3>
            )}

            {item.Caption && (
              <p className={styles.stickySections_card_text}>{item.Caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickySections;
