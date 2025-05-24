import { getStrapiData } from '@/lib/fechData';
import BannerHero from '@/components/banner-hero/BannerHero';
// import ColumnsList from '@/components/columns-list/ColumnsList';
import Header from '@/components/header/Header';

// This runs on the server
async function getPageData() {
  try {
    const [pageDAta] = await Promise.all([
      getStrapiData({
        route: 'pitbull-homepage',
        populate: 'deep',
        revalidate: 3600, // Revalidate every hour
      }),
    ]);

    return {
      pageDAta: pageDAta?.data?.attributes || null,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      pageDAta: null,
    };
  }
}

export default async function Home() {
  const { pageDAta } = await getPageData();
  // console.log(pageDAta)

  // const InternalPages = internalPages || {
  //   title: 'Alpine Armoring',
  //   description: 'Alpine Armoring is a certified US based armored vehicle Manufacturer...',
  //   items: [
  //     // Your fallback items
  //   ],
  // };

  // const Vehicles = vehicles || {
  //   title: 'Our Armored Pit-Bulls',
  //   description: 'The quintessence of luxury and speed.',
  //   items: [
  //     // Your fallback items
  //   ],
  // };

  return (
    <>
      <Header />
      {pageDAta.banner && <BannerHero props={pageDAta.banner} />}
      {/* <ColumnsList data={InternalPages} />
      <ColumnsList
        className="vehicles_item col-2"
        data={Vehicles}
        configurator
      /> */}
    </>
  );
}
