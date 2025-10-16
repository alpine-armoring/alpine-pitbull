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
import PhoneIcon from 'components/icons/Phone';
import MailIcon from 'components/icons/Mail';
import MapIcon from 'components/icons/Map';

const Footer = () => {
  return (
    <footer className={`${styles.footer} container`}>
      <div className={`${styles.footer_column}`}>
        <Link href="/" className={`${styles.footer_logo}`}>
          <Image
            src="/images/alpine-pitbull-logo.svg"
            alt="Pit-Bull® Logo"
            width={130}
            height={94}
            quality={100}
          ></Image>
        </Link>

        <Link
          href="tel:+17034710002"
          className={`${styles.menuContent_contact_item}`}
          rel="nofollow noreferrer noopener"
        >
          <PhoneIcon />
          1.703.471.0002
        </Link>

        <Link
          href="mailto:pit-bull@alpineco.com"
          className={`${styles.menuContent_contact_item}`}
          rel="nofollow noreferrer noopener"
        >
          <MailIcon />
          pit-bull@alpineco.com
        </Link>

        <div className={`${styles.menuContent_contact_item}`}>
          <MapIcon />
          Chantilly, Virginia, USA
        </div>
      </div>

      <div className={`${styles.footer_navigation}`}>
        <div className={`${styles.footer_navigation_column}`}>
          <p>Models</p>
          <ul>
            <li>
              <Link href="/vehicles/armored-vx">Pit-Bull® VX</Link>
            </li>
            <li>
              <Link href="/vehicles/armored-vxt">Pit-Bull® VXT</Link>
            </li>
          </ul>
        </div>
        <div className={`${styles.footer_navigation_column}`}>
          <p>Quick Links</p>
          <ul>
            <li>
              <Link href="/inventory">Available Now</Link>
            </li>
            <li>
              <Link href="/history">History of Pit-Bull®</Link>
            </li>
            <li>
              <Link href="/tactical-features">
                Tactical Features and Customizations
              </Link>
            </li>
            <li>
              <Link href="/ballistic-chart">Weapons and Ammunition Chart</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
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
            href="https://www.instagram.com/pitbullvehicles/"
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

      <Link
        className={`${styles.footer_alpineco}`}
        href="https://www.alpineco.com/"
        target="_blank"
      >
        <img
          src="/images/Alpineco-Logo.jpg"
          width="70"
          height="107"
          alt="alpineco.com"
        />
      </Link>

      <p className={`${styles.footer_copy}`}>
        ©2025. Pit-Bull® is a Registered Trademark of Alpine Armoring Inc. All
        Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
