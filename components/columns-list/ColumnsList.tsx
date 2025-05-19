import styles from './columnsList.module.scss';
import Link from 'next/link';
import Image from 'next/image';

const columnsList = (props) => {
  const { className, data } = props;

  return (
    <div
      className={`container ${className || ''} ${styles.columnsList_wrapper}`}
    >
      <div className={`c-content`}>
        {data?.title && <h2 className={`c-title`}>{data.title}</h2>}
        {data?.description && (
          <p className={`c-description`}>{data.description}</p>
        )}
      </div>

      <div
        className={`${styles.columnsList_container} ${className ? styles[className] : ''}`}
      >
        {data.items?.map((item, index) => (
          <Link href="/" className={`${styles.columnsList_item}`} key={index}>
            {item.image && (
              <Image
                src={item.image}
                alt="Alpine Armoring"
                width="450"
                height="570"
                className={`${styles.columnsList_item_image}`}
              ></Image>
            )}
            <div className={`${styles.columnsList_item_content}`}>
              {item.subtitle && (
                <h4 className={`${styles.columnsList_item_subtitle}`}>
                  {item.subtitle}
                </h4>
              )}
              {item.title &&
                (item.titleType !== 'image' ? (
                  <h3 className={`${styles.columnsList_item_title}`}>
                    {item.title}
                  </h3>
                ) : (
                  <Image
                    src={item.title}
                    alt="Alpine Armoring"
                    width="500"
                    height="110"
                    className={`${styles.columnsList_item_logo}`}
                  />
                ))}
              {item.button && (
                <div className={`${styles.columnsList_item_button_wrap}`}>
                  <button className={`${styles.columnsList_item_button}`}>
                    {item.button}
                  </button>
                  <button className={`${styles.columnsList_item_button}`}>
                    Build your own
                  </button>
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
