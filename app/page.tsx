import React from 'react';
import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import ColumnsList from '@/components/columns-list/ColumnsList';
import FadeInContent from '@/components/FadeInContent';
import Featured from '@/components/featured/Featured';
import StickySections from '@/components/sticky-sections/StickySections';
import SocialFeed from '@/components/social-feed/SocialFeed';

const USE_OPTIMIZED_VIDEO = true; // Set to false: Fetch video URL from Strapi
const HOMEPAGE_VIDEO_CONFIG = {
  video:
    'https://d102sycao8uwt8.cloudfront.net/pitbull_homepage_10_06_5766d97809.mp4',
  poster: '/images/hp-poster.jpg',
};

function normalizeItemData(items, type = 'default') {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    let normalizedItem = {};

    if (type === 'vehicles') {
      const attrs = item.attributes || item;
      normalizedItem = {
        title: `<span>${attrs.featuredSubtitle}</span> ${attrs.featuredTitle}`,
        // subtitle: attrs.featuredSubtitle,
        link: 'vehicles/' + attrs.slug,
        buttonText: attrs.linkText || 'Learn More',
        image: attrs.featuredImage?.data?.attributes
          ? {
              url: attrs.featuredImage.data.attributes.url,
              alternativeText:
                attrs.featuredImage.data.attributes.alternativeText,
              width: attrs.featuredImage.data.attributes.width,
              height: attrs.featuredImage.data.attributes.height,
              formats: attrs.featuredImage.data.attributes.formats,
            }
          : null,
      };
    } else {
      normalizedItem = {
        title: item.title,
        subtitle: item.titleNav,
        link: item.linkURL,
        buttonText: item.linkText || 'Learn More',
        image: item.image?.data?.[0]?.attributes
          ? {
              url: item.image.data[0].attributes.url,
              alternativeText: item.image.data[0].attributes.alternativeText,
              width: item.image.data[0].attributes.width,
              height: item.image.data[0].attributes.height,
              formats: item.image.data[0].attributes.formats,
            }
          : null,
      };
    }

    return normalizedItem;
  });
}

const getpageData = cache(async () => {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-homepage',
        custom:
          'populate[banner][populate]=media,mediaMP4,Button&populate[otherPages][populate]=image&populate[vehicles][fields][0]=featuredTitle&populate[vehicles][fields][1]=featuredSubtitle&populate[vehicles][fields][2]=slug&populate[vehicles][populate]=featuredImage&populate[featured][populate]=image&populate[stickySections][populate]=item&populate[stickySections][populate]=media&populate[socialFeed][populate]=video&populate[socialFeed][populate]=thumbnail&populate[seo][populate]=*',
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

export default async function Home() {
  const { pageData } = await getpageData();

  const normalizedOtherPages = normalizeItemData(
    pageData?.otherPages,
    'default'
  );
  const normalizedVehicles = normalizeItemData(
    pageData?.vehicles?.data,
    'vehicles'
  );

  return (
    <>
      {pageData?.banner && (
        <BannerHero
          props={pageData.banner}
          hp
          optimizedVideo={
            USE_OPTIMIZED_VIDEO ? HOMEPAGE_VIDEO_CONFIG : undefined
          }
        />
      )}

      <div id="models" style={{ position: 'relative', top: '-50px' }}></div>

      <FadeInContent>
        {pageData?.vehicles?.data && (
          <ColumnsList
            className="vehicles_item col-2"
            title={pageData.vehiclesTitle}
            description={pageData.vehiclesText}
            items={normalizedVehicles}
            // id={'models'}
          />
        )}
      </FadeInContent>

      <FadeInContent>
        {pageData?.otherPages && (
          <ColumnsList
            items={normalizedOtherPages}
            title={pageData.otherPagesTitle}
            description={pageData.otherPagesText}
          />
        )}
      </FadeInContent>

      {pageData?.featured && (
        <FadeInContent>
          <Featured props={pageData?.featured} />
        </FadeInContent>
      )}

      <div className="container_small m4">
        {pageData?.stickySections && (
          <FadeInContent>
            <StickySections
              data={pageData?.stickySections.item}
              media={pageData?.stickySections.media}
              text={pageData?.stickySections.text}
            />
          </FadeInContent>
        )}
      </div>

      {pageData.socialFeed && (
        <FadeInContent>
          <SocialFeed videos={pageData.socialFeed} />
        </FadeInContent>
      )}
    </>
  );
}
