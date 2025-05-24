const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export async function fetchAPI(path: string, options: FetchOptions = {}) {
  const requestUrl = `${STRAPI_URL}/api${path}`;

  try {
    const response = await fetch(requestUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: options.cache || 'force-cache',
      next: options.revalidate ? { revalidate: options.revalidate } : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from Strapi:', error);
    throw error;
  }
}

interface StrapiQueryParams {
  route: string;
  params?: string;
  sort?: string;
  sortType?: 'asc' | 'desc';
  populate?: string;
  fields?: string;
  limit?: number;
  page?: number;
  pageSize?: number;
  custom?: string;
  locale?: string;
  cache?: RequestCache;
  revalidate?: number;
}

export async function getStrapiData({
  route,
  params = '',
  sort,
  sortType = 'asc',
  populate,
  limit,
  fields,
  page,
  pageSize,
  custom,
  locale = 'en',
  cache = 'force-cache',
  revalidate,
}: StrapiQueryParams) {
  const sortQuery = sort ? `&sort=${sort}:${sortType}` : '';
  const paramsQuery = params ? params : '';
  const populateQuery = populate ? `populate=${populate}` : '';
  const fieldsQuery = fields ? `&${fields}` : '';
  const limitQuery = limit ? `&pagination[limit]=${limit}` : '';
  const pageQuery = page ? `&pagination[page]=${page}` : '';
  const pageSizeQuery = pageSize ? `&pagination[pageSize]=${pageSize}` : '';
  const localeQuery = `&locale=${locale}`;

  const query = custom
    ? `/${route}?${custom}${localeQuery}`
    : `/${route}?${paramsQuery}&${populateQuery}${sortQuery}${fieldsQuery}${limitQuery}${pageQuery}${pageSizeQuery}${localeQuery}`;

  try {
    const data = await fetchAPI(query, { cache, revalidate });
    return data;
  } catch (error) {
    console.error(`Error fetching ${route}:`, error);
    return null;
  }
}

// Client-side hook for use in client components
export function useStrapiData() {
  return {
    fetchData: async (
      params: Omit<StrapiQueryParams, 'cache' | 'revalidate'>
    ) => {
      return getStrapiData({ ...params, cache: 'no-store' });
    },
  };
}
