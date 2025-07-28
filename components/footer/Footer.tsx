'use client';
import TransitionLink from '@/components/TransitionLink';
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
      <TransitionLink href="/" className={`${styles.footer_logo}`}>
        <Image
          src="/images/alpine-pitbull-logo.svg"
          alt="Alpine Armoring Pitbull Logo"
          width={50}
          height={60}
          quality={100}
        ></Image>
      </TransitionLink>

      <ul className={`${styles.footer_socials}`}>
        <li className={`${styles.footer_socials_item}`}>
          <TransitionLink
            href="https://www.youtube.com/c/AlpineArmoring"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <YoutubeIcon color="white" />
          </TransitionLink>
        </li>
        <li className={`${styles.footer_socials_item}`}>
          <TransitionLink
            href="https://www.instagram.com/alpinearmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <InstagramIcon color="white" />
          </TransitionLink>
        </li>
        <li
          className={`${styles.footer_socials_item} ${styles.footer_socials_item_x}`}
        >
          <TransitionLink
            href="https://x.com/AlpineArmoring"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <XIcon color="white" />
          </TransitionLink>
        </li>
        <li className={`${styles.footer_socials_item}`}>
          <TransitionLink
            href="https://www.facebook.com/AlpineArmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <FacebookIcon color="white" />
          </TransitionLink>
        </li>
        <li
          className={`${styles.footer_socials_item} ${styles.footer_socials_item_tiktok}`}
        >
          <TransitionLink
            href="https://www.tiktok.com/@alpinearmoring"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <TiktokIcon color="white" />
          </TransitionLink>
        </li>
        <li className={`${styles.footer_socials_item}`}>
          <TransitionLink
            href="https://www.linkedin.com/company/alpinearmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <LinkedinIcon color="white" />
          </TransitionLink>
        </li>
        <li
          className={`${styles.footer_socials_item} ${styles.footer_socials_item_threads}`}
        >
          <TransitionLink
            href="https://www.threads.net/@alpinearmoring/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            <ThreadsIcon color="white" />
          </TransitionLink>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
