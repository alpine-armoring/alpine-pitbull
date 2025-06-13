import Link from 'next/link';
import styles from './Header.module.scss';
import Menu from '@/components/menu/Menu';

const header = () => {
  return (
    <header className={`${styles.header} container`}>
      {/* <nav className={`${styles.navigation}`}>
        <Link href="/configurator">Vehicle Configurator</Link>
      </nav> */}
      <Link href="/" className={`${styles.header_logo}`}>
        Alpine Armoring
      </Link>
      <Menu
        defaultPreviewImage="http://localhost:3000/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_tactical_features_button_image_6e23a07a4d.jpg&w=1024&q=90"
        menuLinks={[
          {
            href: '/vehicles/armored-vx',
            text: 'VX',
            imgSrc:
              'http://localhost:3000/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_VX_4b724134d4.jpg&w=1024&q=90',
          },
          {
            href: '/vehicles/armored-vxt',
            text: 'VXT',
            imgSrc:
              'http://localhost:3000/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_VXT_cover_ef2eb9c8b9.jpg&w=1920&q=90',
          },
        ]}
        socialLinks={[
          {
            href: '/vehicles/armored-vx',
            text: 'Tactical Features and Customizations',
          },
          {
            href: '/vehicles/armored-vxt',
            text: 'History of Alpine Armoring Pit-Bull',
          },
          {
            href: '/vehicles/armored-vxt',
            text: 'Testing and Certification',
          },
          {
            href: '/vehicles/armored-vxt',
            text: 'Contact Us',
          },
        ]}
      />
    </header>
  );
};

export default header;
