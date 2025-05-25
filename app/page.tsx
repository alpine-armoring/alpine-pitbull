import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
import ColumnsList from '@/components/columns-list/ColumnsList';
import Header from '@/components/header/Header';

// This runs on the server
async function getpageData() {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-homepage',
        populate: 'deep',
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
  // console.log(pageData)

  const Vehicles = {
    title: 'Our Armored Pit-Bulls',
    description: 'The quintessence of luxury and speed.',
    items: [
      {
        titleNav: 'Timeless elegance and speed',
        title: 'VX',
        linkURL: 'vx',
        image: {
          data: [
            {
              attributes: {
                url: '/images/VX.jpg',
                width: 450,
                height: 570,
              },
            },
          ],
        },
        linkText: 'Learn More',
      },
      {
        titleNav: 'The ultimate roadster',
        title: 'VXT',
        linkURL: 'vxt',
        image: {
          data: [
            {
              attributes: {
                url: '/images/VXT.jpg',
                width: 450,
                height: 570,
              },
            },
          ],
        },
        linkText: 'Learn More',
      },
    ],
  };

  return (
    <>
      <Header />

      {pageData?.banner && <BannerHero props={pageData.banner} />}

      {pageData?.otherPages && (
        <ColumnsList
          items={pageData.otherPages}
          title={pageData.otherPagesTitle}
          description={pageData.otherPagesText}
        />
      )}

      <ColumnsList
        className="vehicles_item col-2"
        title={Vehicles.title}
        description={Vehicles.description}
        items={Vehicles.items}
        configurator
      />
    </>
  );
}
