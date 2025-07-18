'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './BannerHero.module.scss';
import { BannerHeroProps } from 'types';
import TransitionLink from '@/components/TransitionLink';
import TextReveal from '@/components/text-reveal/TextReveal';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useNavigationState } from '@/utils/navigationState';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false,
  loading: () => (
    <div
      className={`${styles.hp_banner_video}`}
      style={{ backgroundColor: '#000' }}
    />
  ),
});

interface BannerHeroComponentProps {
  props: BannerHeroProps['props'];
  delay?: number;
}

const BannerHero = ({ props, delay = 0 }: BannerHeroComponentProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const { isReady, wasNavigating } = useNavigationState(600);

  useEffect(() => {
    if (!isReady || !buttonRef.current) {
      return;
    }

    const animationDelay = wasNavigating ? delay + 0.4 : delay + 0.3;

    gsap.to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: animationDelay,
      ease: 'power2.out',
    });
  }, [delay, isReady, wasNavigating]);

  return (
    <div className={`${styles.hp_banner}`}>
      <div className={`${styles.hp_banner_inner}`}>
        {props.media?.data?.attributes?.mime?.split('/')[0] === 'video' ||
        props.mediaMP4?.data?.attributes?.mime?.split('/')[0] === 'video' ? (
          <VideoPlayer
            media={props.media}
            mediaMP4={props.mediaMP4}
            className={`${styles.hp_banner_video}`}
          />
        ) : props.media?.data?.attributes?.url ? (
          <Image
            src={props.media.data.attributes.url}
            alt={props.media.data.attributes.alternativeText || ''}
            className={`${styles.hp_banner_video}`}
            fill
            priority
          />
        ) : null}

        <div className={`${styles.hp_banner_content}`}>
          {props.subtitle && (
            <TextReveal line>
              <h4
                dangerouslySetInnerHTML={{
                  __html: props.subtitle,
                }}
                className={`${styles.hp_banner_subTitle}`}
              />
            </TextReveal>
          )}

          {props.title ? (
            <TextReveal word delay={delay}>
              <h1
                dangerouslySetInnerHTML={{
                  __html: props.title,
                }}
                className={`${styles.hp_banner_title}`}
              />
            </TextReveal>
          ) : null}

          {props.Button && (
            <TransitionLink
              ref={buttonRef}
              href={props.Button.URL}
              className={`${styles.hp_banner_button}`}
            >
              {props.Button.Title}
            </TransitionLink>
          )}

          {props.Description && (
            <TextReveal word delay={0.3}>
              <h1
                dangerouslySetInnerHTML={{
                  __html: props.Description,
                }}
                className={`${styles.hp_banner_text}`}
              />
            </TextReveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerHero;
