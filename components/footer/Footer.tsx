'use client';
import Link from 'next/link';
import styles from './Footer.module.scss';
import Image from 'next/image';
import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import LinkedinIcon from 'components/icons/Linkedin';
import ThreadsIcon from 'components/icons/Threads';

const Footer = () => {
  return (
    <footer className={`${styles.footer} container`}>
      <Link href="/" className={`${styles.footer_logo}`}>
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </Link>

      <div className={`${styles.footer_navigation}`}>
        <div className={`${styles.footer_navigation_column}`}>
          <p>Available</p>
          <ul>
            <li>
              <Link href="/">VX</Link>
            </li>
            <li>
              <Link href="/">VXT</Link>
            </li>
          </ul>
        </div>
        <div className={`${styles.footer_navigation_column}`}>
          <p>Quick Links</p>
          <ul>
            <li>
              <Link href="/">History of Alpine Armoring Pit-Bull</Link>
            </li>
            <li>
              <Link href="/">Tactical Features and Customizations</Link>
            </li>
            <li>
              <Link href="/">Testing and Certification</Link>
            </li>
            <li>
              <Link href="/">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>

      <ul className={`${styles.footer_socials}`}>
        <li className={`${styles.footer_socials_item}`}>
          <Link
            href="https://www.youtube.com/c/AlpineArmoring"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <YoutubeIcon color="white" />
          </Link>
        </li>
        <li className={`${styles.footer_socials_item}`}>
          <Link
            href="https://www.instagram.com/alpinearmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <InstagramIcon color="white" />
          </Link>
        </li>
        <li
          className={`${styles.footer_socials_item} ${styles.footer_socials_item_x}`}
        >
          <Link
            href="https://x.com/AlpineArmoring"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <XIcon color="white" />
          </Link>
        </li>
        <li className={`${styles.footer_socials_item}`}>
          <Link
            href="https://www.facebook.com/AlpineArmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <FacebookIcon color="white" />
          </Link>
        </li>
        <li
          className={`${styles.footer_socials_item} ${styles.footer_socials_item_tiktok}`}
        >
          <Link
            href="https://www.tiktok.com/@alpinearmoring"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <TiktokIcon color="white" />
          </Link>
        </li>
        <li className={`${styles.footer_socials_item}`}>
          <Link
            href="https://www.linkedin.com/company/alpinearmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <LinkedinIcon color="white" />
          </Link>
        </li>
        <li
          className={`${styles.footer_socials_item} ${styles.footer_socials_item_threads}`}
        >
          <Link
            href="https://www.threads.net/@alpinearmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <ThreadsIcon color="white" />
          </Link>
        </li>
      </ul>

      <p className={`${styles.footer_copy}`}>
        ©2025. Pit-Bull® is a Registered Trademark of Alpine Armoring Inc. All
        Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
