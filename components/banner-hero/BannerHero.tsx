'use client';

import styles from './BannerHero.module.scss';
import { BannerHeroProps } from 'types';
import Link from 'next/link';
import FadeInContent from '@/components/FadeInContent';
import Image from 'next/image';
import VideoPlayer from './VideoPlayer';

interface OptimizedVideo {
  video: string;
  poster: string;
  videoWebM?: string;
}

interface BannerHeroComponentProps {
  props: BannerHeroProps['props'];
  big?: boolean;
  hp?: boolean;
  optimizedVideo?: OptimizedVideo;
}

const BannerHero = ({
  props,
  big,
  hp,
  optimizedVideo,
}: BannerHeroComponentProps) => {
  return (
    <div
      className={`${styles.hp_banner} ${big ? styles.hp_banner_big : ''} ${hp ? styles.hp_banner_hp : ''}`}
    >
      <div className={`${styles.hp_banner_inner}`}>
        {props.media?.data?.attributes?.mime?.split('/')[0] === 'video' ||
        props.mediaMP4?.data?.attributes?.mime?.split('/')[0] === 'video' ? (
          <VideoPlayer
            media={props.media}
            mediaMP4={props.mediaMP4}
            className={`${styles.hp_banner_video}`}
            optimizedVideo={optimizedVideo}
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

          <FadeInContent delay={0.3}>
            <div className={`${styles.hp_banner_button_wrap}`}>
              {props.Button && (
                <Link
                  href={props.Button.URL}
                  className={`${styles.hp_banner_button}`}
                >
                  {props.Button.Title}
                </Link>
              )}
              {props.Button2 && (
                <Link
                  href={props.Button2.URL}
                  className={`${styles.hp_banner_button}`}
                >
                  {props.Button2.Title}
                </Link>
              )}
            </div>
          </FadeInContent>
        </div>
      </div>
      <div className={`${styles.hp_banner_shape} shape-before`}></div>
    </div>
  );
};

export default BannerHero;
