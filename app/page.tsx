import BannerHero from '@/components/banner-hero/BannerHero';
import ColumnsThree from '@/components/columns-three/ColumnsThree';

export default function Home() {
  const BannerHeroData = {
    title: 'Mission-Ready Mobility',
    video: {
      video_mp4: {
        data: {
          attributes: {
            url: 'https://d102sycao8uwt8.cloudfront.net/Alpine_Armoring_homepage_video_10_23_6dfc97de70.mp4',
            mime: 'video/mp4',
          },
        },
      },
      video_webm: {
        data: {
          attributes: {
            url: 'https://d102sycao8uwt8.cloudfront.net/Alpine_Armoring_homepage_video_10_23_6dfc97de70.mp4',
            mime: 'video/webm',
          },
        },
      },
    },
  };
  const InternalPages = {
    title: 'Alpine Armoring',
    description:
      'Since 1909, the people at BUGATTI Automobiles create incomparable products and experiences by pushing the limits of aesthetics and dynamics.',
    items: [
      {
        subtitle: 'Discover Alpine',
        title: 'Tactical Features and Customizations',
        image:
          'https://bugatti.imgix.net/6734a2b6eae7ef2f6d1c330d/02 BUGATTI_Custmer-Car-Gathering.jpg',
        button: 'Learn More About Alpine',
      },
      {
        subtitle: 'from 2010 to today and beyond',
        title: 'history of Alpine Pit-Bull',
        image:
          'https://bugatti.imgix.net/6734a52ceae7ef2f6d1c380c/AB105132_Crop.jpg',
        button: 'Learn More About Alpine',
      },
      {
        subtitle: 'Discover Alpine',
        title: 'Testing & certifications',
        image:
          'https://bugatti.imgix.net/6734a28b8d33578d8bd2af36/01 BUGATTI_Type 35 Making of a Champion_edit.jpg',
        button: 'Learn More About Alpine',
      },
    ],
  };
  const Vehicles = {
    title: 'Our Armored Pit-Bulls',
    description: 'The quintessence of luxury and speed.',
    items: [
      {
        subtitle: 'Timeless elegance and speed',
        titleType: 'image',
        title:
          'https://bugatti.imgix.net/67079fd3fa42b0c51df171f2/tourbillon.png?auto=format,compress&cs=srgb&sharp=10&w=512&dpr=1.25',
        image:
          'https://bugatti.imgix.net/6733871ced9d56f31c5f0182/bugatti-tourbillon-card.jpg',
        button: 'Learn More',
      },
      {
        subtitle: 'The ultimate roadster',
        titleType: 'image',
        title:
          'https://bugatti.imgix.net/67079cfafa42b0c51df16f7f/mistral.png?auto=format,compress&cs=srgb&sharp=10&w=512&dpr=1.25',
        image:
          'https://bugatti.imgix.net/677e8130e825e63ca2bd56fe/bugatti-w16mistral-card_v3.jpg',
        button: 'Learn More',
      },
      {
        subtitle: 'The ultimate roadster',
        titleType: 'image',
        title:
          'https://bugatti.imgix.net/67079cfafa42b0c51df16f7f/mistral.png?auto=format,compress&cs=srgb&sharp=10&w=512&dpr=1.25',
        image:
          'https://bugatti.imgix.net/677e8130e825e63ca2bd56fe/bugatti-w16mistral-card_v3.jpg',
        button: 'Learn More',
      },
      {
        subtitle: 'Timeless elegance and speed',
        titleType: 'image',
        title:
          'https://bugatti.imgix.net/67079fd3fa42b0c51df171f2/tourbillon.png?auto=format,compress&cs=srgb&sharp=10&w=512&dpr=1.25',
        image:
          'https://bugatti.imgix.net/6733871ced9d56f31c5f0182/bugatti-tourbillon-card.jpg',
        button: 'Learn More',
      },
    ],
  };

  return (
    <>
      {BannerHeroData ? <BannerHero props={BannerHeroData} /> : null}

      <ColumnsThree data={InternalPages} />

      <ColumnsThree className="col-2" data={Vehicles} />
    </>
  );
}
