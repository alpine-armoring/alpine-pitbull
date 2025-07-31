'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import styles from './StackingCards.module.scss';

interface ExtendedHTMLElement extends HTMLElement {
  contentRevealed?: boolean;
}

// Hook to detect if device is desktop
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Check on mount
    checkIsDesktop();

    // Listen for resize events
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
};

const StackingCards = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isDesktop = useIsDesktop();

  // Helper function to determine media type from mime
  const getMediaType = (mime: string): 'image' | 'video' => {
    return mime.startsWith('video/') ? 'video' : 'image';
  };

  // Helper function to get media URL from Strapi data
  const getMediaUrl = (card): string => {
    return card.image?.data?.[0]?.attributes?.url || '';
  };

  // Helper function to get media mime type
  const getMediaMime = (card): string => {
    return card.image?.data?.[0]?.attributes?.mime || '';
  };

  useEffect(() => {
    // Only run GSAP animations on desktop
    if (!isDesktop) {
      return;
    }

    // Register GSAP plugins
    gsap.registerPlugin(SplitText, ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Get cards and setup animations
    const cardElements = gsap.utils.toArray<HTMLElement>(
      `.${styles.stackingCards_card}`
    );
    const introCard = cardElements[0];

    // Only proceed if we have cards
    if (cardElements.length === 0) {
      return;
    }

    // Split text animation setup
    const titles = gsap.utils.toArray<HTMLElement>(
      `.${styles.stackingCards_cardTitle} h1`
    );
    titles.forEach((title) => {
      const split = new SplitText(title, {
        type: 'chars',
        charsClass: 'char',
        tag: 'div',
      });
      split.chars.forEach((char: Element) => {
        (char as HTMLElement).innerHTML = `<span>${char.textContent}</span>`;
      });
    });

    // Initial setup for intro card
    const cardImgWrapper = introCard.querySelector(
      `.${styles.stackingCards_cardImg}`
    );
    const cardMedia = introCard.querySelector(
      `.${styles.stackingCards_cardImg} img, .${styles.stackingCards_cardImg} video`
    );
    gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: '400px' });
    gsap.set(cardMedia, { scale: 1.5 });

    // Animation functions
    function animateContentIn(titleChars: Element[], description: Element) {
      gsap.to(titleChars, { x: '0%', duration: 0.75, ease: 'power4.out' });
      gsap.to(description, {
        x: 0,
        opacity: 1,
        duration: 0.75,
        delay: 0.1,
        ease: 'power4.out',
      });
    }

    function animateContentOut(titleChars: Element[], description: Element) {
      gsap.to(titleChars, { x: '100%', duration: 0.5, ease: 'power4.out' });
      gsap.to(description, {
        x: '40px',
        opacity: 0,
        duration: 0.5,
        ease: 'power4.out',
      });
    }

    // Intro card scroll animation
    const titleChars = Array.from(introCard.querySelectorAll('.char span'));
    const description = introCard.querySelector(
      `.${styles.stackingCards_cardDescription}`
    );

    ScrollTrigger.create({
      trigger: introCard,
      start: 'top top',
      end: '+=300vh',
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = 0.5 + progress * 0.5;
        const borderRadius = 400 - progress * 375;
        const innerImgScale = 1.5 - progress * 0.5;

        gsap.set(cardImgWrapper, {
          scale: imgScale,
          borderRadius: borderRadius + 'px',
        });
        gsap.set(cardMedia, { scale: innerImgScale });

        if (
          progress >= 1 &&
          !(introCard as ExtendedHTMLElement).contentRevealed
        ) {
          (introCard as ExtendedHTMLElement).contentRevealed = true;
          animateContentIn(titleChars, description!);
        }
        if (
          progress < 1 &&
          (introCard as ExtendedHTMLElement).contentRevealed
        ) {
          (introCard as ExtendedHTMLElement).contentRevealed = false;
          animateContentOut(titleChars, description!);
        }
      },
    });

    // Pin cards
    cardElements.forEach((card, index) => {
      const isLastCard = index === cardElements.length - 1;
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: isLastCard ? '+=100vh' : 'top top',
        endTrigger: isLastCard ? null : cardElements[cardElements.length - 1],
        pin: true,
        pinSpacing: isLastCard,
      });
    });

    // Scale and fade out cards
    cardElements.forEach((card, index) => {
      if (index < cardElements.length - 1) {
        const cardWrapper = card.querySelector(
          `.${styles.stackingCards_cardWrapper}`
        );
        ScrollTrigger.create({
          trigger: cardElements[index + 1],
          start: 'top bottom',
          end: 'top top',
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardWrapper, {
              scale: 1 - progress * 0.25,
              opacity: 1 - progress,
            });
          },
        });
      }
    });

    // Image animations for non-intro cards
    cardElements.forEach((card, index) => {
      if (index > 0) {
        const cardMedia = card.querySelector(
          `.${styles.stackingCards_cardImg} img, .${styles.stackingCards_cardImg} video`
        );
        const imgContainer = card.querySelector(
          `.${styles.stackingCards_cardImg}`
        );
        ScrollTrigger.create({
          trigger: card,
          start: 'top bottom',
          end: 'top top',
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(cardMedia, { scale: 2 - progress });
            gsap.set(imgContainer, {
              borderRadius: 150 - progress * 125 + 'px',
            });
          },
        });
      }
    });

    // Content animations for non-intro cards
    cardElements.forEach((card, index) => {
      if (index === 0) return;

      const cardDescription = card.querySelector(
        `.${styles.stackingCards_cardDescription}`
      );
      const cardTitleChars = Array.from(card.querySelectorAll('.char span'));

      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        onEnter: () => animateContentIn(cardTitleChars, cardDescription!),
        onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription!),
      });
    });

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [isDesktop, data]);

  return (
    <section ref={containerRef} className={styles.stackingCards_section}>
      <div className={styles.stackingCards_cards}>
        {data.map((card) => {
          const mediaUrl = getMediaUrl(card);
          const mediaMime = getMediaMime(card);
          const mediaType = getMediaType(mediaMime);

          return (
            <div key={card.id} className={styles.stackingCards_card}>
              <div className={styles.stackingCards_cardWrapper}>
                <div className={styles.stackingCards_cardImg}>
                  {mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ pointerEvents: 'none' }}
                    />
                  ) : (
                    <img src={mediaUrl} alt={card.title} />
                  )}
                </div>

                <div className={styles.stackingCards_cardContent}>
                  <div className={styles.stackingCards_cardTitle}>
                    <h1>{card.title}</h1>
                  </div>
                  <div className={styles.stackingCards_cardDescription}>
                    <p>{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StackingCards;
