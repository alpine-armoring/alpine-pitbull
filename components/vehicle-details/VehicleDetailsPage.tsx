'use client';
import styles from './VehicleDetailsPage.module.scss';
import Link from 'next/link';
import MediaSlider from '@/components/slider/Slider';
import { useState, useEffect } from 'react';
import CustomMarkdown from 'components/CustomMarkdown';
import VehicleDetailsList from './VehicleDetailsList';
import VideoScale, { animateVideo } from 'components/video-scale/VideoScale';
import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/lightbox/PopupPDF'), {
  ssr: false,
});
const InquiryForm = dynamic(() => import('@/components/form/InquiryForm'));

interface VehicleDetailsPageProps {
  data: any;
}

const VehicleDetailsPage = ({
  data,
}: VehicleDetailsPageProps): React.ReactElement => {
  // Reason: All hooks must be at the top level before any conditional returns
  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<any>(null);

  useEffect(() => {
    const setupObserver = () => {
      const targets = document.querySelectorAll('.observe');
      if (targets.length < 1) {
        setTimeout(setupObserver, 100);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('videoScaleContainer')) {
              window.addEventListener(
                'scroll',
                () => animateVideo(entry.target),
                { passive: true }
              );
            }
          } else {
            if (entry.target.classList.contains('videoScaleContainer')) {
              window.removeEventListener('scroll', () =>
                animateVideo(entry.target)
              );
            }
          }
        });
      });

      targets.forEach((item) => observer.observe(item));

      return () => {
        targets.forEach((item) => observer.unobserve(item));
        observer.disconnect();
      };
    };

    setupObserver();
  }, []);

  const topGallery = data?.gallery?.data;
  const mainText = data?.description;

  const vehicleDetails = {
    armor_level: data?.armor_level,
    VIN: data?.VIN,
    vehicleID: data?.vehicleID,
    engine: data?.engine,
    trans: data?.trans,
    year: data?.year,
    miles: data?.miles,
    driveTrain: data?.driveTrain,
    color_ext: data?.color_ext,
    color_int: data?.color_int,
    trim: data?.trim,
    wheels: data?.wheels,
    height: data?.height,
    length: data?.length,
    width: data?.width,
    wheelbase: data?.wheelbase,
    weight: data?.weight,
  };

  const scroll = (): void => {
    const element = document.getElementById('request-a-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const videoWebm = data?.video?.data?.attributes;
  const videoMP4 = data?.videoMP4?.data?.attributes;

  const togglePDFPopup = (url: any) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  const formData = {
    title: data?.title,
    vehicleID: data?.vehicleID,
    featuredImage: data?.featuredImage,
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={`${styles.inventory} m4 background-dark`}>
        <div className={`${styles.inventory_main}`}>
          <div className={`${styles.inventory_heading}`}>
            <div className={`b-breadcrumbs`}>
              <Link href="/">Home</Link>
              <span>&gt;</span>
              <Link href="/inventory">Inventory</Link>
              <span>&gt;</span>
              <span className={`b-breadcrumbs_current`}>{data?.title}</span>
            </div>

            <div className={`${styles.inventory_heading_title}`}>
              {data?.title ? (
                <h1
                  dangerouslySetInnerHTML={{
                    __html: data.title,
                  }}
                />
              ) : null}
            </div>

            {data?.flag !== 'sold' && (
              <div className={`${styles.inventory_heading_description}`}>
                <p>
                  This vehicle is in stock and available for immediate delivery
                  {/* {data?.shortDescription
                    ? data.shortDescription
                    : `This vehicle is in stock and available for immediate delivery`}
                    : `This ${data?.title} is in stock and available for immediate delivery`} */}
                </p>
              </div>
            )}
          </div>

          <div className={`${styles.inventory_top}`}>
            <div className={`${styles.inventory_top_gallery}`}>
              <div
                className={`
                ${styles.inventory_top_gallery_wrap}
                ${data?.flag === 'sold' ? styles.inventory_top_gallery_wrap_sold : ''}
              `}
              >
                {topGallery && topGallery.length > 0 ? (
                  <MediaSlider media={topGallery} />
                ) : null}

                {data?.flag === 'sold' && (
                  <div
                    className={`${styles.inventory_top_gallery_wrap_sold_label}`}
                  >
                    <span>Sold</span>
                  </div>
                )}

                {data?.armor_level && (
                  <div className={`${styles.inventory_info}`}>
                    <Link
                      href="/ballistic-chart"
                      className={`${styles.inventory_armor}`}
                    >
                      <div className={`${styles.inventory_armor_box}`}>
                        Armor
                        <span>Level</span>
                      </div>
                      <strong>{data?.armor_level}</strong>
                    </Link>
                  </div>
                )}
              </div>

              {(data?.OEMWindowSticker?.data ||
                data?.OEMArmoringSpecs?.data) && (
                <div className={`${styles.inventory_pdfs}`}>
                  {data?.OEMWindowSticker?.data && (
                    <div
                      className={`${styles.inventory_pdfs_button}`}
                      onClick={() =>
                        togglePDFPopup(data.OEMWindowSticker.data.attributes)
                      }
                    >
                      <span
                        className={`${styles.inventory_pdfs_button_text} text-cta-regular`}
                      >
                        <strong>OEM</strong>Window Sticker
                      </span>
                      <div className={`${styles.inventory_pdfs_button_icon}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="10" r="8" stroke="currentColor" />
                          <path
                            stroke="currentColor"
                            d="M7.714 12.286 12 8m0 0H7m5 0v5"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {data?.OEMArmoringSpecs?.data && (
                    <div
                      className={`${styles.inventory_pdfs_button}`}
                      onClick={() =>
                        togglePDFPopup(data.OEMArmoringSpecs.data.attributes)
                      }
                    >
                      <span
                        className={`${styles.inventory_pdfs_button_text} text-cta-regular`}
                      >
                        Armoring Specs
                      </span>
                      <div className={`${styles.inventory_pdfs_button_icon}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <circle cx="10" cy="10" r="8" stroke="currentColor" />
                          <path
                            stroke="currentColor"
                            d="M7.714 12.286 12 8m0 0H7m5 0v5"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={`${styles.inventory_cta_wrap}`}>
                <button onClick={scroll} className={`${styles.inventory_cta}`}>
                  Request A Quote
                </button>
              </div>

              <div
                className={`${styles.inventory_top_shape} shape-before shape-before-dark mobile-only`}
              />
            </div>

            <div className={`${styles.inventory_details}`}>
              <VehicleDetailsList vehicleDetails={vehicleDetails} />
            </div>
          </div>
        </div>

        <PopupPDF
          isOpen={isPDFPopupOpen}
          onClose={() => togglePDFPopup(null)}
          pdfUrl={currentPdfUrl}
        />

        {mainText && (
          <div
            className={`${styles.inventory_description} container_small ${
              data?.OEMWindowSticker?.data || data?.OEMArmoringSpecs?.data
                ? styles.inventory_description_pdfs
                : ''
            }`}
          >
            <CustomMarkdown>{mainText}</CustomMarkdown>
          </div>
        )}

        {(videoWebm || videoMP4) && (
          <VideoScale videoWebm={videoWebm} videoMP4={videoMP4} />
        )}

        {formData && <InquiryForm {...formData} className={`formCTA`} />}
      </div>
    </>
  );
};

export default VehicleDetailsPage;
