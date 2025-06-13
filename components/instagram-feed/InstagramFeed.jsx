import InstagramPost from './InstagramPost';
import styles from './InstagramFeed.module.scss';

export default function InstagramFeed({ posts, title = "Latest from Instagram" }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.instagramFeed}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {title}
        </h2>
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <InstagramPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}