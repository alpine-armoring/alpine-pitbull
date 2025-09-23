'use client';
import VideoSingle from './SocialPostItem';
import styles from './SocialFeed.module.scss';

const VideoFeed = ({ videos }) => {
  return (
    <div className={`${styles.social_feed} container_small`}>
      <h2 className="c-title">Pit-Bull® Socials</h2>
      <div className={`${styles.social_feed_wrap} m1`}>
        {videos.map((video, index) => (
          <VideoSingle key={index} props={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
