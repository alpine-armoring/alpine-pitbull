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

interface VideoPlayerProps {
  media?: MediaData;
  mediaMP4?: MediaData;
  className?: string;
}

const VideoPlayer = React.memo(
  ({ media, mediaMP4, className }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Fixed device detection with proper TypeScript types
    const deviceInfo = useMemo(() => {
      if (typeof window === 'undefined') {
        return {
          isIOS: false,
          isSafari: false,
          isChrome: false,
          safariVersion: null as string | null,
        };
      }

      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
      const isSafari =
        userAgent.toLowerCase().indexOf('safari') > -1 &&
        userAgent.toLowerCase().indexOf('chrome') === -1 &&
        userAgent.toLowerCase().indexOf('firefox') === -1;
      const isChrome = Boolean(userAgent.match(/Chrome|CriOS/i));

      let safariVersion: string | null = null;
      if (isSafari) {
        const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
        safariVersion = versionMatch ? versionMatch[1] : null;
      }

      return { isIOS, isSafari, isChrome, safariVersion };
    }, []);

    const shouldUseMP4Fallback = useCallback(() => {
      if (typeof window === 'undefined' || !mediaMP4?.data) return false;

      const { isIOS, isSafari, isChrome, safariVersion } = deviceInfo;

      const safariVersionNumber = safariVersion ? parseInt(safariVersion) : 0;
      const isSafariCondition =
        isSafari &&
        (safariVersionNumber < 17 ||
          (safariVersionNumber >= 17 && window.innerWidth >= 768));

      const isChromeOnIOSCondition = isChrome && isIOS;

      return isSafariCondition || isChromeOnIOSCondition;
    }, [mediaMP4?.data, deviceInfo]);

    // Optimize video loading and playback
    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      let mounted = true;

      const handleVideoLoad = () => {
        if (!mounted) return;

        // Optimize for mobile performance
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
        // Use requestAnimationFrame for smoother loop
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

      // Apply MP4 fallback if needed
      if (shouldUseMP4Fallback()) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        ) as HTMLSourceElement | null;
        if (webmSource && mediaMP4?.data) {
          webmSource.setAttribute('src', mediaMP4.data.attributes.url);
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }

      // Add event listeners
      videoElement.addEventListener('loadeddata', handleVideoLoad);
      videoElement.addEventListener('error', handleVideoError);
      videoElement.addEventListener('ended', handleEnded);

      // Preload optimization
      videoElement.preload = 'metadata';

      // Intersection Observer for lazy loading
      let observer: IntersectionObserver | null = null;

      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && mounted) {
                videoElement.preload = 'auto';
                observer?.disconnect();
              }
            });
          },
          { rootMargin: '50px' }
        );

        observer.observe(videoElement);
      }

      return () => {
        mounted = false;
        videoElement.removeEventListener('loadeddata', handleVideoLoad);
        videoElement.removeEventListener('error', handleVideoError);
        videoElement.removeEventListener('ended', handleEnded);
        observer?.disconnect();
      };
    }, [shouldUseMP4Fallback, mediaMP4?.data, deviceInfo]);

    if (!media?.data && !mediaMP4?.data) {
      return null;
    }

    return (
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="metadata"
        className={className}
        suppressHydrationWarning={true}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        aria-label="Background video"
        role="presentation"
      >
        {media?.data && (
          <source
            src={media.data.attributes.url}
            type={media.data.attributes.mime}
          />
        )}
        {mediaMP4?.data && !media?.data && (
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
