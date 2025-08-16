import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import { Suspense } from 'react';
import VehicleBuilder from '@/components/vehicle-builder/VehicleBuilder';
// import StickyVideoSection from '@/components/sticky-video-section/StickyVideoSection';
import Content from '@/components/content/Content';

async function getVehicleData(slug: string) {
  try {
    const vehicleData = await getStrapiData({
      route: 'vehicles-alternatives',
      custom: `filters[slug][$eq]=${slug}&populate=deep`,
      // custom: `filters[slug][$eq]=${slug}&populate[video][populate]=*&populate[bannerImage][populate]=*`
      revalidate: 3600,
    });

    const vehicle = vehicleData?.data?.[0];

    return {
      vehicleData: vehicle?.attributes || null,
    };
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return {
      vehicleData: null,
    };
  }
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

      <div className="container_small overflow m2">
        <Content data={contentData} />
      </div>

      {/* <StickyVideoSection /> */}

      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-white ">
          <VehicleBuilder configuratorMedia={vehicleData.configuratorMedia} />
        </div>
      </Suspense>
    </>
  );
}
