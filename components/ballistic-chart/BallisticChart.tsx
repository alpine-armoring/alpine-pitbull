'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './BallisticChart.module.scss';
import HeaderItem from './BallisticChartHeaderItem';
import NavigationItem from './BallisticChartNavigationItem';
import TableRow from './BallisticChartTableRow';
import dynamic from 'next/dynamic';
const BallisticChartChosen = dynamic(() => import('./BallisticChartChosen'));

const BallisticChart = () => {
  const items = [
    {
      name: ['.38 Special'],
      caliber: ['9 x 29mmR'],
      class: ['Revolver'],
      stanag: '-',
      ul: '1',
      level: ['1'],
      nij: 'HG1',
      cen: 'BR1',
      weight: ['125 grains', '8.09 grams'],
      type: ['FMJ'],
      typeFull: ['Full Metal Jacket'],
      velocity: ['1,075 ft/s (328 m/s)'],
    },
    {
      name: ['9mm Luger'],
      caliber: ['9 x 19mm'],
      class: ['Handgun'],
      stanag: '-',
      ul: '1',
      level: ['2'],
      nij: 'HG1',
      cen: 'BR2',
      weight: ['124 grains', '15.55 grams'],
      type: ['FMJ/RN'],
      typeFull: ['Full Metal Jacket / Round Nose'],
      velocity: ['1,305 ft/s (398 m/s)'],
    },
    {
      name: ['.357 Magnum'],
      caliber: ['9 x 33mmR'],
      class: ['Revolver'],
      stanag: '-',
      ul: '2',
      level: ['3'],
      nij: 'HG1',
      cen: 'BR3',
      weight: ['158 grains', '10.23 grams'],
      type: ['FMJ/JSP'],
      typeFull: ['Full Metal Jacket / Jacketed Soft Point'],
      velocity: ['1,430 ft/s (436 m/s)'],
    },
    {
      name: ['.44 Magnum'],
      caliber: ['11 x 33mmR'],
      class: ['Revolver'],
      stanag: '-',
      ul: '3',
      level: ['4'],
      nij: 'HG2',
      cen: 'BR4',
      weight: ['240 grains', '15.55 grams'],
      type: ['JHP'],
      typeFull: ['Jacketed Hollow Point'],
      velocity: ['1,430 ft/s (436 m/s)'],
    },
    {
      name: ['Shotgun'],
      caliber: ['12 Gauge'],
      class: ['Shotgun'],
      stanag: '-',
      ul: '4',
      level: ['S', 'G'],
      nij: 'HG2+',
      cen: 'SG2',
      weight: ['436 grains', '28.25 grams'],
      type: ['Slug'],
      velocity: ['1,650 ft/s (503 m/s)'],
    },
    {
      name: ['300AAC Blackout', 'Tokarev'],
      caliber: ['7.62 x 35mm', '7.62 x 25mm'],
      class: ['Carbine', 'Handgun'],
      stanag: 'I',
      ul: '5',
      level: ['5'],
      nij: 'RF1',
      cen: 'BR4+',
      weight: ['84 grains', '5.50 grams', '125 grains', '9.10 grams'],
      type: ['FMJ', 'LCSJ'],
      typeFull: ['Full Metal Jacket'],
      velocity: ['2,185 ft/s (666 m/s)', '1,600 ft/s (488 m/s)'],
    },
    {
      name: ['AK-47/Kalashnikov'],
      caliber: ['7.62 x 39mm'],
      class: ['Rifle'],
      stanag: 'I',
      ul: '5',
      level: ['6'],
      nij: 'RF1',
      cen: 'BR5',
      weight: ['120 grains', '7.77 grams'],
      type: ['FMJ'],
      typeFull: ['Full Metal Jacket'],
      velocity: ['2,380 ft/s (725 m/s)'],
    },
    {
      name: ['M4/M16'],
      caliber: ['5.56 x 45mm (M193)'],
      class: ['Carbine'],
      stanag: 'I',
      ul: '5',
      level: ['7'],
      nij: 'RF1',
      cen: 'BR5',
      weight: ['56 grains', '3.63 grams'],
      type: ['FMJ/BT'],
      typeFull: ['Full Metal Jacket / Boattail Bullet'],
      velocity: ['3,210 ft/s (978 m/s)'],
    },
    {
      name: ['M4/M16'],
      caliber: ['5.56 x 45mm NATO', '(SS109)'],
      class: ['Carbine'],
      stanag: 'I',
      ul: '5',
      level: ['8'],
      nij: 'RF1',
      cen: 'BR5',
      weight: ['62 grains', '4 grams'],
      type: ['FMJ/BT'],
      typeFull: ['Full Metal Jacket / Boattail Bullet'],
      velocity: ['3,110 ft/s (948 m/s)'],
    },
    {
      name: ['Remington 700'],
      caliber: ['.308 or 7.62 x 51mm', '(M80 Ball)'],
      class: ['Rifle'],
      stanag: 'I',
      ul: '8',
      level: ['9'],
      nij: 'RF2',
      cen: 'BR6+',
      weight: ['149 grains', '9.65 grams'],
      type: ['FMJ Ball'],
      typeFull: ['Full Metal Jacket'],
      velocity: ['2,780 ft/s (847 m/s)'],
    },
    {
      name: ['AK-47', 'M4'],
      caliber: ['7.62 x 39mm API BZ', '5.56 x 45mm GT AP (M855)'],
      class: ['Rifle', 'Carbine'],
      stanag: 'II',
      ul: '9',
      level: ['10'],
      nij: 'RF2',
      cen: 'BR7',
      weight: ['122/62 grains', '7.90/4.02 grams'],
      type: ['API/PB/HC', 'GT/AP/BT'],
      typeFull: [
        'Armor Piercing Incendiary/Pointed Bullet/Hard Core',
        'Green Tip AP/Armor Piercing/Boattail Bullet',
      ],
      velocity: ['2,395 ft/s (730 m/s)', '3,020 ft/s (920 m/s)'],
    },
    {
      name: ['M1 Garand', 'Remington 700', 'Dragunov'],
      caliber: ['7.62 x 63 M2 AP', '7.62 x 51 NATO AP', '7.62 x 54mmR API'],
      class: ['Rifle', 'Sniper Rifle', 'Sniper Rifle'],
      stanag: 'III',
      ul: '9',
      level: ['11'],
      nij: 'RF3',
      cen: 'BR7',
      weight: ['165/151/154', 'grains', '10.69/9.78/9.98', 'grams'],
      type: ['FMJ/PB/HC', 'FMJ/PB/HC/WC', 'API/PB/HC'],
      typeFull: [
        'Full Metal Jacket/Pointed Bullet/Hard Core',
        'Full Metal Jacket/Pointed Bullet/Hard Core/Wadcutter',
        'Armor Piercing Incendiary/Pointed Bullet/Hard Core',
      ],
      velocity: [
        '2,880 ft/s (878 m/s)',
        '2,690 ft/s (820 m/s)',
        '2,820 ft/s (860 m/s)',
      ],
    },
    {
      name: ['Barrett'],
      caliber: ['.50 BMG (12.7 x 99mm)'],
      class: ['Rifle'],
      stanag: 'III+',
      ul: '10+',
      level: ['12'],
      nij: 'RF3+',
      cen: 'BR7+',
      weight: ['661 grains', '42.83 grams'],
      type: ['FMJ/Ball'],
      typeFull: ['Full Metal Jacket/Ball'],
      velocity: ['3,080 ft/s (940 m/s)'],
    },
  ];

  // State
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChosen, setShowChosen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[][]>([]);
  const [moreSelected, setMoreSelected] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isContainerInView, setIsContainerInView] = useState(false);
  const [isComparisonActive, setIsComparisonActive] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const interactedPopupRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleRowSelection = (index: number) => {
    const currentSelectedRows = [...selectedRows];
    const currentSelectedLevels = [...selectedLevels];
    const row = tableRef.current?.children[index] as HTMLElement;
    const isActive = row.classList.contains(styles.ballistic_row_active);
    const isMobile = window.innerWidth < 1280;

    if (window.innerWidth >= 1280) {
      setIsComparisonActive(true);
    }

    if (isActive) {
      handleDeselection(row, currentSelectedRows, currentSelectedLevels, index);
    } else if (currentSelectedRows.length < 2) {
      handleNewSelection(
        row,
        currentSelectedRows,
        currentSelectedLevels,
        index,
        isMobile
      );
    } else if (isMobile) {
      setShowPopup(true);
      setMoreSelected(true);
    }

    if (isMobile) {
      setSelectedRows(currentSelectedRows);
      setSelectedLevels(currentSelectedLevels);
    }
  };

  const handleDeselection = (
    row: HTMLElement,
    currentSelectedRows: number[],
    currentSelectedLevels: string[][],
    index: number
  ) => {
    row.classList.remove(styles.ballistic_row_active);
    setShowPopup(false);

    if (
      document.querySelectorAll(`.${styles.ballistic_row_active}`).length < 1
    ) {
      setIsComparisonActive(false);
    }

    if (window.innerWidth < 1280) {
      const rowIndex = currentSelectedRows.indexOf(index);
      currentSelectedRows.splice(rowIndex, 1);
      currentSelectedLevels.splice(rowIndex, 1);
      setMoreSelected(false);
    }
  };

  const handleNewSelection = (
    row: HTMLElement,
    currentSelectedRows: number[],
    currentSelectedLevels: string[][],
    index: number,
    isMobile: boolean
  ) => {
    row.classList.add(styles.ballistic_row_active);
    if (isMobile) {
      currentSelectedRows.push(index);
      if (items[index]?.level) {
        currentSelectedLevels.push(items[index].level);
      }
      setShowPopup(true);
    }
  };

  // Effects
  useEffect(() => {
    if (window.innerWidth < 1280) {
      const handleScroll = () => {
        if (window.pageYOffset > 100) {
          const ballisticElement = document.querySelector(
            `.${styles.ballistic}`
          );
          ballisticElement?.classList.add(styles.ballistic_active);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1280) {
      const handleInteraction = () => {
        if (!hasInteracted && window.pageYOffset > 100) {
          setHasInteracted(true);
        } else {
          interactedPopupRef.current?.classList.add(
            styles.ballistic_popup_interact_disable
          );
        }
      };

      const currentContainer = containerRef.current;
      currentContainer?.addEventListener('touchstart', handleInteraction);
      return () =>
        currentContainer?.removeEventListener('touchstart', handleInteraction);
    }
  }, [hasInteracted]);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      const options = {
        root: null,
        rootMargin: '0px 0px -97%',
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsContainerInView(true);
          } else {
            setIsContainerInView(false);
          }
        });
      }, options);

      const currentContainer = containerRef.current;
      if (currentContainer) {
        observer.observe(currentContainer);
      }

      return () => {
        if (currentContainer) {
          observer.unobserve(currentContainer);
        }
      };
    }
  }, []);

  // Render helpers
  const renderHeaderItems = () => (
    <div className={styles.ballistic_header_inner}>
      <HeaderItem
        src="ballistic_logo"
        alt="Pit-Bull®"
        mobileWidth={132}
        mobileHeight={47}
        desktopWidth={80}
        desktopHeight={122}
        styles={styles}
      />
      <HeaderItem
        src="heading_weapon"
        alt="Weapon"
        mobileWidth={243}
        mobileHeight={64}
        desktopWidth={230}
        desktopHeight={50}
        styles={styles}
      />
      <HeaderItem
        src="heading_levels"
        alt="Levels"
        mobileWidth={227}
        mobileHeight={64}
        desktopWidth={353}
        desktopHeight={143}
        styles={styles}
      />
      <HeaderItem
        src="heading_projectile"
        alt="Projectile"
        mobileWidth={303}
        mobileHeight={92}
        desktopWidth={379}
        desktopHeight={135}
        styles={styles}
      />
      <HeaderItem
        src="ballistic_logo"
        alt="No one protects you better."
        desktopWidth={80}
        desktopHeight={122}
        styles={styles}
      />
    </div>
  );

  const renderNavigation = () => (
    <div className={styles.ballistic_navigation}>
      <NavigationItem label="" />
      <NavigationItem label="Name" />
      <NavigationItem label="Caliber" />
      <NavigationItem label="Class" />
      <NavigationItem
        label="Stanag"
        imageSrc="stanag.png"
        imageWidth={67}
        imageHeight={24}
      />
      <NavigationItem
        label="UL"
        imageSrc="chartNav_ul.png"
        imageWidth={32}
        imageHeight={17}
      />
      <NavigationItem
        label="Pit-Bull®"
        imageSrc="alpine.png"
        imageWidth={103}
        imageHeight={20}
      />
      <NavigationItem
        label="Nij"
        imageSrc="nij.png"
        imageWidth={37}
        imageHeight={20}
      />
      <NavigationItem
        label="Cen"
        imageSrc="chartNav_cen.png"
        imageWidth={35}
        imageHeight={23}
      />
      <NavigationItem label="Weight±" />
      <NavigationItem label="Type" />
      <NavigationItem label="Velocity±" />
      <NavigationItem label="Compare" />
      <NavigationItem label="" />
    </div>
  );

  return (
    <>
      <div className={styles.ballistic}>
        <div
          className={`${styles.ballistic_wrapper} ${isComparisonActive ? styles.ballistic_comparisonActive : ''} ${isContainerInView ? styles.ballistic_wrapper_view : ''}`}
          ref={containerRef}
        >
          <div className={styles.ballistic_header}>
            {renderHeaderItems()}
            {renderNavigation()}
          </div>
          <div className={styles.ballistic_table} ref={tableRef}>
            {items.map((item, index) => (
              <TableRow
                key={index}
                item={item}
                index={index}
                onRowSelect={handleRowSelection}
                styles={styles}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interaction Popup */}
      {hasInteracted && (
        <div
          className={`${styles.ballistic_popup} ${styles.ballistic_popup_interact} ${
            hasInteracted ? styles.ballistic_popup_active : ''
          }`}
          ref={interactedPopupRef}
        >
          <div className={styles.ballistic_popup_text}>
            To view the entire chart, scroll horizontally and vertically.
            <br />
            You can compare levels by toggling the button on the far right.
          </div>
        </div>
      )}

      {/* Selection Popup */}
      {showPopup && (
        <div
          className={`${styles.ballistic_popup} ${showPopup ? styles.ballistic_popup_active : ''}`}
        >
          <div className={styles.ballistic_popup_text}>
            {selectedLevels && selectedLevels.length > 0 && !moreSelected && (
              <div>
                Level A
                <span
                  className={
                    selectedLevels[selectedLevels.length - 1].length === 2
                      ? styles.ballistic_popup_text_levels
                      : ''
                  }
                >
                  {selectedLevels[selectedLevels.length - 1]}{' '}
                </span>
                successfully added to comparison list
              </div>
            )}
            {selectedLevels && selectedLevels.length === 1 && (
              <div>Select one more level to see the comparison</div>
            )}
            {moreSelected && <div>You can compare only two levels</div>}
          </div>

          {selectedLevels && selectedLevels.length === 2 && (
            <button
              className={styles.ballistic_popup_button}
              onClick={() => setShowChosen(true)}
            >
              See list
            </button>
          )}

          <div
            className={styles.ballistic_popup_close}
            data-text="Close"
            onClick={() => setShowPopup(false)}
          >
            Close
          </div>
        </div>
      )}

      {/* Comparison View */}
      {showChosen && (
        <BallisticChartChosen
          items={selectedRows.map((index) => items[index])}
          onClose={() => {
            setShowPopup(false);
            setShowChosen(false);
          }}
        />
      )}
    </>
  );
};

export default BallisticChart;
