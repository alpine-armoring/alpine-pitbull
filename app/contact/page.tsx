import Form from '@/components/form/Form';
import Accordion from '@/components/accordion/Accordion';
import { getStrapiData } from '@/lib/fechData';

async function getPageData() {
  try {
    const pageData = await getStrapiData({
      route: 'pitbull-contact',
      custom: 'populate[faqs][populate]=*',
      revalidate: 3600,
    });

    return {
      faqs: pageData?.data?.attributes?.faqs || [],
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return {
      faqs: [],
    };
  }
}

export default async function ContactPage() {
  const { faqs } = await getPageData();

  return (
    <div className="m4 container_small">
      <h1 className="c-title center">Contact</h1>

      <Form />

      {faqs.length > 0 && (
        <Accordion items={faqs} title="Frequently Asked Questions" />
      )}
    </div>
  );
}
