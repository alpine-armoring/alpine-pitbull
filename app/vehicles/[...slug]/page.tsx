import BannerHero from '@/components/banner-hero/BannerHero';
import Header from '@/components/header/Header';

export default function Home() {
  const BannerHeroData = {
    title: 'VXT',
    subTitle: 'Beauty meets Beast',
    text: `Breaking new barriers and dimensions through a modern reinterpretation of ALPINE'S iconic history. The VXT emphasizes comfort and sophistication as much as innovative technology and performance-oriented form.`,
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

  return (
    <>
      <Header />

      {BannerHeroData ? <BannerHero props={BannerHeroData} /> : null}
    </>
  );
}
