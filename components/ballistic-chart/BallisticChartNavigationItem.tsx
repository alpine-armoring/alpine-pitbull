import Image from 'next/image';
import styles from './BallisticChart.module.scss';

const NavigationItem = ({
  label,
  imageSrc = '',
  imageWidth = 150,
  imageHeight = 150,
}) => (
  <div className={styles.ballistic_row_item}>
    {label}
    {imageSrc && (
      <Image
        src={`/images/ballistic/${imageSrc}`}
        alt={label}
        title={label}
        width={imageWidth}
        height={imageHeight}
        className="large-only"
        priority
        unoptimized
      />
    )}
  </div>
);

export default NavigationItem;
