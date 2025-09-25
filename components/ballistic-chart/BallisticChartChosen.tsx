import styles from './BallisticChartChosen.module.scss';
import Image from 'next/image';

const BallisticChartChosen = ({ items, onClose }) => {
  return (
    <div className={`${styles.ballistic_chosen}`}>
      <div className={`${styles.ballistic_chosen_inner}`}>
        <div className={`${styles.ballistic_chosen_heading}`}>
          <h2>Comparison</h2>
          <p>(Alpine’s Levels vs. Others)</p>
          <button
            className={`${styles.ballistic_chosen_close}`}
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className={`${styles.ballistic_chosen_list}`}>
          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <Image
                src="/images/ballistic/ballistic_logo.png"
                alt=""
                width="60"
                height="90"
                className={`${styles.ballistic_chosen_list_left_logo}`}
                unoptimized
              ></Image>
            </div>

            <div
              className={`
                        ${styles.ballistic_chosen_list_item} 
                        ${styles.ballistic_chosen_list_item_level}
                        ${
                          items[0].level.length > 1
                            ? styles.ballistic_chosen_list_item_level_small
                            : ''
                        }`}
            >
              <div
                className={`${styles.ballistic_chosen_list_item_level_inner}`}
              >
                <span data-text="A">A</span>
                {items[0].level.map((listItem, spanIndex) => (
                  <span key={spanIndex} data-text={listItem}>
                    {listItem}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`
                        ${styles.ballistic_chosen_list_item} 
                        ${styles.ballistic_chosen_list_item_level}
                        ${
                          items[1].level.length > 1
                            ? styles.ballistic_chosen_list_item_level_small
                            : ''
                        }`}
            >
              <div
                className={`${styles.ballistic_chosen_list_item_level_inner}`}
              >
                <span data-text="A">A</span>
                {items[1].level.map((listItem, spanIndex) => (
                  <span key={spanIndex} data-text={listItem}>
                    {listItem}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}></div>

            <div
              className={`${styles.ballistic_chosen_list_item} ${styles.ballistic_chosen_list_item_name}`}
            >
              <Image
                src={`/images/ballistic/weapon_A${items[0].level[0]}.png`}
                alt=""
                width="264"
                height="71"
                unoptimized
              ></Image>

              {items[0].name.map((listItem, spanIndex) => (
                <span key={spanIndex}>{listItem}</span>
              ))}
            </div>

            <div
              className={`${styles.ballistic_chosen_list_item} ${styles.ballistic_chosen_list_item_name}`}
            >
              <Image
                src={`/images/ballistic/weapon_A${items[1].level[0]}.png`}
                alt=""
                width="100"
                height="40"
                unoptimized
              ></Image>

              <span>{items[1].name}</span>
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="Stanag"
              >
                Stanag
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[0].stanag}`}
              >
                {items[0].stanag}
              </span>
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[1].stanag}`}
              >
                {items[1].stanag}
              </span>
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="Ul"
              >
                Ul
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[0].ul}`}
              >
                {items[0].ul}
              </span>
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[1].ul}`}
              >
                {items[1].ul}
              </span>
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="nij"
              >
                nij
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[0].nij}`}
              >
                {items[0].nij}
              </span>
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[1].nij}`}
              >
                {items[1].nij}
              </span>
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="cen"
              >
                cen
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[0].cen}`}
              >
                {items[0].cen}
              </span>
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              <span
                className={`${styles.ballistic_chosen_list_item_span}`}
                data-text={`${items[1].cen}`}
              >
                {items[1].cen}
              </span>
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="caliber"
              >
                caliber
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[0].caliber.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  data-text={listItem}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[0].caliber.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem}
                </span>
              ))}
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[1].caliber.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  data-text={listItem}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[1].caliber.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="class"
              >
                class
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[0].class.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  data-text={listItem}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[0].class.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem}
                </span>
              ))}
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[1].class.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  data-text={listItem}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[1].class.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="weight"
              >
                weight
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[0].weight.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  data-text={listItem}
                  className={`${styles.ballistic_chosen_list_item_span} ${styles.ballistic_chosen_list_item_span_weight}`}
                >
                  {listItem}
                </span>
              ))}
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[1].weight.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  data-text={listItem}
                  className={`${styles.ballistic_chosen_list_item_span} ${styles.ballistic_chosen_list_item_span_weight}`}
                >
                  {listItem}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="type"
              >
                type
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[0].type.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[0].type.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem}
                </span>
              ))}
            </div>
            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[1].type.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[1].type.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.ballistic_chosen_row}`}>
            <div className={`${styles.ballistic_chosen_list_left}`}>
              <div
                className={`${styles.ballistic_chosen_list_left_item}`}
                data-text="velocity"
              >
                velocity
              </div>
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[0].velocity.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  className={`${styles.ballistic_chosen_list_item_span} ${
                    items[0].velocity.length > 1
                      ? styles.ballistic_chosen_list_item_span_small
                      : ''
                  }`}
                >
                  {listItem.split('(')[0].trim()}
                  <br />({listItem.split('(')[1].replace(')', '')})
                </span>
              ))}
            </div>

            <div className={`${styles.ballistic_chosen_list_item}`}>
              {items[1].velocity.map((listItem, spanIndex) => (
                <span
                  key={spanIndex}
                  className={`
                        ${styles.ballistic_chosen_list_item_span}
                        ${
                          items[1].velocity.length > 1
                            ? styles.ballistic_chosen_list_item_span_small
                            : ''
                        }`}
                >
                  {listItem.split('(')[0].trim()}
                  <br />({listItem.split('(')[1].replace(')', '')})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BallisticChartChosen;
