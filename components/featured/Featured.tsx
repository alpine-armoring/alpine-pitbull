import styles from './Featured.module.scss';
import Image from 'next/image';
import CustomMarkdown from 'components/CustomMarkdown';
import Link from 'next/link';

const ColumnsList = (props) => {
  return (
    <div className={`${styles.featured} container_small`}>
      <div className={`${styles.featured_wrap}`}>
        {props.props.image && (
          <Image
            src={
              props.props.image.data[0].attributes.formats?.large?.url ||
              props.props.image.data[0].attributes.url
            }
            alt={
              props.props.image.data[0].attributes.alternativeText ||
              'Alpine Armoring'
            }
            width={
              props.props.image.data[0].attributes.formats?.large?.width ||
              props.props.image.data[0].attributes.width
            }
            height={
              props.props.image.data[0].attributes.formats?.large?.height ||
              props.props.image.data[0].attributes.height
            }
            className={`${styles.featured_image}`}
            quality={100}
          ></Image>
        )}

        <div className={`${styles.featured_text}`}>
          {props.props.title && (
            <h3 className={`${styles.featured_title}`}>{props.props.title}</h3>
          )}
          {props.props.description && (
            <div className={`${styles.featured_description}`}>
              <CustomMarkdown>{props.props.description}</CustomMarkdown>
            </div>
          )}
          {props.props.linkURL && (
            <Link
              className={`${styles.featured_link}`}
              href={`/${props.props.linkURL}`}
            >
              {props.props.linkText || 'See More'}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 6.66667H13ZM13 6.66667L7.33333 1ZM13 6.66667L7.33333 12.3333Z"
                  fill="#2D2D27"
                ></path>
                <path
                  d="M1 6.66667H13M13 6.66667L7.33333 1M13 6.66667L7.33333 12.3333"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColumnsList;
