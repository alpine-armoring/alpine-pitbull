'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Menu from '@/components/menu/Menu';
import Image from 'next/image';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.header_scrolled : ''}`}
    >
      <Link href="/" className={`${styles.header_logo}`}>
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </Link>

      <Menu
        defaultPreviewImage="/images/alpine-pitbull-logo.svg"
        previewWidth={280}
        previewHeight={329}
        menuLinks={[
          {
            href: '/vehicles/armored-vx',
            text: 'Pit-Bull® VX',
            imgSrc:
              'https://d102sycao8uwt8.cloudfront.net/VX_vehicle_page_main_7_28_f47aecba3d.mp4',
            isVideo: true,
          },
          {
            href: '/vehicles/armored-vxt',
            text: 'Pit-Bull® VXT',
            imgSrc:
              'https://d102sycao8uwt8.cloudfront.net/VXT_header_9_2_b8260edd5e.mp4',
            isVideo: true,
          },
        ]}
        socialLinks={[
          {
            href: '/history',
            text: 'History of Alpine Armoring Pit-Bull®',
          },
          {
            href: '/tactical-features',
            text: 'Tactical Features and Customizations',
          },
          {
            href: '/ballistic-chart',
            text: 'Weapons and Ammunition Chart',
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
