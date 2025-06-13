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
                <div className={styles.playIcon}>
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
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

      {post.caption && (
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
      )}
    </div>
  );
}
