import Image from 'next/image';
import TableCell from './BallisticChartTableCell';

const TableRow = ({ item, index, onRowSelect, styles }) => (
  <div className={styles.ballistic_row}>
    <div className={styles.ballistic_row_item}>
      <div className={styles.ballistic_weaponImg}>
        <Image
          src={`/images/ballistic/weapon_A${item.level[0]}.png`}
          alt={`Weapon A${item.level[0]}`}
          width={264}
          height={71}
          priority
          unoptimized
        />
      </div>
    </div>
    <TableCell items={item.name} small={item.name.length > 1} />
    <TableCell items={item.caliber} small={item.caliber.length > 1} />
    <TableCell items={item.class} />
    <TableCell items={[item.stanag]} />
    <TableCell items={[item.ul]} />
    <div
      className={`${styles.ballistic_row_item} ${styles.ballistic_row_item_level} ${
        item.level.length > 1 ? styles.ballistic_row_item_level_small : ''
      }`}
    >
      <span className={styles.ballistic_row_item_text}>A</span>
      {item.level.map((level, i) => (
        <span key={i} className={styles.ballistic_row_item_text}>
          {level}
        </span>
      ))}
    </div>
    <TableCell items={[item.nij]} />
    <TableCell items={[item.cen]} />
    <TableCell items={item.weight} small={item.weight.length > 1} />
    <div className={styles.ballistic_row_item}>
      <TableCell items={item.type} small={item.type.length > 1} noWrap />
      {item.typeFull && (
        <div className={styles.ballistic_tooltip}>
          {item.typeFull.map((full, i) => (
            <span key={i}>{full}</span>
          ))}
        </div>
      )}
    </div>
    <TableCell items={item.velocity} />
    <div className={`${styles.ballistic_row_item} ${styles.ballistic_compare}`}>
      <div
        className={styles.ballistic_compare_button}
        onClick={() => onRowSelect(index)}
      >
        <span className={styles.ballistic_compare_button_slider} />
      </div>
    </div>
    <div className={`${styles.ballistic_row_item} ${styles.ballistic_bullets}`}>
      <Image
        src={`/images/ballistic/bullet${index + 1}.png`}
        alt={`Bullet Level ${index + 1}`}
        width={232}
        height={56}
        unoptimized
        priority
      />
    </div>
  </div>
);

export default TableRow;
