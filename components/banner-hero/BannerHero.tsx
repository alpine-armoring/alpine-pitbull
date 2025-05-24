'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import styles from './BannerHero.module.scss';
import { BannerHeroProps } from 'types';
import Link from 'next/link';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  ssr: false,
  loading: () => (
    <div
      className={`${styles.hp_banner_video}`}
      style={{ backgroundColor: '#000' }}
    />
  ),
});

const BannerHero = ({ props }: BannerHeroProps) => {
  return (
    <div className={`${styles.hp_banner}`}>
      <div className={`${styles.hp_banner_inner}`}>
        <VideoPlayer
          media={props.media}
          mediaMP4={props.mediaMP4}
          className={`${styles.hp_banner_video}`}
        />

        <div className={`${styles.hp_banner_content}`}>
          {props.subtitle && (
            <h4
              dangerouslySetInnerHTML={{
                __html: props.subtitle,
              }}
              className={`${styles.hp_banner_subTitle}`}
            />
          )}

          {props.title ? (
            <h1
              dangerouslySetInnerHTML={{
                __html: props.title,
              }}
              className={`${styles.hp_banner_title}`}
            />
          ) : null}

          {props.Button && (
            <Link
              href={props.Button.URL}
              className={`${styles.hp_banner_button}`}
            >
              {props.Button.Title}
            </Link>
          )}

          {props.Description && (
            <p
              dangerouslySetInnerHTML={{
                __html: props.Description,
              }}
              className={`${styles.hp_banner_text}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerHero;
