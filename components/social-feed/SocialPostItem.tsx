import { useState, useRef } from 'react';
import styles from './SocialPostItem.module.scss';
import Image from 'next/image';
import PlayIcon from '@/components/icons/Play';

const VideoSingle = ({ props }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoType = () => {
    if (props?.youtubeURL) {
      return 'youtube';
    }
    if (props?.video.data) {
      return 'upload';
    }
    return null;
  };

  const getThumbnailUrl = () => {
    const videoType = getVideoType();

    if (props?.thumbnail?.data) {
      return (
        props.thumbnail.data.attributes.formats?.medium.url ||
        props.thumbnail.data.attributes.url
      );
    }

    if (videoType === 'youtube') {
      return `https://i.ytimg.com/vi/${props.youtubeURL}/sddefault.jpg`;
    }

    return '/images/alpine-pitbull-logo.svg';
  };

  const handleClick = () => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setHasError(true);
    console.error('Video failed to load');
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsLoading(false);

    if (videoRef.current && getVideoType() === 'upload') {
      videoRef.current.pause();
    }
  };

  const videoType = getVideoType();
  return (
    <div
      className={`
        ${styles.socialPost} 
        ${isPlaying ? styles.socialPost_playing : ''}
      `}
    >
      {!isPlaying && videoType ? (
        <>
          <div
            onClick={handleClick}
            className={`${styles.socialPost_notPlaying}`}
          >
            <Image
              src={getThumbnailUrl()}
              alt="Alpine Armoring"
              width={500}
              height={450}
              sizes="(min-width: 768px) 100vw, 80vw"
              style={{ objectFit: 'cover' }}
              className={`${styles.socialPost_notPlaying_image}`}
            />

            <div className={`${styles.socialPost_notPlaying_icon}`}>
              <PlayIcon />
            </div>

            <div className={`${styles.socialPost_data}`}>
              <span>
                <svg aria-hidden="true" viewBox="0 0 60 60">
                  <path
                    d="m46.6 8.152c-1.9072277-3.71413157-5.463312-6.30328434-9.5836691-6.97778278-4.1203571-.67449843-8.3163886.64564056-11.3083309 3.55778278l-1.708 1.562-1.654-1.506c-2.9864516-2.97003396-7.2232393-4.31525874-11.376-3.612-4.12867111.64371499-7.69265919 3.24092009-9.57 6.974-2.53822761 4.9741204-1.558832 11.0196624 2.42 14.938l18.746 19.312c.3765627.3873273.8937945.6058537 1.434.6058537s1.0574373-.2185264 1.434-.6058537l18.72-19.276c3.9951579-3.9221793 4.9852081-9.9822907 2.446-14.972z"
                    fillRule="evenodd"
                    fill="white"
                    transform="translate(6 8)"
                  ></path>
                </svg>
                190K
              </span>
              <span>
                <svg aria-hidden="true" viewBox="0 0 60 60">
                  <path
                    d="m31.652.5h-15.304-.0000004c-8.47646002.00000037-15.34800002 6.87154-15.34800002 15.348.00000037 8.47646 6.87154 15.348 15.34800002 15.348h1.652v7.304-.00004c-.0001908.552284.44737 1.000154.999654 1.000346.274722.0000949.537384-.1128352.726318-.312276l7.57-8h4.356-.0000007c8.47646.0000003 15.348-6.87154 15.348-15.348.0000004-8.47646003-6.87154-15.34800003-15.348-15.34800003z"
                    fillRule="evenodd"
                    fill="white"
                    transform="translate(6 10)"
                  ></path>
                </svg>
                467
              </span>
              {props?.link && (
                <a href={props.link} target="_blank">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <g id="Interface / External_Link">
                        {' '}
                        <path
                          id="Vector"
                          d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </>
      ) : null}

      {isPlaying && (
        <div className={styles.socialPost_player}>
          {isLoading && (
            <div className={styles.socialPost_loading}>
              <div className={styles.socialPost_spinner}></div>
            </div>
          )}

          {hasError && (
            <div className={styles.socialPost_error}>
              <p>Failed to load video. Please try again.</p>
              <button onClick={() => window.location.reload()}>
                Reload Page
              </button>
            </div>
          )}

          {videoType === 'youtube' && (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${props.youtubeURL}?autoplay=1&rel=0`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
              onError={handleVideoError}
            />
          )}

          {videoType === 'upload' && (
            <video
              ref={videoRef}
              width="100%"
              height="100%"
              controls
              autoPlay
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
            >
              <source src={props.video.data.attributes.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <button
            className={styles.socialPost_close}
            onClick={handleCloseVideo}
            aria-label="Close video"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoSingle;
