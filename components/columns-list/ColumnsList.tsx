'use client';
import TransitionLink from '@/components/TransitionLink';
import Image from 'next/image';
import styles from './ColumnsList.module.scss';

const ColumnsList = (props) => {
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
          <TransitionLink
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
          </TransitionLink>
        ))}
      </div>
    </div>
  );
};

export default ColumnsList;
