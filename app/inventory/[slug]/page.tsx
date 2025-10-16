import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getStrapiData } from '@/lib/fechData';
import VehicleDetailsPage from '@/components/vehicle-details/VehicleDetailsPage';

const getInventoryVehicleData = cache(async (slug: string) => {
  try {
    const populateQuery = [
      'populate[seo][populate][metaImage][populate][image][populate]=*',
      'populate[seo][populate][metaSocial][populate][image][populate]=*',
      'populate[gallery][populate]=*',
      'populate[video][populate]=*',
      'populate[videoMP4][populate]=*',
      'populate[featuredImage][populate]=*',
      'populate[OEMWindowSticker][populate]=*',
      'populate[OEMWindowSticker][fields][0]=url',
      'populate[OEMWindowSticker][fields][1]=isUrlSigned',
      'populate[OEMWindowSticker][fields][2]=provider',
      'populate[OEMWindowSticker][fields][3]=createdAt',
      'populate[OEMWindowSticker][fields][4]=ext',
      'populate[OEMWindowSticker][fields][5]=hash',
      'populate[OEMWindowSticker][fields][6]=mime',
      'populate[OEMWindowSticker][fields][7]=name',
      'populate[OEMWindowSticker][fields][8]=updatedAt',
      'populate[OEMWindowSticker][fields][9]=provider_metadata',
      'populate[OEMArmoringSpecs][populate]=*',
      'populate[OEMArmoringSpecs][fields][0]=url',
      'populate[OEMArmoringSpecs][fields][1]=isUrlSigned',
      'populate[OEMArmoringSpecs][fields][2]=provider',
      'populate[OEMArmoringSpecs][fields][3]=createdAt',
      'populate[OEMArmoringSpecs][fields][4]=ext',
      'populate[OEMArmoringSpecs][fields][5]=hash',
      'populate[OEMArmoringSpecs][fields][6]=mime',
      'populate[OEMArmoringSpecs][fields][7]=name',
      'populate[OEMArmoringSpecs][fields][8]=updatedAt',
      'populate[OEMArmoringSpecs][fields][9]=provider_metadata',
    ].join('&');

    const inventoryData = await getStrapiData({
      route: 'inventories',
      custom: `filters[slug][$eq]=${slug}&${populateQuery}`,
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
