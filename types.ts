export interface BannerHeroProps {
  props: {
    title?: string;
    subtitle?: string;
    Description?: string;
    media?: {
      data: {
        attributes: {
          url: string;
          mime: string;
        };
      } | null;
    };
    mediaMP4?: {
      data: {
        attributes: {
          url: string;
          mime: string;
        };
      } | null;
    };
    Button?: {
      Title: string;
      URL: string;
    };
  };
  error?: Error;
}
