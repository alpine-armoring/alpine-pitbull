'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Inventory.module.scss';

interface Vehicle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    armor_level?: string;
    engine?: string;
    VIN?: string;
    vehicleID?: string;
    flag?: string;
    label?: boolean;
    featuredImage?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
          width?: number;
          height?: number;
          formats?: {
            thumbnail?: {
              url: string;
            };
            medium?: {
              url: string;
            };
            large?: {
              url: string;
            };
          };
        };
      };
    };
  };
}

interface InventoryListProps {
  vehicles: Vehicle[];
}

const InventoryList = ({
  vehicles,
}: InventoryListProps): React.ReactElement => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={styles.listing_list_error}>
        <h2>No Pit-Bull vehicles available at this time</h2>
      </div>
    );
  }

  return (
    <div className={styles.listing_list}>
      {vehicles.map((vehicle, index) => {
        const data = vehicle.attributes;
        const image = data.featuredImage?.data?.attributes;
        const imageUrl = image?.formats?.thumbnail?.url || image?.url;

        return (
          <Link
            href={`/inventory/${data.slug}`}
            className={`${styles.inventory_item} ${data.flag === 'sold' ? styles.inventory_item_sold : ''}`}
            key={vehicle.id}
          >
            <div className={styles.inventory_item_image}>
              {image ? (
                <Image
                  src={imageUrl || ''}
                  alt={image.alternativeText || `${data.title} | Pit-Bull`}
                  width={500}
                  height={385}
                  priority={index === 0}
                />
              ) : null}

              <div className={styles.inventory_item_button}>
                <span>View Details</span>
              </div>

              {data.flag && data.label ? (
                <div
                  className={`${styles.inventory_item_label} ${styles[`inventory_item_label_${data.flag}`]}`}
                >
                  <span>{data.flag}</span>
                </div>
              ) : null}
            </div>

            <div className={styles.inventory_item_content}>
              <h2
                className={styles.inventory_item_title}
                dangerouslySetInnerHTML={{ __html: data.title }}
              />

              {data.armor_level && (
                <p
                  className={styles.inventory_item_level}
                  dangerouslySetInnerHTML={{
                    __html: `Armored to <span>Level ${data.armor_level}</span>`,
                  }}
                />
              )}

              <ul className={styles.inventory_item_info}>
                {data.VIN && (
                  <li className={styles.inventory_item_info_item}>
                    <strong>VIN:</strong>
                    <span>{data.VIN}</span>
                  </li>
                )}
                {data.vehicleID && (
                  <li className={styles.inventory_item_info_item}>
                    <strong>Vehicle ID:</strong>
                    <span>{data.vehicleID}</span>
                  </li>
                )}
                {data.engine && (
                  <li className={styles.inventory_item_info_item}>
                    <strong>Engine:</strong>
                    <span>{data.engine}</span>
                  </li>
                )}
              </ul>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default InventoryList;
