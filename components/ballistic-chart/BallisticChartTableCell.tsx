import styles from './BallisticChart.module.scss';

const TableCell = ({ items, small = false, noWrap = false }) => (
  <>
    {!noWrap && (
      <div className={styles.ballistic_row_item}>
        {items.map((item, index) => (
          <span
            key={index}
            data-text={item}
            className={`${styles.ballistic_row_item_text} ${
              small ? styles.ballistic_row_item_text_small : ''
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    )}
    {noWrap &&
      items.map((item, index) => (
        <span
          key={index}
          data-text={item}
          className={`${styles.ballistic_row_item_text} ${
            small ? styles.ballistic_row_item_text_small : ''
          }`}
        >
          {item}
        </span>
      ))}
  </>
);

export default TableCell;
