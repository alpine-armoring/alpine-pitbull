import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import { Suspense } from 'react';
import PasswordProtectedConfigurator from '@/components/vehicle-builder/PasswordProtectedConfigurator';
// import StickyVideoSection from '@/components/sticky-video-section/StickyVideoSection';
import Content from '@/components/content/Content';

const USE_OPTIMIZED_VIDEO = true; // Set to false: Fetch video URLs from Strapi

const VIDEO_CONFIG: Record<
  string,
  { video: string; poster: string; videoWebM?: string }
> = {
  'armored-vxt': {
    video:
      'https://d102sycao8uwt8.cloudfront.net/VXT_header_9_2_b8260edd5e.mp4',
    poster: '/images/vxt-poster.jpg',
  },
  'armored-vx': {
    video:
      'https://d102sycao8uwt8.cloudfront.net/VX_vehicle_page_main_7_28_f47aecba3d.mp4',
    poster: '/images/vx-poster.jpg',
  },
};

const getVehicleData = cache(async (slug: string) => {
  try {
    const vehicleData = await getStrapiData({
      route: 'vehicles-alternatives',
      custom: `filters[slug][$eq]=${slug}&populate=deep`,
      revalidate: 3600,
    });

    const vehicle = vehicleData?.data?.[0];

    return {
      vehicleData: vehicle?.attributes || null,
      seo: vehicle?.attributes?.seo || [],
    };
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return {
      vehicleData: null,
      seo: [],
    };
  }
});

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const { seo, vehicleData } = await getVehicleData(slug);

  const seoData = seo || {};
  const metadata: Metadata = {};

  if (seoData.metaTitle) {
    metadata.title = seoData.metaTitle;
  } else if (vehicleData?.title) {
    metadata.title = vehicleData.title;
  }

  if (seoData.metaDescription) {
    metadata.description = seoData.metaDescription;
  } else if (vehicleData?.description) {
    metadata.description = vehicleData.description;
  }

  if (seoData.metaImage?.data || vehicleData?.featuredImage?.data) {
    const imageData =
      seoData.metaImage?.data || vehicleData?.featuredImage?.data;

    metadata.openGraph = {
      type: 'website',
      locale: 'en_US',
      url: './',
      siteName: 'Pit-Bull®',
      title: seoData.metaTitle || vehicleData?.title,
      description: seoData.metaDescription || vehicleData?.description,
      images: [
        {
          url:
            imageData.attributes.formats?.large?.url ||
            imageData.attributes.url,
          width: 1200,
          height: 630,
          alt:
            imageData.attributes.alternativeText ||
            seoData.metaTitle ||
            vehicleData?.title,
        },
      ],
    };

    metadata.twitter = {
      card: 'summary_large_image',
      site: '@alpinepitbull',
      creator: '@alpinepitbull',
      title: seoData.metaTitle || vehicleData?.title,
      description: seoData.metaDescription || vehicleData?.description,
      images: [
        imageData.attributes.formats?.large?.url || imageData.attributes.url,
      ],
    };
  }

  return metadata;
}

export default async function VehiclePage({ params }) {
  const { slug } = await params;
  const { vehicleData } = await getVehicleData(slug);

  const contentData = {
    dynamicZone: vehicleData.dynamicZone || [],
  };

  if (!vehicleData) {
    return (
      <>
        <div>Vehicle not found</div>
      </>
    );
  }

  const videoConfig = USE_OPTIMIZED_VIDEO ? VIDEO_CONFIG[slug] : undefined;

  return (
    <>
      {vehicleData.banner && (
        <BannerHero
          props={vehicleData.banner}
          big
          optimizedVideo={videoConfig}
        />
      )}

      <div className="m2">
        <Content data={contentData} />
      </div>

      {/* <StickyVideoSection /> */}

      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-white pb2" id="RequestAQuote">
          <PasswordProtectedConfigurator
            configuratorMedia={vehicleData.configuratorMedia}
          />
        </div>
      </Suspense>
    </>
  );
}
