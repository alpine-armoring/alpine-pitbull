import Link from 'next/link';
import styles from './Header.module.scss';

const header = () => {
  return (
    <header className={`${styles.header} container`}>
      <nav className={`${styles.navigation}`}>
        <Link href="/configurator">Vehicle Configurator</Link>
      </nav>
      <Link href="/" className={`${styles.header_logo}`}>
        Alpine Armoring
      </Link>
    </header>
  );
};

export default header;
