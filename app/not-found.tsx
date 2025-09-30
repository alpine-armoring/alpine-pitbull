import Link from 'next/link';
import styles from './error-page.module.scss';

export default function NotFound() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPage_content}>
        <h1 className={styles.errorPage_errorCode}>404</h1>
        <h2 className={styles.errorPage_title}>Page Not Found</h2>
        <p className={styles.errorPage_description}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className={styles.errorPage_button}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
