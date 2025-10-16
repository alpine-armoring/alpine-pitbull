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
          alternativeText: string;
        };
      } | null;
    };
    mediaMP4?: {
      data: {
        attributes: {
          url: string;
          mime: string;
          alternativeText: string;
        };
      } | null;
    };
    Button?: {
      Title: string;
      URL: string;
    };
    Button2?: {
      Title: string;
      URL: string;
    };
  };
  error?: Error;
}

export interface IconProps {
  className?: string;
  color?: string;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClick?: () => void;
}
