'use client';

import { useEffect, useRef, useState } from 'react';
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
}

const OverlayMenu: React.FC<OverlayMenuProps> = ({
  defaultPreviewImage,
  menuLinks,
  socialLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLDivElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuPreviewImgRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef<HTMLParagraphElement>(null);
  const menuCloseRef = useRef<HTMLParagraphElement>(null);

  const cleanupPreviewImages = () => {
    if (!menuPreviewImgRef.current) return;

    const previewImages = menuPreviewImgRef.current.querySelectorAll('img');
    if (previewImages.length > 3) {
      for (let i = 0; i < previewImages.length - 3; i++) {
        menuPreviewImgRef.current.removeChild(previewImages[i]);
      }
    }
  };

  const resetPreviewImage = () => {
    if (!menuPreviewImgRef.current) return;

    menuPreviewImgRef.current.innerHTML = '';
    const defaultImg = document.createElement('img');
    defaultImg.src = defaultPreviewImage || '/img-1.jpg'; // Add fallback
    defaultImg.alt = '';
    menuPreviewImgRef.current.appendChild(defaultImg);
  };

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
      delay: 0.75,
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

  const handleLinkHover = (imgSrc: string) => {
    if (!isOpen || isAnimating || !menuPreviewImgRef.current) return;

    const previewImages = menuPreviewImgRef.current.querySelectorAll('img');
    if (
      previewImages.length > 0 &&
      (
        previewImages[previewImages.length - 1] as HTMLImageElement
      ).src.endsWith(imgSrc)
    ) {
      return;
    }

    const newPreviewImg = document.createElement('img');
    newPreviewImg.src = imgSrc;
    newPreviewImg.alt = '';
    newPreviewImg.style.opacity = '0';
    newPreviewImg.style.transform = 'scale(1.25) rotate(10deg)';

    menuPreviewImgRef.current.appendChild(newPreviewImg);
    cleanupPreviewImages();

    gsap.to(newPreviewImg, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: 'power2.out',
    });
  };

  useEffect(() => {
    resetPreviewImage();
  }, [defaultPreviewImage]);

  return (
    <>
      <nav className={styles.nav}>
        <div
          className={styles.menuToggle}
          ref={menuToggleRef}
          onClick={handleMenuToggle}
        >
          <p ref={menuOpenRef}>Menu</p>
          <p ref={menuCloseRef} className={styles.menuToggle_close}>
            Close
          </p>
        </div>
      </nav>

      <div className={styles.menuOverlay} ref={menuOverlayRef}>
        <div className={styles.menuContent} ref={menuContentRef}>
          <div className={styles.menuItems}>
            <div className={styles.menuItems_colLg}>
              <div className={styles.menuPreviewImg} ref={menuPreviewImgRef}>
                <img src={defaultPreviewImage} alt="" />
                video
              </div>
            </div>
            <div className={styles.menuItems_colSm}>
              <div className={styles.menuLinks}>
                {menuLinks && menuLinks.length > 0 ? (
                  menuLinks.map((link, index) => (
                    <div key={index} className={styles.link}>
                      <a
                        href={link.href}
                        onMouseOver={() => handleLinkHover(link.imgSrc)}
                      >
                        {link.text}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className={styles.link}>
                    <a href="#">No menu items</a>
                  </div>
                )}
              </div>

              <div className={styles.menuSocials}>
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((social, index) => (
                    <div key={index} className={styles.social}>
                      <a href={social.href}>{social.text}</a>
                    </div>
                  ))
                ) : (
                  <div className={styles.social}>
                    <a href="#">No social links</a>
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
            >
              <PhoneIcon />
              1.703.471.0002
            </Link>
            <Link
              href="mailto:info@alpineco.com"
              className={`${styles.menuContent_contact_item}`}
              rel="nofollow noreferrer noopener"
            >
              <MailIcon />
              info@AlpineCo.com
            </Link>

            <div className={`${styles.menuContent_contact_item}`}>
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
              >
                <YoutubeIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.instagram.com/alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
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
              >
                <XIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.facebook.com/AlpineArmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
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
              >
                <TiktokIcon color="white" />
              </Link>
            </li>
            <li className={`${styles.menuContent_socials_item}`}>
              <Link
                href="https://www.linkedin.com/company/alpinearmoring/"
                target="_blank"
                rel="nofollow noreferrer noopener"
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
