import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import Header from '@/components/header/Header';
import { Suspense } from 'react';
import VehicleBuilder from '@/components/vehicle-builder/VehicleBuilder';

async function getVehicleData(slug: string) {
  try {
    const vehicleData = await getStrapiData({
      route: 'vehicles-alternatives',
      custom: `filters[slug][$eq]=${slug}&populate=deep`,
      // custom: `filters[slug][$eq]=${slug}&populate[video][populate]=*&populate[bannerImage][populate]=*`
      revalidate: 3600,
    });

    const vehicle = vehicleData?.data?.[0];

    console.log(vehicleData);

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

interface VehiclePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  // Await the params Promise
  const { slug } = await params;
  const { vehicleData } = await getVehicleData(slug);

  if (!vehicleData) {
    return (
      <>
        <Header />
        <div>Vehicle not found</div>
      </>
    );
  }

  return (
    <>
      <Header />

      {vehicleData.banner && <BannerHero props={vehicleData.banner} />}

      <Suspense fallback={<div>Loading...</div>}>
        <VehicleBuilder />
      </Suspense>
    </>
  );
}
