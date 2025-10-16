'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Menu.module.scss';
import Link from 'next/link';
import FacebookIcon from 'components/icons/Facebook';
import TiktokIcon from 'components/icons/Tiktok';
import XIcon from 'components/icons/X';
import InstagramIcon from 'components/icons/Instagram';
import YoutubeIcon from 'components/icons/Youtube';
import LinkedinIcon from 'components/icons/Linkedin';
import MailIcon from 'components/icons/Mail';
import MapIcon from 'components/icons/Map';
import PhoneIcon from 'components/icons/Phone';
import ThreadsIcon from 'components/icons/Threads';

interface MenuLink {
  href: string;
  text: string;
  imgSrc: string;
  isVideo?: boolean;
}

interface SocialLink {
  href: string;
  text: string;
}

interface OverlayMenuProps {
  logoText?: string;
  logoHref?: string;
  menuLinks?: MenuLink[];
  socialLinks?: SocialLink[];
  footerLinks?: {
    left: { href: string; text: string };
    right: Array<{ href: string; text: string }>;
  };
  heroTitle?: string;
  heroImage?: string;
  defaultPreviewImage?: string;
  defaultPreviewIsVideo?: boolean;
  previewWidth?: number;
  previewHeight?: number;
}

const OverlayMenu: React.FC<OverlayMenuProps> = ({
  defaultPreviewImage,
  defaultPreviewIsVideo = false,
  previewWidth,
  previewHeight,
  menuLinks,
  socialLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuPreviewImgRef = useRef<HTMLAnchorElement>(null);
  const menuOpenRef = useRef<HTMLParagraphElement>(null);
  const menuCloseRef = useRef<HTMLParagraphElement>(null);

  const cleanupPreviewMedia = () => {
    if (!menuPreviewImgRef.current) return;

    const previewMedia =
      menuPreviewImgRef.current.querySelectorAll('img, video');
    if (previewMedia.length > 3) {
      for (let i = 0; i < previewMedia.length - 3; i++) {
        menuPreviewImgRef.current.removeChild(previewMedia[i]);
      }
    }
  };

  const resetPreviewImage = useCallback(() => {
    if (!menuPreviewImgRef.current) return;

    menuPreviewImgRef.current.innerHTML = '';

    if (defaultPreviewIsVideo) {
      const defaultVideo = document.createElement('video');
      defaultVideo.src = defaultPreviewImage || '';
      defaultVideo.muted = true;
      defaultVideo.autoplay = true;
      defaultVideo.loop = true;
      defaultVideo.playsInline = true;
      if (previewWidth) defaultVideo.style.width = `${previewWidth}px`;
      if (previewHeight) defaultVideo.style.height = `${previewHeight}px`;
      menuPreviewImgRef.current.appendChild(defaultVideo);
    } else {
      const defaultImg = document.createElement('img');
      defaultImg.src = defaultPreviewImage || '';
      defaultImg.alt = '';
      // if (previewWidth) defaultImg.style.width = `${previewWidth}px`;
      // if (previewHeight) defaultImg.style.height = `${previewHeight}px`;
      menuPreviewImgRef.current.appendChild(defaultImg);
    }
  }, [defaultPreviewImage, defaultPreviewIsVideo, previewWidth, previewHeight]);

  const animateMenuToggle = (isOpening: boolean) => {
    if (!menuOpenRef.current || !menuCloseRef.current) return;

    const open = menuOpenRef.current;
    const close = menuCloseRef.current;

    gsap.to(isOpening ? open : close, {
      x: -5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      delay: 0.1,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.to(isOpening ? close : open, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const openMenu = () => {
    if (isAnimating || isOpen) return;
    setIsAnimating(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1,
        ease: 'power4.inOut',
      });
    }

    animateMenuToggle(true);

    if (menuContentRef.current) {
      gsap.to(menuContentRef.current, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power4.inOut',
      });
    }

    gsap.to([`.${styles.link} a`, `.${styles.social} a`], {
      y: '0%',
      delay: 0.5,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
    });

    if (menuOverlayRef.current) {
      gsap.to(menuOverlayRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)',
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
        },
      });
    }
  };

  const closeMenu = () => {
    if (isAnimating || !isOpen) return;
    setIsAnimating(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power4.inOut',
      });
    }

    animateMenuToggle(false);

    if (menuContentRef.current) {
      gsap.to(menuContentRef.current, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        duration: 1,
        ease: 'power4.inOut',
      });
    }

    if (menuOverlayRef.current) {
      gsap.to(menuOverlayRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
          gsap.set([`.${styles.link} a`, `.${styles.social} a`], { y: '120%' });
          resetPreviewImage();
        },
      });
    }
  };

  const handleMenuToggle = () => {
    if (!isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  const handleLinkHover = (imgSrc: string, isVideo = false) => {
    if (!isOpen || isAnimating || !menuPreviewImgRef.current) return;

    const previewMedia =
      menuPreviewImgRef.current.querySelectorAll('img, video');
    if (previewMedia.length > 0) {
      const lastMedia = previewMedia[previewMedia.length - 1] as
        | HTMLImageElement
        | HTMLVideoElement;
      if (lastMedia.src.endsWith(imgSrc)) {
        return;
      }
    }

    let newPreviewElement: HTMLImageElement | HTMLVideoElement;

    if (isVideo) {
      const newPreviewVideo = document.createElement('video');
      newPreviewVideo.src = imgSrc;
      newPreviewVideo.muted = true;
      newPreviewVideo.autoplay = true;
      newPreviewVideo.loop = true;
      newPreviewVideo.playsInline = true;
      if (previewWidth) newPreviewVideo.style.width = `${previewWidth}px`;
      if (previewHeight) newPreviewVideo.style.height = `${previewHeight}px`;
      newPreviewElement = newPreviewVideo;
    } else {
      const newPreviewImg = document.createElement('img');
      newPreviewImg.src = imgSrc;
      newPreviewImg.alt = '';
      if (previewWidth) newPreviewImg.style.width = `${previewWidth}px`;
      if (previewHeight) newPreviewImg.style.height = `${previewHeight}px`;
      newPreviewElement = newPreviewImg;
    }

    newPreviewElement.style.opacity = '0';
    newPreviewElement.style.transform = 'scale(1.25) rotate(10deg)';

    menuPreviewImgRef.current.appendChild(newPreviewElement);
    cleanupPreviewMedia();

    gsap.to(newPreviewElement, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: 'power2.out',
    });
  };

  const handleDefaultPreviewHover = () => {
    if (
      !isOpen ||
      isAnimating ||
      !defaultPreviewImage ||
      !menuPreviewImgRef.current
    )
      return;

    const hasVideos = menuPreviewImgRef.current.querySelector('video');
    const currentImg = menuPreviewImgRef.current.querySelector(
      'img'
    ) as HTMLImageElement;

    // If we have videos and default is image, always clear and show default image
    if (hasVideos && !defaultPreviewIsVideo) {
      // Clear videos and show default image
      menuPreviewImgRef.current.innerHTML = '';
    }
    // If we have videos and default is also video, check if it's the same
    else if (hasVideos && defaultPreviewIsVideo) {
      const currentVideo = menuPreviewImgRef.current.querySelector(
        'video'
      ) as HTMLVideoElement;
      if (currentVideo && currentVideo.src.endsWith(defaultPreviewImage)) {
        return; // Same video already showing
      }
      menuPreviewImgRef.current.innerHTML = '';
    }
    // If we have image and default is image, check if it's the same
    else if (currentImg && !defaultPreviewIsVideo) {
      if (currentImg.src.endsWith(defaultPreviewImage)) {
        return; // Same image already showing
      }
      menuPreviewImgRef.current.innerHTML = '';
    }
    // If we have image and default is video, clear and show video
    else if (currentImg && defaultPreviewIsVideo) {
      menuPreviewImgRef.current.innerHTML = '';
    }
    // If no current media, use resetPreviewImage for initial state
    else if (!hasVideos && !currentImg) {
      resetPreviewImage();
      return;
    }

    let defaultElement: HTMLImageElement | HTMLVideoElement;

    if (defaultPreviewIsVideo) {
      const defaultVideo = document.createElement('video');
      defaultVideo.src = defaultPreviewImage;
      defaultVideo.muted = true;
      defaultVideo.autoplay = true;
      defaultVideo.loop = true;
      defaultVideo.playsInline = true;
      if (previewWidth) defaultVideo.style.width = `${previewWidth}px`;
      if (previewHeight) defaultVideo.style.height = `${previewHeight}px`;
      defaultElement = defaultVideo;
    } else {
      const defaultImg = document.createElement('img');
      defaultImg.src = defaultPreviewImage;
      defaultImg.alt = '';
      if (previewWidth) defaultImg.style.width = `${previewWidth}px`;
      if (previewHeight) defaultImg.style.height = `${previewHeight}px`;
      defaultElement = defaultImg;
    }

    defaultElement.style.opacity = '0';
    defaultElement.style.transform = 'scale(1.25) rotate(10deg)';

    menuPreviewImgRef.current.appendChild(defaultElement);

    gsap.to(defaultElement, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: 'power2.out',
    });
  };

  useEffect(() => {
    resetPreviewImage();
  }, [resetPreviewImage]);

  return (
    <>
      <nav className={styles.nav}>
        <div
          className={styles.menuToggle}
          ref={menuToggleRef}
          onClick={handleMenuToggle}
        >
          <p
            ref={menuOpenRef}
            className={`${styles.menuToggle_open} ${styles.menuToggle_button}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              strokeWidth="2"
            >
              <path d="M38.09 26H1.91M1.91 14h36.18"></path>
            </svg>
            Menu
          </p>
          <p
            ref={menuCloseRef}
            className={`${styles.menuToggle_close} ${styles.menuToggle_button}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              strokeWidth="2"
            >
              <path d="M32.79 7.15 7.21 32.74M7.21 7.15l25.58 25.59"></path>
            </svg>
            Close
          </p>
        </div>
      </nav>

      <div className={styles.menuOverlay} ref={menuOverlayRef}>
        <div className={styles.menuContent} ref={menuContentRef}>
          <div className={styles.menuItems}>
            <div className={styles.menuItems_colLg}>
              <Link
                href="/"
                className={styles.menuPreviewImg}
                ref={menuPreviewImgRef}
                onClick={closeMenu}
              >
                {/* Preview media will be dynamically inserted here */}
              </Link>
            </div>
            <div className={styles.menuItems_colSm}>
              <div className={styles.menuLinks}>
                {menuLinks && menuLinks.length > 0 ? (
                  menuLinks.map((link, index) => (
                    <div key={index} className={styles.link}>
                      <Link
                        href={link.href}
                        onMouseOver={() =>
                          handleLinkHover(link.imgSrc, link.isVideo)
                        }
                        onClick={closeMenu}
                      >
                        {link.text}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className={styles.link}>
                    <Link href="#">No menu items</Link>
                  </div>
                )}
              </div>

              <div className={styles.menuSocials}>
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((social, index) => (
                    <div key={index} className={styles.social}>
                      <Link
                        href={social.href}
                        onClick={closeMenu}
                        onMouseOver={handleDefaultPreviewHover}
                      >
                        {social.text}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className={styles.social}>
                    <Link href="#">No social links</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <div className={styles.menuFooter}>
            <div className={styles.menuFooter_colLg}>
              <a href={footerLinks.left.href}>{footerLinks.left.text}</a>
            </div>
            <div className={styles.menuFooter_colSm}>
              {footerLinks.right.map((link, index) => (
                <a key={index} href={link.href}>{link.text}</a>
              ))}
            </div>
          </div> */}
        </div>

        <div className={`${styles.menuContent_info}`}>
          <div className={`${styles.menuContent_contact}`}>
            <Link
              href="tel:+17034710002"
              className={`${styles.menuContent_contact_item}`}
              rel="nofollow noreferrer noopener"
              onMouseOver={handleDefaultPreviewHover}
            >
              <PhoneIcon />
              1.703.471.0002
            </Link>
            <Link
              href="mailto:pit-bull@alpineco.com"
              className={`${styles.menuContent_contact_item}`}
              rel="nofollow noreferrer noopener"
              onMouseOver={handleDefaultPreviewHover}
            >
              <MailIcon />
              Pit-Bull@AlpineCo.com
            </Link>

            <div
              className={`${styles.menuContent_contact_item}`}
              onMouseOver={handleDefaultPreviewHover}
            >
              <MapIcon />
              Chantilly, Virginia, USA
            </div>
          </div>

          <ul className={`${styles.menuContent_socials}`}>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.youtube.com/c/AlpineArmoring"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <YoutubeIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.instagram.com/pitbullvehicles/"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <InstagramIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.menuContent_socials_item} ${styles.menuContent_socials_item_x}`}
            >
              <Link
                href="https://x.com/AlpineArmoring"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <XIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.facebook.com/AlpineArmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <FacebookIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.menuContent_socials_item} ${styles.menuContent_socials_item_tiktok}`}
            >
              <Link
                href="https://www.tiktok.com/@alpinearmoring"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <TiktokIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.linkedin.com/company/alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <LinkedinIcon color="white" />
              </Link>
            </li>
            <li
              className={`${styles.menuContent_socials_item} ${styles.menuContent_socials_item_threads}`}
            >
              <Link
                href="https://www.threads.net/@alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
                onMouseOver={handleDefaultPreviewHover}
              >
                <ThreadsIcon color="white" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default OverlayMenu;
