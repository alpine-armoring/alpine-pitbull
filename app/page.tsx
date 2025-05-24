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
  const InternalPages = {
    title: 'Alpine Armoring',
    description:
      'Alpine Armoring is a certified US based armored vehicle Manufacturer specializing in Designs & Engineering of variety of Armoured Cars for over 30 years',
    items: [
      {
        subtitle: 'Discover Pit-Bull',
        title: 'Tactical Features and Customizations',
        image:
          'https://bugatti.imgix.net/6734a2b6eae7ef2f6d1c330d/02 BUGATTI_Custmer-Car-Gathering.jpg',
        button: 'Learn More About ??',
      },
      {
        subtitle: 'From 2010 to Today',
        title: 'History of Alpine Armoring Pit-Bull',
        image:
          'https://bugatti.imgix.net/6734a52ceae7ef2f6d1c380c/AB105132_Crop.jpg',
        button: 'See Our ??',
      },
      {
        subtitle: 'Discover Alpine',
        title: 'Testing and Certification',
        image: '/images/testing-certification-pitbll.jpg',
        button: 'Discover ??',
      },
    ],
  };
  const Vehicles = {
    title: 'Our Armored Pit-Bulls',
    description: 'The quintessence of luxury and speed.',
    items: [
      {
        subtitle: 'Timeless elegance and speed',
        title: 'VX',
        image: '/images/VX.jpg',
        button: 'Learn More',
      },
      {
        subtitle: 'The ultimate roadster',
        title: 'VXT',
        image: '/images/VXT.jpg',
        button: 'Learn More',
      },
    ],
  };

  return (
    <>
      <Header />
      {pageData?.banner && <BannerHero props={pageData.banner} />}
      <ColumnsList data={InternalPages} />
      <ColumnsList
        className="vehicles_item col-2"
        data={Vehicles}
        configurator
      />
    </>
  );
}
