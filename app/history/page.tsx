import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import FadeInContent from '@/components/FadeInContent';
import Content from '@/components/content/Content';

const getpageData = cache(async () => {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-history',
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
      siteName: 'Pit-Bull®',
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
            seoData.metaImage.data.attributes.alternativeText || 'Pit-Bull®',
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
      <div className="mt6 pb2">
        <div className="container">
          {pageData?.banner?.title && (
            <FadeInContent>
              <h1 className="c-title mb1 center">{pageData.banner.title}</h1>
            </FadeInContent>
          )}

          {pageData?.banner?.subtitle && (
            <FadeInContent delay={0.1}>
              <h2 className="c-description mb2 center">
                {pageData.banner.subtitle}
              </h2>
            </FadeInContent>
          )}
        </div>

        {contentData && (
          <div className="container_small">
            <Content data={contentData} />
          </div>
        )}
      </div>
    </>
  );
}
