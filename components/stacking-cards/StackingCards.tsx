'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import styles from './StackingCards.module.scss';

const cardData: CardData[] = [
  {
    id: 1,
    title: 'F-600 chassis',
    description:
      'Built upon the robust and reliable heavy-duty F-600 chassis, this formidable vehicle is designed to withstand the most demanding environments and hostile encounters. Its foundation ensures superior structural integrity and a stable platform, critical for both defensive capabilities and sustained performance in challenging terrains.',
    video: 'https://d102sycao8uwt8.cloudfront.net/7018_web_vid_db1c365a40.mp4',
    mediaType: 'video',
  },
  {
    id: 2,
    title: 'V8 turbo diesel engine',
    description:
      'At the heart of the Pit-Bull VX® lies a powerful V8 turbo diesel engine, a true workhorse engineered for immense torque and enduring power. This advanced powertrain not only ensures swift and decisive maneuverability, even under heavy loads, but also provides the critical acceleration needed to extract personnel from high-threat areas. The turbo diesel configuration enhances fuel efficiency while delivering consistent, reliable power, crucial for extended missions and reducing the logistical burden in remote operational zones.',
    image:
      'https://d102sycao8uwt8.cloudfront.net/Alpine_Armoring_Armored_SWAT_Pit_Bull_VX_A12_30_9dca216ace.JPG',
    mediaType: 'image',
  },
  {
    id: 3,
    title: "Team's Safety",
    description: `The primary mission of the Pit-Bull VX® is to ensure your team's safety. Every aspect of its design, from the ballistic-rated steel armor to the reinforced windows, is meticulously engineered to provide comprehensive protection against a wide array of threats. This unwavering commitment to safety means that even when confronted with direct engagement "in the line of fire," your personnel are shielded within a fortress of cutting-edge defensive technology. The vehicle's advanced armor system is designed to defeat multiple rounds of high-caliber ammunition, shrapnel, and other ballistic threats, allowing your team to focus on their mission objectives with confidence, knowing they are enveloped in an exceptionally resilient mobile sanctuary.`,
    image:
      'https://d102sycao8uwt8.cloudfront.net/armored_swat_truck_apc_pitbull_vxt_50cal_7018_20_cb46b2b4e2.jpg',
    mediaType: 'image',
  },
];

type CardData = {
  id: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  mediaType?: 'image' | 'video';
};

type CardComponentProps = {
  cards?: CardData[];
};

interface ExtendedHTMLElement extends HTMLElement {
  contentRevealed?: boolean;
}

// Hook to detect if device is desktop
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      // You can adjust this breakpoint to match your design requirements
      // Common desktop breakpoint is 1024px or 768px
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

const StackingCards = ({ cards = cardData }: CardComponentProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isDesktop = useIsDesktop();

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
  }, [isDesktop]); // Add isDesktop as dependency

  return (
    <section ref={containerRef} className={styles.stackingCards_section}>
      <div className={styles.stackingCards_cards}>
        {cards.map((card) => (
          <div key={card.id} className={styles.stackingCards_card}>
            <div className={styles.stackingCards_cardWrapper}>
              <div className={styles.stackingCards_cardImg}>
                {card.mediaType === 'video' && card.video ? (
                  <video
                    src={card.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ pointerEvents: 'none' }}
                  />
                ) : (
                  <img src={card.image} alt={card.title} />
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
        ))}
      </div>
    </section>
  );
};

export default StackingCards;
