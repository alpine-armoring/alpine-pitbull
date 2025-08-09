import { getStrapiData } from '@/lib/fechData';
import Head from 'next/head';
// import styles from './About.module.scss';
import BannerHero from '@/components/banner-hero/BannerHero';
import Content from '@/components/content/Content';

async function getpageData() {
  try {
    const [pageData] = await Promise.all([
      getStrapiData({
        route: 'pitbull-about',
        populate: 'deep',
        //   custom:
        //     'populate[banner][populate]=media,mediaMP4,Button&populate[otherPages][populate]=image&populate[vehicles][fields][0]=featuredTitle&populate[vehicles][fields][1]=featuredSubtitle&populate[vehicles][fields][2]=slug&populate[vehicles][populate]=featuredImage',
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

export default async function AboutPage() {
  const { pageData } = await getpageData();

  const contentData = {
    dynamicZone: pageData.dynamicZone || [],
  };

  // console.log(pageData);
  // return null;

  return (
    <div>
      <Head>
        <title>Vehicle Builder | Your Company</title>
        <meta name="description" content="Configure your custom vehicle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {pageData?.banner && <BannerHero props={pageData.banner} small />}

        <div className="container_small">
          <Content data={contentData} />
        </div>
      </main>
    </div>
  );
}
