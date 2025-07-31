import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import { Suspense } from 'react';
import VehicleBuilder from '@/components/vehicle-builder/VehicleBuilder';
import TextReveal from '@/components/text-reveal/TextReveal';
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

interface VehiclePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
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
      {vehicleData.banner && <BannerHero props={vehicleData.banner} />}

      <Content data={contentData} />

      <div className="imageRight">
        <img
          alt="two sports cars are parked in front of a large building"
          src="https://bugatti.imgix.net/676011bacd8acf748dc4da5f/02-BUGATTI_Night-at-the-chateauv2.jpg?auto=format,compress&cs=srgb&sharp=10&w=1074&dpr=2.0000000298023224"
        />
      </div>

      <div className="textSection">
        <TextReveal line>
          <p>
            Built on a heavy-duty F-600 chassis and equipped with a powerful V8
            turbo diesel engine, the armored Pit-Bull VX® will put itself in
            the line of fire while ensuring the safety of your team.
          </p>
        </TextReveal>
      </div>

      <div className="imageLeft">
        <img
          alt="two sports cars are parked in front of a large building"
          src="https://bugatti.imgix.net/6760138fcd8acf748dc4e498/bugatti-atelier-3322.jpg?auto=format,compress&cs=srgb&sharp=10&w=798&dpr=2.0000000298023224"
        />
      </div>

      {/* <StickyVideoSection /> */}

      <Suspense fallback={<div>Loading...</div>}>
        <VehicleBuilder />
      </Suspense>
    </>
  );
}
