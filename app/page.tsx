import React from 'react';
import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import ColumnsList from '@/components/columns-list/ColumnsList';
import FadeInContent from '@/components/FadeInContent';
import Featured from '@/components/featured/Featured';
import StickySections from '@/components/sticky-sections/StickySections';
import SocialFeed from '@/components/social-feed/SocialFeed';

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
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-homepage',
        custom:
          'populate[banner][populate]=media,mediaMP4,Button&populate[otherPages][populate]=image&populate[vehicles][fields][0]=featuredTitle&populate[vehicles][fields][1]=featuredSubtitle&populate[vehicles][fields][2]=slug&populate[vehicles][populate]=featuredImage&populate[featured][populate]=image&populate[stickySections][populate]=item&populate[stickySections][populate]=media&populate[socialFeed][populate]=video&populate[socialFeed][populate]=thumbnail',
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
      instagramPosts: [],
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
    pageData?.vehicles?.data,
    'vehicles'
  );

  const videoData = [
    {
      youtubeURL: 'dQw4w9WgXcQ',
      thumbnail: {
        data: {
          attributes: {
            url: 'https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/532038256_18528404878001456_5702841156940207529_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QHtU_A5ML1UpOaoE4VOUHOZ7x7KYa7zqUHGuaJzT7PqUrGYTgiNJSev7Pq1muQFoak&_nc_ohc=UXWgAaDGzsoQ7kNvwH0ElM9&_nc_gid=rLdVsGCqlbGy7xxFEuF9KQ&edm=AMO9-JQAAAAA&ccb=7-5&oh=00_AfXUdpGMnsh51_LHt2pp8Uy5JakK-IqPr7_S-zlbiNnYww&oe=68A4FF60&_nc_sid=cc8940',
          },
        },
      },
      link: 'instagram.com',
    },
    {
      video: {
        data: {
          attributes: {
            url: 'https://d102sycao8uwt8.cloudfront.net/Alpine_Armoring_homepage_video_6_16_25_7c8ebcf56e.webm',
          },
        },
      },
      thumbnail: {
        data: {
          attributes: {
            url: 'https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/533489539_18528403246001456_181466034192915959_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QE0QrrJne8iUfkXMyWR2X8RNGEmrOdsY11AOt66CfjR2nztgMKPdPFNE_Jn7Uxc7lQ&_nc_ohc=Hf0WQ4YjP5QQ7kNvwFjE29n&_nc_gid=sSZJeIez9OsWdQQRikwVow&edm=AMO9-JQAAAAA&ccb=7-5&oh=00_AfVYxfZYQJ_m9-4VpA_IlgKXi-ZazATRzLxaR8W2XYQ3rg&oe=68A5220E&_nc_sid=cc8940',
          },
        },
      },
    },
    {
      youtubeURL: 'dQw4w9WgXcQ',
      thumbnail: {
        data: {
          attributes: {
            url: 'https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/532372427_18527873533001456_2808708626097421394_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QGYeUWyfMvSmha6Uat1_TTkm_Q1fd7CFb2-GUprcdfN9gE-z5Z3mOyQuj2wd2x-HBE&_nc_ohc=A1SVJHodKegQ7kNvwFT-uis&_nc_gid=By8TgLlGZhH1U4VL7Biqwg&edm=AMO9-JQAAAAA&ccb=7-5&oh=00_AfUQFYaYuza518THpk_yKuCHK-QMKB43m2H0DwTtVPCfWQ&oe=68A14008&_nc_sid=cc8940',
          },
        },
      },
    },
    {
      youtubeURL: 'dQw4w9WgXcQ',
      thumbnail: {
        data: {
          attributes: {
            url: 'https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/532372427_18527873533001456_2808708626097421394_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QGYeUWyfMvSmha6Uat1_TTkm_Q1fd7CFb2-GUprcdfN9gE-z5Z3mOyQuj2wd2x-HBE&_nc_ohc=A1SVJHodKegQ7kNvwFT-uis&_nc_gid=By8TgLlGZhH1U4VL7Biqwg&edm=AMO9-JQAAAAA&ccb=7-5&oh=00_AfUQFYaYuza518THpk_yKuCHK-QMKB43m2H0DwTtVPCfWQ&oe=68A14008&_nc_sid=cc8940',
          },
        },
      },
    },
    {
      youtubeURL: 'dQw4w9WgXcQ',
      thumbnail: {
        data: {
          attributes: {
            url: 'https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/532038256_18528404878001456_5702841156940207529_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QHtU_A5ML1UpOaoE4VOUHOZ7x7KYa7zqUHGuaJzT7PqUrGYTgiNJSev7Pq1muQFoak&_nc_ohc=UXWgAaDGzsoQ7kNvwH0ElM9&_nc_gid=rLdVsGCqlbGy7xxFEuF9KQ&edm=AMO9-JQAAAAA&ccb=7-5&oh=00_AfXUdpGMnsh51_LHt2pp8Uy5JakK-IqPr7_S-zlbiNnYww&oe=68A4FF60&_nc_sid=cc8940',
          },
        },
      },
      link: 'instagram.com',
    },
    {
      video: {
        data: {
          attributes: {
            url: 'https://d102sycao8uwt8.cloudfront.net/Alpine_Armoring_homepage_video_6_16_25_7c8ebcf56e.webm',
          },
        },
      },
      thumbnail: {
        data: {
          attributes: {
            url: 'https://scontent-fra3-1.cdninstagram.com/v/t51.2885-15/533489539_18528403246001456_181466034192915959_n.jpg?stp=dst-jpg_e15_p480x480_tt6&_nc_ht=scontent-fra3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2QE0QrrJne8iUfkXMyWR2X8RNGEmrOdsY11AOt66CfjR2nztgMKPdPFNE_Jn7Uxc7lQ&_nc_ohc=Hf0WQ4YjP5QQ7kNvwFjE29n&_nc_gid=sSZJeIez9OsWdQQRikwVow&edm=AMO9-JQAAAAA&ccb=7-5&oh=00_AfVYxfZYQJ_m9-4VpA_IlgKXi-ZazATRzLxaR8W2XYQ3rg&oe=68A5220E&_nc_sid=cc8940',
          },
        },
      },
    },
  ];

  return (
    <>
      {pageData?.banner && <BannerHero props={pageData.banner} />}

      <FadeInContent>
        {pageData?.otherPages && (
          <ColumnsList
            items={normalizedOtherPages}
            title={pageData.otherPagesTitle}
            description={pageData.otherPagesText}
          />
        )}
      </FadeInContent>

      <FadeInContent>
        <ColumnsList
          className="vehicles_item col-2"
          title={pageData.vehiclesTitle}
          description={pageData.vehiclesText}
          items={normalizedVehicles}
          configurator
        />
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

      <FadeInContent>
        <SocialFeed
          videos={
            pageData?.socialFeed?.length > 0 ? pageData.socialFeed : videoData
          }
        />
      </FadeInContent>
    </>
  );
}
