'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './InstagramPost.module.scss';

export default function InstagramPost({ post }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowVideo(false);
  };

  const isVideo = post.media_type === 'VIDEO';
  const displayImage = isVideo ? post.thumbnail_url : post.media_url;
  // console.log(post)
  return (
    <div className={styles.instagramPost}>
      <div className={styles.imageContainer}>
        {!showVideo ? (
          <>
            <Image
              src={displayImage}
              alt={post.caption?.substring(0, 50) || 'Instagram post'}
              fill
              className={styles.postImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {isVideo && (
              <button
                onClick={handlePlayClick}
                className={styles.playButton}
                aria-label="Play video"
              >
                <svg
                  className={styles.playIcon}
                  aria-hidden="true"
                  viewBox="0 0 60 60"
                >
                  <path
                    fill="currentColor"
                    d="m24 0c-13.26 0-24 10.74-24 24s10.74 24 24 24 24-10.74 24-24-10.74-24-24-24zm-4.8 34.8v-21.6l14.4 10.8z"
                    transform="translate(6 6)"
                  ></path>
                </svg>
              </button>
            )}
          </>
        ) : (
          <video
            src={post.media_url}
            controls
            autoPlay
            className={styles.video}
            onEnded={handleVideoEnd}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* {post.caption && (
        <div className={styles.caption}>
          <p className={styles.captionText}>{post.caption}</p>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramLink}
          >
            View on Instagram
          </a>
        </div>
      )} */}
    </div>
  );
}
