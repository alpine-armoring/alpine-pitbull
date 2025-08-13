'use client';
import Link from 'next/link';
import styles from './Header.module.scss';
import Menu from '@/components/menu/Menu';
import Image from 'next/image';

const Header = () => {
  return (
    <header className={`${styles.header}`}>
      {/* <nav className={`${styles.navigation}`}>
        <Link href="/configurator">Vehicle Configurator</Link>
      </nav> */}

      <Link href="/" className={`${styles.header_logo}`}>
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </Link>

      {/* <Link
        href="/vehicles/armored-vx"
        className={`${styles.header_logo}`}
      >
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </Link> */}

      <Menu
        defaultPreviewImage="https://alpine-pitbull.vercel.app/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_tactical_features_button_image_6e23a07a4d.jpg&w=1024&q=90"
        menuLinks={[
          {
            href: '/vehicles/armored-vx',
            text: 'VX',
            imgSrc:
              'https://alpine-pitbull.vercel.app/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_VX_4b724134d4.jpg&w=1024&q=90',
          },
          {
            href: '/vehicles/armored-vxt',
            text: 'VXT',
            imgSrc:
              'https://alpine-pitbull.vercel.app/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_VXT_cover_ef2eb9c8b9.jpg&w=1920&q=90',
          },
        ]}
        socialLinks={[
          {
            href: '/about#features',
            text: 'Tactical Features and Customizations',
          },
          {
            href: '/about#history',
            text: 'History of Alpine Armoring Pit-Bull',
          },
          {
            href: '/about#testing',
            text: 'Testing and Certification',
          },
          {
            href: '/contact',
            text: 'Contact Us',
          },
        ]}
      />
    </header>
  );
};

export default Header;
