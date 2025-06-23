'use client';
import { useTransitionRouter } from 'next-view-transitions';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ColumnsList.module.scss';

const ColumnsList = (props) => {
  const router = useTransitionRouter();

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: 'translateY(0)',
        },
        {
          opacity: 0.2,
          transform: 'translateY(-35%)',
        },
      ],
      {
        duration: 1500,
        easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-old(root)',
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        },
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        },
      ],
      {
        duration: 1500,
        easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }

  const { className, items, title, description } = props;
  const classNames = className ? className.split(' ') : [];
  const moduleClasses = classNames
    .map((cls) => styles[cls])
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`container ${className || ''} ${styles.columnsList_wrapper}`}
    >
      <div className={`c-content`}>
        {title && <h2 className={`c-title`}>{title}</h2>}
        {description && <p className={`c-description`}>{description}</p>}
      </div>

      <div className={`${styles.columnsList_container} ${moduleClasses}`}>
        {items?.map((item, index) => (
          <Link
            onClick={(e) => {
              e.preventDefault();
              router.push(`/${item.link}`, {
                onTransitionReady: slideInOut,
              });
            }}
            href={`/${item.link}`}
            className={`${styles.columnsList_item}`}
            key={index}
          >
            {item.image && (
              <Image
                src={item.image.formats?.large?.url || item.image.url}
                alt={item.image.alternativeText || 'Alpine Armoring'}
                width={item.image.formats?.large?.width || item.image.width}
                height={item.image.formats?.large?.height || item.image.height}
                className={`${styles.columnsList_item_image}`}
                quality={90}
              ></Image>
            )}

            <div className={`${styles.columnsList_item_content}`}>
              {item.subtitle && (
                <h4 className={`${styles.columnsList_item_subtitle}`}>
                  {item.subtitle}
                </h4>
              )}

              {item.title && (
                <h3 className={`${styles.columnsList_item_title}`}>
                  {item.title}
                </h3>
              )}

              <div className={`${styles.columnsList_item_button_wrap}`}>
                {item.buttonText && (
                  <button className={`${styles.columnsList_item_button}`}>
                    {item.buttonText}
                  </button>
                )}
                {props.configurator && (
                  <button className={`${styles.columnsList_item_button}`}>
                    Build your own
                  </button>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ColumnsList;
