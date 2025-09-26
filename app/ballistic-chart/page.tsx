import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import FadeInContent from '@/components/FadeInContent';
import BallisticChart from '@/components/ballistic-chart/BallisticChart';

const getpageData = cache(async () => {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pibull-ballistic-chart',
        populate: 'deep',
        revalidate: 3600,
      }),
    ]);

    return {
      pageData: pageData?.data?.attributes || null,
      seo: pageData?.data?.attributes?.seo || [],
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      pageData: null,
      seo: [],
      instagramPosts: [],
    };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getpageData();

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

export default async function AboutPage() {
  const { pageData } = await getpageData();

  return (
    <>
      <div className="mt6 pb2">
        <FadeInContent>
          <h1 className="c-title center">{pageData.banner.title}</h1>
        </FadeInContent>

        <FadeInContent delay={0.1}>
          <h2 className="c-description mb2 center">
            {pageData.banner.subtitle}
          </h2>
        </FadeInContent>

        <FadeInContent>
          <BallisticChart />
        </FadeInContent>
      </div>
    </>
  );
}
