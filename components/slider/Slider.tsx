'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './Slider.module.scss';

const MediaSlider = ({ media, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, media.length);
  }, [media.length]);

  const handlePrevSlide = () => {
    const newIndex = currentIndex === 0 ? media.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    pauseAllVideos();
  };

  const handleNextSlide = () => {
    const newIndex = currentIndex === media.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    pauseAllVideos();
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const pauseAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });
  };

  const isVideo = (item) => {
    return item.attributes.mime.startsWith('video/');
  };

  const isPNG = (item) => {
    return (
      item.attributes.ext === '.png' || item.attributes.mime === 'image/png'
    );
  };

  const currentItem = media[currentIndex];

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.mediaSlider} ${className}`}>
      <div className={styles.mediaSlider_container}>
        {/* Media Display */}
        <div className={styles.mediaSlider_media}>
          {isVideo(currentItem) ? (
            <video
              ref={(el) => {
                videoRefs.current[currentIndex] = el;
              }}
              className={styles.mediaSlider_video}
              controls
              preload="metadata"
              autoPlay
              muted
              loop
              poster={currentItem.attributes.previewUrl || undefined}
            >
              <source
                src={currentItem.attributes.url}
                type={currentItem.attributes.mime}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={
                currentItem.attributes.formats.large.url ||
                currentItem.attributes.url
              }
              width={currentItem.attributes.width}
              height={currentItem.attributes.height}
              alt={
                currentItem.attributes.alternativeText ||
                currentItem.attributes.name
              }
              className={`${styles.mediaSlider_image} ${isPNG(currentItem) ? `${styles.mediaSlider_image_transparent}` : ''}`}
              style={{ objectFit: 'cover' }}
              priority={currentIndex === 0}
            />
          )}
        </div>

        {/* Expand Button */}
        <button
          className={styles.mediaSlider_expand}
          onClick={handleExpand}
          aria-label={isExpanded ? 'Minimize' : 'Maximize'}
          aria-expanded={isExpanded}
        >
          <i className={styles.mediaSlider_expand_icon}>
            <Image
              src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Maximise'%20clip-path='url(%23clip0_16559_57411)'%3e%3cpath%20id='Vector'%20d='M19.5043%200.0639532C19.6997%200.145074%2019.8549%200.300301%2019.936%200.495637C19.977%200.591744%2019.9987%200.694949%2020%200.799415L20%204.79649C20%205.23799%2019.642%205.5959%2019.2005%205.5959C18.7589%205.5959%2018.4009%205.23799%2018.4009%204.79649L18.4009%202.726L13.3718%207.76231C13.2217%207.91365%2013.0174%207.99878%2012.8042%207.99878C12.591%207.99878%2012.3866%207.91365%2012.2365%207.76231C12.0851%207.61221%2012%207.40788%2012%207.19473C12%206.98158%2012.0851%206.77725%2012.2365%206.62715L17.2736%201.59883L15.2028%201.59883C14.7612%201.59883%2014.4032%201.24092%2014.4032%200.799415C14.4032%200.35791%2014.7612%200%2015.2028%200L19.2005%200C19.3049%200.00126306%2019.4082%200.0229904%2019.5043%200.0639532Z'%20fill='%230C121C'/%3e%3cpath%20id='Vector_2'%20d='M0.495714%2019.936C0.300347%2019.8549%200.145096%2019.6997%200.0639629%2019.5044C0.022994%2019.4083%200.00126314%2019.3051%201.075e-09%2019.2006L6.44997e-09%2015.2035C7.04368e-09%2014.762%200.357965%2014.4041%200.799536%2014.4041C1.24111%2014.4041%201.59907%2014.762%201.59907%2015.2035L1.59907%2017.274L6.62816%2012.2377C6.77828%2012.0863%206.98264%2012.0012%207.19583%2012.0012C7.40901%2012.0012%207.61337%2012.0863%207.7635%2012.2377C7.91486%2012.3878%208%2012.5921%208%2012.8053C8%2013.0184%207.91486%2013.2228%207.7635%2013.3729L2.72642%2018.4012H4.79722C5.23879%2018.4012%205.59675%2018.7591%205.59675%2019.2006C5.59675%2019.6421%205.23879%2020%204.79722%2020H0.799536C0.695055%2019.9987%200.591835%2019.977%200.495714%2019.936Z'%20fill='%230C121C'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_16559_57411'%3e%3crect%20width='20'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
              className={styles.mediaSlider_expand_img}
              alt=""
              width="20"
              height="20"
              loading="lazy"
            />
          </i>
        </button>

        {/* Navigation Controls */}
        {media.length > 1 && (
          <div className={styles.mediaSlider_controls}>
            <button
              className={`${styles.mediaSlider_controls_arrow} ${styles.mediaSlider_controls_arrow_prev}`}
              onClick={handlePrevSlide}
              aria-label="Go to the previous slide"
            >
              <i className={styles.mediaSlider_controls_icon}>
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.876364 10L0.00363632 9.11909L4.09273 5.00091L0 0.881818L0.874545 0L5.83091 4.99182L0.876364 10Z"
                    fill="currentColor"
                  />
                </svg>
              </i>
            </button>

            <div className={styles.mediaSlider_controls_count}>
              {currentIndex + 1} / {media.length}
            </div>

            <button
              className={`${styles.mediaSlider_controls_arrow} ${styles.mediaSlider_controls_arrow_next}`}
              onClick={handleNextSlide}
              aria-label="Go to the next slide"
            >
              <i className={styles.mediaSlider_controls_icon}>
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.876364 10L0.00363632 9.11909L4.09273 5.00091L0 0.881818L0.874545 0L5.83091 4.99182L0.876364 10Z"
                    fill="currentColor"
                  />
                </svg>
              </i>
            </button>
          </div>
        )}

        {/* Thumbnail Navigation*/}
        {/* {media.length > 1 && (
          <div className={styles.mediaSlider_thumbnails}>
            {media.map((item, index) => (
              <button
                key={item.id}
                className={`${styles.mediaSlider_thumbnails_item} ${
                  index === currentIndex ? styles.mediaSlider_thumbnails_item_active : ''
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  pauseAllVideos();
                }}
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className={styles.mediaSlider_thumbnails_media}>
                  {isVideo(item) ? (
                    <div className={styles.mediaSlider_thumbnails_video}>
                      <Image
                        src={item.attributes.previewUrl || item.attributes.url}
                        width={60}
                        height={40}
                        alt={item.attributes.alternativeText || item.attributes.name}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.mediaSlider_thumbnails_playIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.attributes.url}
                      width={60}
                      height={40}
                      alt={item.attributes.alternativeText || item.attributes.name}
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        )} */}

        {isExpanded && (
          <div className={styles.mediaSlider_popup} onClick={handleExpand}>
            <div
              className={styles.mediaSlider_popup_content}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.mediaSlider_popup_close}
                onClick={handleExpand}
                aria-label="Close popup"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className={styles.mediaSlider_popup_media}>
                {isVideo(currentItem) ? (
                  <video
                    className={styles.mediaSlider_popup_video}
                    controls
                    autoPlay
                    muted
                    loop
                    poster={currentItem.attributes.previewUrl || undefined}
                  >
                    <source
                      src={currentItem.attributes.url}
                      type={currentItem.attributes.mime}
                    />
                  </video>
                ) : (
                  <Image
                    src={currentItem.attributes.url}
                    width={currentItem.attributes.width}
                    height={currentItem.attributes.height}
                    alt={
                      currentItem.attributes.alternativeText ||
                      currentItem.attributes.name
                    }
                    className={`${styles.mediaSlider_popup_image} ${isPNG(currentItem) ? 'transparent' : ''}`}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>

              {/* Navigation in popup */}
              {media.length > 1 && (
                <div className={styles.mediaSlider_popup_navigation}>
                  <button
                    className={styles.mediaSlider_popup_nav_arrow}
                    onClick={handlePrevSlide}
                    aria-label="Previous"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>

                  <span className={styles.mediaSlider_popup_counter}>
                    {currentIndex + 1} / {media.length}
                  </span>

                  <button
                    className={styles.mediaSlider_popup_nav_arrow}
                    onClick={handleNextSlide}
                    aria-label="Next"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSlider;
