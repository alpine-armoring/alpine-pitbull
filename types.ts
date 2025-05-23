export interface BannerHeroProps {
  props: {
    title?: string;
    subTitle?: string;
    text?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    video?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    button?: any;
  };
  error?: Error;
}
