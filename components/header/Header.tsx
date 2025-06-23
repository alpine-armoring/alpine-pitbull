'use client';
// import { useTransitionRouter } from 'next-view-transitions';
import { Link } from 'next-transition-router';

// import Link from 'next/link';
import styles from './Header.module.scss';
import Menu from '@/components/menu/Menu';
import Image from 'next/image';

const Header = () => {
  // const router = useTransitionRouter();

  // function slideInOut() {

  //   document.documentElement.animate(
  //     [
  //       {
  //         opacity: 1,
  //         transform: 'translateY(0)',
  //       },
  //       {
  //         opacity: 0.2,
  //         transform: 'translateY(-35%)',
  //       },
  //     ],
  //     {
  //       duration: 1300,
  //       easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
  //       fill: 'forwards',
  //       pseudoElement: '::view-transition-old(root)',
  //     }
  //   );

  //   document.documentElement.animate(
  //     [
  //       {
  //         clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
  //       },
  //       {
  //         clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
  //       },
  //     ],
  //     {
  //       duration: 1300,
  //       easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
  //       fill: 'forwards',
  //       pseudoElement: '::view-transition-new(root)',
  //     }
  //   );
  // }

  return (
    <header className={`${styles.header} container`}>
      {/* <nav className={`${styles.navigation}`}>
        <Link href="/configurator">Vehicle Configurator</Link>
      </nav> */}
      <Link
        href="/"
        className={`${styles.header_logo}`}
        // onClick={(e) => {
        //   e.preventDefault();
        //   router.push(`/`, {
        //     onTransitionReady: slideInOut,
        //   });
        // }}
      >
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </Link>
      <Link
        href="/vehicles/armored-vx"
        className={`${styles.header_logo}`}
        // onClick={(e) => {
        //   e.preventDefault();
        //   router.push(`/vehicles/armored-vx`, {
        //     onTransitionReady: slideInOut,
        //   });
        // }}
      >
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </Link>
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

export default Header;
