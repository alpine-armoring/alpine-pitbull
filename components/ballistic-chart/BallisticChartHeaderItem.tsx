import Image from 'next/image';

// Define the props interface
interface HeaderItemProps {
  src: string;
  alt: string;
  mobileWidth?: number;
  mobileHeight?: number;
  desktopWidth: number;
  desktopHeight: number;
  styles: { [key: string]: string };
}

const HeaderItem: React.FC<HeaderItemProps> = ({
  src,
  alt,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
  styles,
}) => (
  <div className={styles.ballistic_header_item}>
    {/* Mobile Image */}
    {mobileWidth && mobileHeight && (
      <Image
        src={`/images/ballistic/${src}_mobile.png`}
        alt={alt}
        title={alt}
        width={mobileWidth}
        height={mobileHeight}
        className="untilLarge-only"
        quality={100}
        priority
        unoptimized
      />
    )}
    {/* Desktop Image */}
    <Image
      src={`/images/ballistic/${src}.png`}
      alt={alt}
      title={alt}
      width={desktopWidth}
      height={desktopHeight}
      className={mobileWidth ? 'large-only' : ''}
      quality={100}
      priority
      unoptimized
    />
  </div>
);

export default HeaderItem;
