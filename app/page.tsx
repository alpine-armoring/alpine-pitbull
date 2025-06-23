import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import ColumnsList from '@/components/columns-list/ColumnsList';
import { getInstagramFeedWithFileCache } from '@/lib/instagramApi';
import InstagramFeed from '@/components/instagram-feed/InstagramFeed';

function normalizeItemData(items, type = 'default') {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    let normalizedItem = {};

    if (type === 'vehicles') {
      const attrs = item.attributes || item;
      normalizedItem = {
        title: attrs.featuredTitle,
        subtitle: attrs.featuredSubtitle,
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

async function getpageData() {
  try {
    const [pageData, instagramPosts] = await Promise.all([
      getStrapiData({
        route: 'pitbull-homepage',
        custom:
          'populate[banner][populate]=media,mediaMP4,Button&populate[otherPages][populate]=image&populate[vehicles][fields][0]=featuredTitle&populate[vehicles][fields][1]=featuredSubtitle&populate[vehicles][fields][2]=slug&populate[vehicles][populate]=featuredImage',
        revalidate: 3600,
      }),
      getInstagramFeedWithFileCache(),
    ]);

    return {
      pageData: pageData?.data?.attributes || null,
      instagramPosts,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      pageData: null,
      instagramPosts: [],
    };
  }
}

export default async function Home() {
  const { pageData, instagramPosts } = await getpageData();

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

      {/* <InstagramEmbed /> */}

      <InstagramFeed posts={instagramPosts} title="ALPINE Live" />
    </>
  );
}
