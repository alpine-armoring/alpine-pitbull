import Link from 'next/link';
import styles from './Header.module.scss';

const header = () => {
  return (
    <header className={`${styles.header} container`}>
      <Link href="/configurator">Vehicle Configurator</Link>
    </header>
  );
};

export default header;
