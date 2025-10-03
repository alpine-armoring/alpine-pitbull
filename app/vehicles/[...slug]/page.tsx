import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import { Suspense } from 'react';
import PasswordProtectedConfigurator from '@/components/vehicle-builder/PasswordProtectedConfigurator';
// import StickyVideoSection from '@/components/sticky-video-section/StickyVideoSection';
import Content from '@/components/content/Content';

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

  return (
    <>
      {vehicleData.banner && <BannerHero props={vehicleData.banner} big />}

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
