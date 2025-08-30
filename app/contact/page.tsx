import type { Metadata } from 'next';
import { cache } from 'react';
import Form from '@/components/form/Form';
import Accordion from '@/components/accordion/Accordion';
import { getStrapiData } from '@/lib/fechData';

const getPageData = cache(async () => {
  try {
    const pageData = await getStrapiData({
      route: 'pitbull-contact',
      custom: 'populate[faqs][populate]=*&populate[seo][populate]=*',
      revalidate: 3600,
    });

    return {
      faqs: pageData?.data?.attributes?.faqs || [],
      seo: pageData?.data?.attributes?.seo || [],
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return {
      faqs: [],
      seo: [],
    };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageData();

  const seoData = seo || {};
  const metadata: Metadata = {};

  if (seoData.metaTitle) {
    metadata.title = seoData.metaTitle;
  }

  if (seoData.metaDescription) {
    metadata.description = seoData.metaDescription;
  }

  if (seoData.metaImage?.data) {
    metadata.openGraph = {
      type: 'website',
      locale: 'en_US',
      url: './',
      siteName: 'Alpine Pitbull',
      title: seoData.metaTitle,
      description: seoData.metaDescription,
      images: [
        {
          url:
            seoData.metaImage.data.attributes.formats?.large?.url ||
            seoData.metaImage.data.attributes.url,
          width: 1200,
          height: 630,
          alt:
            seoData.metaImage.data.attributes.alternativeText ||
            'Alpine Pitbull',
        },
      ],
    };

    metadata.twitter = {
      card: 'summary_large_image',
      site: '@alpinepitbull',
      creator: '@alpinepitbull',
      title: seoData.metaTitle,
      description: seoData.metaDescription,
      images: [
        seoData.metaImage.data.attributes.formats?.large?.url ||
          seoData.metaImage.data.attributes.url,
      ],
    };
  }

  return metadata;
}

export default async function ContactPage() {
  const { faqs } = await getPageData();

  return (
    <div className="m4 container_small">
      <h1 className="c-title center">Contact us</h1>

      <Form />

      {faqs.length > 0 && (
        <Accordion items={faqs} title="Frequently Asked Questions" />
      )}
    </div>
  );
}
