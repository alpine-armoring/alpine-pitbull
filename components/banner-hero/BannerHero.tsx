'use client';

import dynamic from 'next/dynamic';
import styles from './BannerHero.module.scss';
import { BannerHeroProps } from 'types';
import Link from 'next/link';
import FadeInContent from '@/components/FadeInContent';
import Image from 'next/image';

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
  big?: boolean;
  small?: boolean;
}

const BannerHero = ({ props, big, small }: BannerHeroComponentProps) => {
  return (
    <div
      className={`${styles.hp_banner} ${big ? styles.hp_banner_big : ''} ${small ? styles.hp_banner_small : ''}`}
    >
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
            <FadeInContent>
              <h2
                dangerouslySetInnerHTML={{
                  __html: props.subtitle,
                }}
                className={`${styles.hp_banner_subTitle}`}
              />
            </FadeInContent>
          )}

          {props.title ? (
            <FadeInContent delay={0.2}>
              <h1
                dangerouslySetInnerHTML={{
                  __html: props.title,
                }}
                className={`${styles.hp_banner_title}`}
              />
            </FadeInContent>
          ) : null}

          {props.Description && (
            <FadeInContent delay={0.3}>
              <h2
                dangerouslySetInnerHTML={{
                  __html: props.Description,
                }}
                className={`${styles.hp_banner_text}`}
              />
            </FadeInContent>
          )}

          {props.Button && (
            <FadeInContent delay={0.3}>
              <Link
                href={props.Button.URL}
                className={`${styles.hp_banner_button}`}
              >
                {props.Button.Title}
              </Link>
            </FadeInContent>
          )}
        </div>
      </div>
      <div className={`${styles.hp_banner_shape} shape-before`}></div>
    </div>
  );
};

export default BannerHero;
