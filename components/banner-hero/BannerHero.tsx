'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './BannerHero.module.scss';
import { BannerHeroProps } from 'types';
import Link from 'next/link';
import TextReveal from '@/components/text-reveal/TextReveal';
import Image from 'next/image';
import { gsap } from 'gsap';

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

  useEffect(() => {
    gsap.to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: delay + 0.4,
      ease: 'power2.out',
    });
  }, [delay]);

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
            <Link
              ref={buttonRef}
              href={props.Button.URL}
              className={`${styles.hp_banner_button}`}
            >
              {props.Button.Title}
            </Link>
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
