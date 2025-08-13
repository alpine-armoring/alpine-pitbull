'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import en from '../locales/en';
import es from '../locales/es';

const getLocaleStrings = (locale) => {
  switch (locale) {
    case 'es':
      return es;
    default:
      return en;
  }
};

export const useLocale = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // Get locale from params if using internationalized routing
  // or set a default locale
  const locale = params?.locale || 'en';
  const lang = getLocaleStrings(locale);

  return {
    locale,
    lang,
    router,
    pathname,
    params,
  };
};

export { getLocaleStrings };
export default useLocale;
