import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import Header from '@/components/header/Header';
import { Suspense } from 'react';
import VehicleBuilder from '@/components/vehicle-builder/VehicleBuilder';
import TextReveal from '@/components/text-reveal/TextReveal';

async function getVehicleData(slug: string) {
  try {
    const vehicleData = await getStrapiData({
      route: 'vehicles-alternatives',
      custom: `filters[slug][$eq]=${slug}&populate=deep`,
      // custom: `filters[slug][$eq]=${slug}&populate[video][populate]=*&populate[bannerImage][populate]=*`
      revalidate: 3600,
    });

    const vehicle = vehicleData?.data?.[0];

    console.log(vehicle);

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

      <div className="textSection">
        <TextReveal delay={0.5}>
          <p>
            The Pit-Bull VX® combines cutting-edge ballistic protection with
            advanced technology and superior maneuverability, capable of
            navigating urban environments, off-road areas, and highways.
          </p>
        </TextReveal>
      </div>

      <div className="imageRight">
        <img
          alt="two sports cars are parked in front of a large building"
          src="https://bugatti.imgix.net/676011bacd8acf748dc4da5f/02-BUGATTI_Night-at-the-chateauv2.jpg?auto=format,compress&cs=srgb&sharp=10&w=1074&dpr=2.0000000298023224"
        />
      </div>
      <div className="imageLeft">
        <img
          alt="two sports cars are parked in front of a large building"
          src="https://bugatti.imgix.net/6760138fcd8acf748dc4e498/bugatti-atelier-3322.jpg?auto=format,compress&cs=srgb&sharp=10&w=798&dpr=2.0000000298023224"
        />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <VehicleBuilder />
      </Suspense>
    </>
  );
}
