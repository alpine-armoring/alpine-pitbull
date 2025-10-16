import styles from './VideoScale.module.scss';
import React, { useEffect, useRef, useState } from 'react';

export function animateVideo(entry: Element): void {
  const { bottom } = entry.getBoundingClientRect();
  const video = entry.querySelector('.videoScaleVideo') as HTMLVideoElement;
  if (!video) return;

  let scale = 1 - (bottom - window.innerHeight) * 0.0005;

  scale = scale < 0.8 ? 0.8 : scale > 1 ? 1 : scale;
  video.style.transform = `scale(${scale})`;
}

interface VideoAttributes {
  url: string;
  mime: string;
}

interface VideoScaleProps {
  videoWebm?: VideoAttributes;
  videoMP4?: VideoAttributes;
}

const VideoScale = ({ videoWebm, videoMP4 }: VideoScaleProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lazyLoadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadVideo) {
            setShouldLoadVideo(true);
            lazyLoadObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px 200px 0px',
        threshold: 0,
      }
    );

    lazyLoadObserver.observe(container);

    return () => {
      lazyLoadObserver.disconnect();
    };
  }, [shouldLoadVideo]);

  useEffect(() => {
    if (!shouldLoadVideo) return;

    const videoElement = videoRef.current;
    if (videoElement) {
      const playVideo = () => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      };

      const handleEnded = () => {
        playVideo();
      };

      const handleLoadedData = () => {
        playVideo();
      };

      const handleCanPlay = () => {
        playVideo();
      };

      if (videoElement.readyState >= 3) {
        playVideo();
      }

      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('canplay', handleCanPlay);

      return () => {
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [shouldLoadVideo]);

  return (
    <section
      ref={containerRef}
      className={`${styles.videoScale} observe videoScaleContainer`}
    >
      <div className={`${styles.videoScale_shim}`}></div>
      <div className={`${styles.videoScale_sticky}`}>
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className={`${styles.videoScale_video} videoScaleVideo`}
            muted={true}
            playsInline={true}
            loop={true}
            autoPlay={true}
            preload="auto"
          >
            {videoMP4 ? (
              <source src={`${videoMP4.url}`} type={`${videoMP4.mime}`} />
            ) : null}
            {videoWebm ? (
              <source src={`${videoWebm.url}`} type={`${videoWebm.mime}`} />
            ) : null}
          </video>
        ) : (
          <div
            className={`${styles.videoScale_video} ${styles.videoScale_placeholder}`}
            style={{
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            Loading video...
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoScale;
