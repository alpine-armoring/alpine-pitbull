'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error-page.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorPage_content}>
        <h1 className={styles.errorPage_errorCode}>500</h1>
        <h2 className={styles.errorPage_title}>Something Went Wrong</h2>
        <p className={styles.errorPage_description}>
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>
        <div className={styles.errorPage_actions}>
          <button onClick={reset} className={styles.errorPage_button}>
            Try Again
          </button>
          <Link href="/" className={styles.errorPage_buttonSecondary}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
