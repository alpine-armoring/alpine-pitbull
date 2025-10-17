'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';

interface MediaData {
  data: {
    attributes: {
      url: string;
      mime: string;
    };
  } | null;
}

interface OptimizedVideo {
  video: string;
  poster: string;
  videoWebM?: string;
}

interface VideoPlayerProps {
  media?: MediaData;
  mediaMP4?: MediaData;
  className?: string;
  optimizedVideo?: OptimizedVideo;
}

const VideoPlayer = React.memo(
  ({ media, mediaMP4, className, optimizedVideo }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const deviceInfo = useMemo(() => {
      if (typeof window === 'undefined') {
        return {
          isIOS: false,
          isSafari: false,
          isChrome: false,
        };
      }

      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
      const isSafari =
        userAgent.toLowerCase().indexOf('safari') > -1 &&
        userAgent.toLowerCase().indexOf('chrome') === -1 &&
        userAgent.toLowerCase().indexOf('firefox') === -1;
      const isChrome = Boolean(userAgent.match(/Chrome|CriOS/i));

      return { isIOS, isSafari, isChrome };
    }, []);

    const shouldUseMP4Fallback = useCallback(() => {
      if (typeof window === 'undefined' || !mediaMP4?.data) return false;

      const { isIOS, isSafari, isChrome } = deviceInfo;

      const isChromeOnIOSCondition = isChrome && isIOS;

      return isSafari || isChromeOnIOSCondition;
    }, [mediaMP4?.data, deviceInfo]);

    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      let mounted = true;

      const handleVideoLoad = () => {
        if (!mounted) return;

        if (deviceInfo.isIOS) {
          videoElement.playsInline = true;
        }
      };

      const handleVideoError = (error: Event) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Video failed to load:', error);
        }
      };

      const handleEnded = () => {
        if (!mounted) return;
        requestAnimationFrame(() => {
          if (videoElement && mounted) {
            videoElement.currentTime = 0;
            videoElement.play().catch((err) => {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Video play failed:', err);
              }
            });
          }
        });
      };

      if (!optimizedVideo && shouldUseMP4Fallback()) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        ) as HTMLSourceElement | null;
        if (webmSource && mediaMP4?.data) {
          webmSource.setAttribute('src', mediaMP4.data.attributes.url);
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }

      videoElement.addEventListener('loadeddata', handleVideoLoad);
      videoElement.addEventListener('error', handleVideoError);
      videoElement.addEventListener('ended', handleEnded);

      videoElement.preload = 'auto';

      return () => {
        mounted = false;
        videoElement.removeEventListener('loadeddata', handleVideoLoad);
        videoElement.removeEventListener('error', handleVideoError);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }, [shouldUseMP4Fallback, mediaMP4?.data, deviceInfo, optimizedVideo]);

    if (!media?.data && !mediaMP4?.data && !optimizedVideo) {
      return null;
    }

    // Use optimized video URLs when available, otherwise fall back to Strapi
    const videoSrc = optimizedVideo?.video || media?.data?.attributes?.url;
    const videoType = optimizedVideo
      ? 'video/mp4'
      : media?.data?.attributes?.mime;
    const posterSrc = optimizedVideo?.poster;

    return (
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="auto"
        poster={posterSrc}
        className={className}
        suppressHydrationWarning={true}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label="Background video"
        role="presentation"
      >
        {videoSrc && <source src={videoSrc} type={videoType} />}
        {!optimizedVideo && mediaMP4?.data && !media?.data && (
          <source
            src={mediaMP4.data.attributes.url}
            type={mediaMP4.data.attributes.mime}
          />
        )}
        {/* Fixed: Properly escaped HTML entities */}
        <p>Your browser doesn&apos;t support HTML5 video.</p>
      </video>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
