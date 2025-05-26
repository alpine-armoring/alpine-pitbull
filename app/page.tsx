import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import ColumnsList from '@/components/columns-list/ColumnsList';
import Header from '@/components/header/Header';

function normalizeItemData(items, type = 'default') {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    let normalizedItem = {};

    if (type === 'vehicles') {
      const attrs = item.attributes || item;
      normalizedItem = {
        title: attrs.pitbullHomepageTitle,
        subtitle: attrs.pitbullHomepageSubtitle,
        link: 'vehicles/' + attrs.slug,
        buttonText: attrs.linkText || 'Learn More',
        image: attrs.pitbullFeaturedImage?.data?.attributes
          ? {
              url: attrs.pitbullFeaturedImage.data.attributes.url,
              alternativeText:
                attrs.pitbullFeaturedImage.data.attributes.alternativeText,
              width: attrs.pitbullFeaturedImage.data.attributes.width,
              height: attrs.pitbullFeaturedImage.data.attributes.height,
              formats: attrs.pitbullFeaturedImage.data.attributes.formats,
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

// This runs on the server
async function getpageData() {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-homepage',
        // populate: 'deep',
        // populate: 'banner.media, otherPages.image, vehicles_we_armors.pitbullFeaturedImage',
        custom:
          'populate[banner][populate]=media,mediaMP4,Button&populate[otherPages][populate]=image&populate[vehicles_we_armors][fields][0]=pitbullHomepageTitle&populate[vehicles_we_armors][fields][1]=pitbullHomepageSubtitle&populate[vehicles_we_armors][fields][2]=slug&populate[vehicles_we_armors][populate]=pitbullFeaturedImage',
        revalidate: 3600,
      }),
    ]);

    return {
      pageData: pageData?.data?.attributes || null,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      pageData: null,
    };
  }
}

export default async function Home() {
  const { pageData } = await getpageData();

  const normalizedOtherPages = normalizeItemData(
    pageData?.otherPages,
    'default'
  );
  const normalizedVehicles = normalizeItemData(
    pageData?.vehicles_we_armors?.data,
    'vehicles'
  );

  return (
    <>
      <Header />

      {pageData?.banner && <BannerHero props={pageData.banner} />}

      {pageData?.otherPages && (
        <ColumnsList
          items={normalizedOtherPages}
          title={pageData.otherPagesTitle}
          description={pageData.otherPagesText}
        />
      )}

      <ColumnsList
        className="vehicles_item col-2"
        title={pageData.vehiclesTitle}
        description={pageData.vehiclesText}
        items={normalizedVehicles}
        configurator
      />
    </>
  );
}
