import InstagramPost from './InstagramPost';
import styles from './InstagramFeed.module.scss';

export default function InstagramFeed({ posts, title = 'ALPINE Live' }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.instagramFeed_container} container_small`}>
      <h2 className={`${styles.instagramFeed_title} c-title`}>{title}</h2>
      <div className={styles.instagramFeed_list}>
        {posts.slice(0, 6).map((post) => (
          <InstagramPost key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
