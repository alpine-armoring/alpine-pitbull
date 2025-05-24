'use client';

import React, { useRef, useEffect, useCallback } from 'react';

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

const VideoPlayer = ({ media, mediaMP4, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isIOS = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
  }, []);

  const isSafari = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    const isNotChrome =
      navigator.userAgent.toLowerCase().indexOf('chrome') === -1;
    const isNotFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') === -1;
    return isSafari && isNotChrome && isNotFirefox;
  }, []);

  const getSafariVersion = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const userAgent = navigator.userAgent;
    const versionMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    return versionMatch ? versionMatch[1] : null;
  }, []);

  const isChrome = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent;
    return Boolean(userAgent.match(/Chrome|CriOS/i));
  }, []);

  const shouldUseMP4Fallback = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const isSafariCondition =
      isSafari() &&
      (parseInt(getSafariVersion() || '0') < 17 ||
        (parseInt(getSafariVersion() || '0') >= 17 &&
          window.innerWidth >= 768));

    const isChromeOnIOSCondition = isChrome() && isIOS();

    return (mediaMP4?.data && isSafariCondition) || isChromeOnIOSCondition;
  }, [mediaMP4?.data, isChrome, isIOS, isSafari, getSafariVersion]);

  useEffect(() => {
    if (shouldUseMP4Fallback()) {
      const videoElement = videoRef.current;
      if (videoElement) {
        const webmSource = videoElement.querySelector(
          'source[type="video/webm"]'
        ) as HTMLSourceElement | null;
        if (webmSource && mediaMP4?.data) {
          webmSource.setAttribute('src', mediaMP4.data.attributes.url);
          webmSource.setAttribute('type', 'video/mp4');
          videoElement.load();
        }
      }
    }
  }, [shouldUseMP4Fallback]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleEnded = () => {
        videoElement.play();
      };

      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  if (!media?.data && !mediaMP4?.data) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      muted
      autoPlay
      playsInline
      preload="auto"
      className={className}
      suppressHydrationWarning={true}
    >
      {media?.data ? (
        <source
          src={media.data.attributes.url}
          type={media.data.attributes.mime}
        />
      ) : null}
      {mediaMP4?.data && !media?.data ? (
        <source
          src={mediaMP4.data.attributes.url}
          type={mediaMP4.data.attributes.mime}
        />
      ) : null}
    </video>
  );
};

export default VideoPlayer;
