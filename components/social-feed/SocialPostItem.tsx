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
      {!videoType ? (
        <>
          <Image
            src={getThumbnailUrl()}
            alt="Alpine Armoring"
            width={500}
            height={450}
            sizes="(min-width: 768px) 100vw, 80vw"
            style={{ objectFit: 'cover' }}
            className={`${styles.socialPost_notPlaying_image}`}
          />

          <div className={`${styles.socialPost_data}`}>
            {props?.views && (
              <span>
                <svg
                  aria-label="View Count Icon"
                  fill="currentColor"
                  height="19"
                  role="img"
                  viewBox="0 0 24 24"
                  width="19"
                >
                  <title>View Count Icon</title>
                  <path
                    d="M23.441 11.819C23.413 11.74 20.542 4 12 4S.587 11.74.559 11.819a1 1 0 0 0 1.881.677 10.282 10.282 0 0 1 19.12 0 1 1 0 0 0 1.881-.677Zm-7.124 2.368a3.359 3.359 0 0 1-1.54-.1 3.56 3.56 0 0 1-2.365-2.362 3.35 3.35 0 0 1-.103-1.542.99.99 0 0 0-1.134-1.107 5.427 5.427 0 0 0-3.733 2.34 5.5 5.5 0 0 0 8.446 6.97 5.402 5.402 0 0 0 1.536-3.09.983.983 0 0 0-1.107-1.109Z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
                {props.views}
              </span>
            )}
            {props?.url && (
              <a
                href={props.url}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                rel="noopener noreferrer"
              >
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
        </>
      ) : null}

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
              {props?.views && (
                <span>
                  <svg
                    aria-label="View Count Icon"
                    fill="currentColor"
                    height="19"
                    role="img"
                    viewBox="0 0 24 24"
                    width="19"
                  >
                    <title>View Count Icon</title>
                    <path
                      d="M23.441 11.819C23.413 11.74 20.542 4 12 4S.587 11.74.559 11.819a1 1 0 0 0 1.881.677 10.282 10.282 0 0 1 19.12 0 1 1 0 0 0 1.881-.677Zm-7.124 2.368a3.359 3.359 0 0 1-1.54-.1 3.56 3.56 0 0 1-2.365-2.362 3.35 3.35 0 0 1-.103-1.542.99.99 0 0 0-1.134-1.107 5.427 5.427 0 0 0-3.733 2.34 5.5 5.5 0 0 0 8.446 6.97 5.402 5.402 0 0 0 1.536-3.09.983.983 0 0 0-1.107-1.109Z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                  {props.views}
                </span>
              )}
              {props?.url && (
                <a
                  href={props.url}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  rel="noopener noreferrer"
                >
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
