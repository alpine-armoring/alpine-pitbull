import Link from 'next/link';
import Image from 'next/image';
import styles from './ColumnsList.module.scss';

const columnsList = (props) => {
  const { className, items, title, description } = props;
  const classNames = className ? className.split(' ') : [];
  const moduleClasses = classNames
    .map((cls) => styles[cls])
    .filter(Boolean)
    .join(' ');

  console.log(items);

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
            href={`/${item.linkURL}`}
            className={`${styles.columnsList_item}`}
            key={index}
          >
            {item.image.data && (
              <Image
                src={
                  item.image.data[0].attributes.formats?.medium?.url ||
                  item.image.data[0].attributes.url
                }
                alt={
                  item.image.data[0].attributes.alternativeText ||
                  'Alpine Armoring'
                }
                width={
                  item.image.data[0].attributes.formats?.medium?.width ||
                  item.image.data[0].attributes.width
                }
                height={
                  item.image.data[0].attributes.formats?.medium?.height ||
                  item.image.data[0].attributes.height
                }
                className={`${styles.columnsList_item_image}`}
              ></Image>
            )}

            <div className={`${styles.columnsList_item_content}`}>
              {item.titleNav && (
                <h4 className={`${styles.columnsList_item_subtitle}`}>
                  {item.titleNav}
                </h4>
              )}

              {item.title && (
                <h3 className={`${styles.columnsList_item_title}`}>
                  {item.title}
                </h3>
              )}

              {item.linkText && (
                <div className={`${styles.columnsList_item_button_wrap}`}>
                  <button className={`${styles.columnsList_item_button}`}>
                    {item.linkText}
                  </button>
                  {props.configurator && (
                    <button className={`${styles.columnsList_item_button}`}>
                      Build your own
                    </button>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default columnsList;
