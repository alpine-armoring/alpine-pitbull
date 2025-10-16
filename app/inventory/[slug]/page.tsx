import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getStrapiData } from '@/lib/fechData';
import VehicleDetailsPage from '@/components/vehicle-details/VehicleDetailsPage';

const getInventoryVehicleData = cache(async (slug: string) => {
  try {
    const inventoryData = await getStrapiData({
      route: 'inventories',
      custom: `filters[slug][$eq]=${slug}&populate=deep`,
      revalidate: 3600,
    });

    const vehicle = inventoryData?.data?.[0];

    return {
      vehicleData: vehicle?.attributes || null,
      seo: vehicle?.attributes?.seo || {},
    };
  } catch (error) {
    console.error('Error fetching inventory vehicle data:', error);
    return {
      vehicleData: null,
      seo: {},
    };
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug.includes('pit-bull')) {
    return {};
  }

  const { seo, vehicleData } = await getInventoryVehicleData(slug);

  const seoData = seo || {};
  const metadata: Metadata = {};

  // if (seoData.metaTitle) {
  //   metadata.title = seoData.metaTitle;
  // } else if (vehicleData?.title) {
  //   metadata.title = `${vehicleData.title} | Pit-Bull® Inventory`;
  // }
  metadata.title = `${vehicleData.title}`;

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

export default async function InventoryVehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug.includes('pit-bull')) {
    notFound();
  }

  const { vehicleData } = await getInventoryVehicleData(slug);

  if (!vehicleData) {
    notFound();
  }

  return <VehicleDetailsPage data={vehicleData} />;
}
