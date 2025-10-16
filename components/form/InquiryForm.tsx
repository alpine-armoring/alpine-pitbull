'use client';
import styles from './InquiryForm.module.scss';
import Image from 'next/image';
import Form from './Form';
import { usePathname } from 'next/navigation';
import useLocale from 'utils/useLocale';

const InquiryForm = (props) => {
  const pathname = usePathname();
  const { lang } = useLocale();
  const currentPath = pathname;

  return (
    <div
      className={`${styles.inquiry_form_wrap} inquiryFormContainer observe`}
      id="request-a-quote"
    >
      <div
        className={`
                ${styles.inquiry_form}
                ${props.plain ? styles.inquiry_form_plain : ''}
            `}
      >
        <div className={`shapeCurved_leftBottom shapeCurved`}></div>

        <div className={`${styles.inquiry_form_inner} container_small`}>
          <div className={`${styles.inquiry_form_left}`}>
            <h2 className={`${styles.inquiry_form_heading}`}>
              {lang.inquiringAbout}

              {/* {!props.plain ? ' this ready-to-ship' : null} */}
              {/* Render Filters conditionally based on path and filter type */}
              {!props.plain ? (
                !currentPath.includes('rental-vehicles') ? (
                  <>
                    {' '}
                    {(lang.this as string).toLowerCase()}{' '}
                    <span className={`blockOnPhone`}>
                      {lang.thisReadyToShip}
                    </span>{' '}
                  </>
                ) : (
                  ` ${lang.rentalOfThis}`
                )
              ) : (
                ` ${lang.the}`
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: props?.title,
                }}
              ></span>
            </h2>

            {props?.featuredImage?.data ? (
              <Image
                src={
                  props.plain
                    ? props?.featuredImage?.data.attributes.formats?.medium
                        .url || props?.featuredImage?.data.attributes.url
                    : props?.featuredImage?.data.attributes.formats?.thumbnail
                        .url || props?.featuredImage?.data.attributes.url
                }
                alt={
                  props?.featuredImage?.data.attributes.alternativeText ||
                  'Alpine Armoring'
                }
                width={
                  props.plain
                    ? props?.featuredImage?.data.attributes.formats?.medium
                        .width
                    : 500
                }
                height={
                  props.plain
                    ? props?.featuredImage?.data.attributes.formats?.medium
                        .height
                    : 395
                }
              />
            ) : null}
            <div
              className={`${styles.inquiry_form_heading} ${styles.inquiry_form_heading_level}`}
            >
              {!props.plain ? (
                <span>
                  {lang.vehicleID}: <strong>{props?.vehicleID}</strong>
                </span>
              ) : null}
            </div>
          </div>

          <Form />
        </div>

        <div className={`shapeCurved_rightBottom shapeCurved`}></div>
      </div>
    </div>
  );
};

export default InquiryForm;
