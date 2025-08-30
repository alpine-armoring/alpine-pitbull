import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import Content from '@/components/content/Content';

const getpageData = cache(async () => {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-about',
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

  const contentData = {
    dynamicZone: pageData?.dynamicZone || [],
  };

  return (
    <>
      {pageData?.banner && <BannerHero props={pageData.banner} small />}

      {contentData && (
        <div className="container_small">
          <Content data={contentData} />
        </div>
      )}
    </>
  );
}
