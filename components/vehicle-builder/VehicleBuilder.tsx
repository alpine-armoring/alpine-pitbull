'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './VehicleBuilder.module.scss';

interface Option {
  id: string;
  title: string;
  info?: string;
  image?: string;
}

interface Subsection {
  id: string;
  title: string;
  type: 'select' | 'radio' | 'checkbox';
  options: Option[];
}

interface Section {
  id: string;
  title: string;
  type: 'select' | 'radio' | 'checkbox' | 'group';
  options: Option[];
  subsections?: Subsection[];
}

const VehicleBuilder: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selections, setSelections] = useState<
    Record<string, string | string[]>
  >({});
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Vehicle configuration sections
  const sections: Section[] = [
    {
      id: 'primary-use',
      title: 'Primary Use',
      type: 'group',
      options: [],
      subsections: [
        {
          id: 'end-user',
          title: 'End User',
          type: 'select',
          options: [
            { id: 'military', title: 'Military' },
            { id: 'government', title: 'Government' },
            { id: 'enterprise', title: 'Enterprise' },
            { id: 'other', title: 'Other' },
          ],
        },
        {
          id: 'application',
          title: 'Application',
          type: 'select',
          options: [
            { id: 'law-enforcement', title: 'Law Enforcement' },
            { id: 'security', title: 'Security' },
            { id: 'other', title: 'Other' },
          ],
        },
      ],
    },
    {
      id: 'fuel-type',
      title: 'Fuel Type',
      type: 'radio',
      options: [
        { id: 'gasoline', title: 'Gasoline' },
        { id: 'diesel', title: 'Diesel' },
      ],
    },
    {
      id: 'conversionOptions',
      title: 'Conversion Options',
      type: 'checkbox',
      options: [
        {
          id: 'option1',
          title: 'Battery Kill Switch',
          info: 'Allows immediate disconnection of the battery in emergency situations.',
        },
        {
          id: 'option2',
          title: 'Composite Run-Flat Inserts',
        },
        {
          id: 'option3',
          title: 'Detachable Ladder - Exterior',
        },
        {
          id: 'option4',
          title: 'Grille Guard/Bull Bar',
        },
        {
          id: 'option5',
          title: 'Gun Racks',
        },
        {
          id: 'option6',
          title: 'Heavy Duty D-Rings',
        },
        {
          id: 'option7',
          title: 'Heavy Duty Hangers',
        },
        {
          id: 'option8',
          title: 'Heavy Duty Side Steps',
        },
        {
          id: 'option9',
          title: 'Heavy Duty Trailer Hitch Step',
        },
        {
          id: 'option10',
          title: 'Heavy-Duty Vinyl Floor',
        },
        {
          id: 'option11',
          title: 'Heavy Duty Winch',
        },
        {
          id: 'option12',
          title: 'Hidden LED Grille Lights',
        },
        {
          id: 'option13',
          title: 'Inconspicuous Reinforced Bumper',
        },
        {
          id: 'option14',
          title: 'Interior Fold Down Ladder',
        },
        {
          id: 'option15',
          title: 'Mesh Screen Protection',
        },
        {
          id: 'option16',
          title: 'Mil-Spec Aircraft Tiedowns',
        },
        {
          id: 'option17',
          title: 'Privacy Curtain',
        },
        {
          id: 'option18',
          title: 'Ram Bumper',
        },
        {
          id: 'option19',
          title: 'Roof Hatch',
        },
        {
          id: 'option20',
          title: 'Roof Over-Watch Area',
        },
        {
          id: 'option21',
          title: 'Tactical Molle Racks',
        },
        {
          id: 'option22',
          title: 'Upgraded Heavy Duty Door Hinges',
        },
        {
          id: 'option23',
          title: 'Upgraded Heavy Duty Suspension',
        },
        {
          id: 'option24',
          title: 'Weapon Vault Lockbox',
        },
      ],
    },
    {
      id: 'communications',
      title: 'Communications Options',
      type: 'checkbox',
      options: [
        {
          id: 'option1',
          title: '360 Degree Monitoring System',
        },
        {
          id: 'option2',
          title: 'Golights',
        },
        {
          id: 'option3',
          title: 'Interior White/Red Crew Lights',
        },
        {
          id: 'option4',
          title: 'IR Lights',
        },
        {
          id: 'option5',
          title: 'NV Front Camera & Monitor',
        },
        {
          id: 'option6',
          title: 'PA/Multi Siren System',
        },
        {
          id: 'option7',
          title: 'Power Inverter & USB Outlets',
        },
        {
          id: 'option8',
          title: 'Rear AC Unit',
        },
        {
          id: 'option9',
          title: 'Server/Network Cabinet',
        },
        {
          id: 'option10',
          title: 'Side Camera',
        },
      ],
    },
    {
      id: 'other',
      title: 'Other',
      type: 'checkbox',
      options: [
        {
          id: 'option1',
          title: 'Bomb Jamming & Detection System',
        },
        {
          id: 'option2',
          title: 'Emergency Oxygen System',
        },
        {
          id: 'option3',
          title: 'Fire Extinguisher & First Aid Kit',
        },
      ],
    },
  ];

  // Load selections from URL query parameters
  useEffect(() => {
    const newSelections: Record<string, string | string[]> = {};

    // Process regular sections
    sections.forEach((section) => {
      if (section.type === 'group' && section.subsections) {
        // Process subsections
        section.subsections.forEach((subsection) => {
          if (subsection.type === 'checkbox') {
            const queryValues = searchParams.getAll(subsection.id);
            if (queryValues.length > 0) {
              newSelections[subsection.id] = queryValues;
            } else {
              newSelections[subsection.id] = [];
            }
          } else {
            const queryValue = searchParams.get(subsection.id);
            if (queryValue) {
              newSelections[subsection.id] = queryValue;
            }
          }
        });
      } else if (section.type === 'checkbox') {
        const queryValues = searchParams.getAll(section.id);
        if (queryValues.length > 0) {
          newSelections[section.id] = queryValues;
        } else {
          newSelections[section.id] = [];
        }
      } else {
        const queryValue = searchParams.get(section.id);
        if (queryValue) {
          newSelections[section.id] = queryValue;
        }
      }
    });

    setSelections(newSelections);
  }, [searchParams]);

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(selections).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item) params.append(key, item);
          });
        } else {
          params.append(key, value);
        }
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [selections, pathname, router]);

  // Update active section when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const scrollPosition = sidebarRef.current.scrollTop;

      // Find the section that's currently in view
      let currentSection = sections[0].id;

      sections.forEach((section) => {
        const element = sectionRefs.current[section.id];
        if (element) {
          const offsetTop = element.offsetTop - sidebarRef.current!.offsetTop;
          if (scrollPosition >= offsetTop - 50) {
            currentSection = section.id;
          }
        }
      });

      setActiveSection(currentSection);
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll);
      return () => sidebar.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to section when clicking nav item
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: element.offsetTop - sidebarRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Handle option changes
  const handleOptionChange = (
    sectionId: string,
    optionId: string,
    checked: boolean
  ) => {
    setSelections((prev) => {
      let sectionType = 'select';

      sections.forEach((section) => {
        if (section.type === 'group' && section.subsections) {
          const subsection = section.subsections.find(
            (sub) => sub.id === sectionId
          );
          if (subsection) {
            sectionType = subsection.type;
          }
        } else if (section.id === sectionId) {
          sectionType = section.type;
        }
      });

      if (sectionType === 'checkbox') {
        const prevValues = (prev[sectionId] as string[]) || [];
        let newValues: string[];

        if (checked) {
          newValues = [...prevValues, optionId];
        } else {
          newValues = prevValues.filter((id) => id !== optionId);
        }

        return { ...prev, [sectionId]: newValues };
      } else {
        return { ...prev, [sectionId]: checked ? optionId : '' };
      }
    });
  };

  // Handle card expansion
  const handleCardClick = (optionId: string) => {
    setExpandedCard((prev) => (prev === optionId ? null : optionId));
  };

  // Show info popup
  // const [activeInfoPopup, setActiveInfoPopup] = useState<string | null>(null);

  // const handleInfoClick = (e: React.MouseEvent, optionId: string) => {
  //   e.stopPropagation();
  //   setActiveInfoPopup(prev => prev === optionId ? null : optionId);
  // };

  // Check if option is selected
  const isOptionSelected = (sectionId: string, optionId: string): boolean => {
    const selection = selections[sectionId];

    if (Array.isArray(selection)) {
      return selection.includes(optionId);
    } else {
      return selection === optionId;
    }
  };

  return (
    <div className={styles.vehicleConfigurator}>
      {/* Navigation */}
      <nav className={styles.vehicleConfigurator_nav}>
        <ul className={styles.vehicleConfigurator_nav_list}>
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`${styles.vehicleConfigurator_nav_item} ${activeSection === section.id ? styles.vehicleConfigurator_nav_item_active : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Slider with Images */}
        <div className={styles.vehicleConfigurator_slider}>
          <Image
            src="https://www.alpineco.com/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Flarge_armored_audi_q7_suv_01_834e78bbb4.png&w=1920&q=100"
            width={1500}
            height={750}
            alt="Alpineco"
            objectFit="cover"
            className={styles.vehicleConfigurator_slider_featuredImage}
          />

          <button
            className={styles.vehicleConfigurator_slider_expand}
            aria-hidden="false"
            aria-expanded="true"
            aria-label="Maximise"
          >
            <i
              aria-hidden="true"
              className={styles.vehicleConfigurator_slider_expand_icon}
            >
              <Image
                src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Maximise'%20clip-path='url(%23clip0_16559_57411)'%3e%3cpath%20id='Vector'%20d='M19.5043%200.0639532C19.6997%200.145074%2019.8549%200.300301%2019.936%200.495637C19.977%200.591744%2019.9987%200.694949%2020%200.799415L20%204.79649C20%205.23799%2019.642%205.5959%2019.2005%205.5959C18.7589%205.5959%2018.4009%205.23799%2018.4009%204.79649L18.4009%202.726L13.3718%207.76231C13.2217%207.91365%2013.0174%207.99878%2012.8042%207.99878C12.591%207.99878%2012.3866%207.91365%2012.2365%207.76231C12.0851%207.61221%2012%207.40788%2012%207.19473C12%206.98158%2012.0851%206.77725%2012.2365%206.62715L17.2736%201.59883L15.2028%201.59883C14.7612%201.59883%2014.4032%201.24092%2014.4032%200.799415C14.4032%200.35791%2014.7612%200%2015.2028%200L19.2005%200C19.3049%200.00126306%2019.4082%200.0229904%2019.5043%200.0639532Z'%20fill='%230C121C'/%3e%3cpath%20id='Vector_2'%20d='M0.495714%2019.936C0.300347%2019.8549%200.145096%2019.6997%200.0639629%2019.5044C0.022994%2019.4083%200.00126314%2019.3051%201.075e-09%2019.2006L6.44997e-09%2015.2035C7.04368e-09%2014.762%200.357965%2014.4041%200.799536%2014.4041C1.24111%2014.4041%201.59907%2014.762%201.59907%2015.2035L1.59907%2017.274L6.62816%2012.2377C6.77828%2012.0863%206.98264%2012.0012%207.19583%2012.0012C7.40901%2012.0012%207.61337%2012.0863%207.7635%2012.2377C7.91486%2012.3878%208%2012.5921%208%2012.8053C8%2013.0184%207.91486%2013.2228%207.7635%2013.3729L2.72642%2018.4012H4.79722C5.23879%2018.4012%205.59675%2018.7591%205.59675%2019.2006C5.59675%2019.6421%205.23879%2020%204.79722%2020H0.799536C0.695055%2019.9987%200.591835%2019.977%200.495714%2019.936Z'%20fill='%230C121C'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_16559_57411'%3e%3crect%20width='20'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                className={styles.vehicleConfigurator_slider_expand_img}
                alt=""
                width="6"
                height="10"
                loading="lazy"
              />
            </i>
          </button>

          <div className={styles.vehicleConfigurator_slider_arrows}>
            <button
              className={`${styles.vehicleConfigurator_slider_arrows_arrow} ${styles.vehicleConfigurator_slider_arrows_arrow_prev}`}
              aria-label="Go to the previous slide"
            >
              <i
                aria-hidden="true"
                className={styles.vehicleConfigurator_slider_arrows_icon}
              >
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  data-di-rand="1747483320629"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.876364 10L0.00363632 9.11909L4.09273 5.00091L0 0.881818L0.874545 0L5.83091 4.99182L0.876364 10Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </i>
            </button>
            <div className={styles.vehicleConfigurator_slider_arrows_count}>
              1 / 7
            </div>
            <button
              className={`${styles.vehicleConfigurator_slider_arrows_arrow} ${styles.vehicleConfigurator_slider_arrows_arrow_next}`}
              aria-label="Go to the next slide"
            >
              <i
                aria-hidden="true"
                className={styles.vehicleConfigurator_slider_arrows_icon}
              >
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  data-di-rand="1747483320629"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.876364 10L0.00363632 9.11909L4.09273 5.00091L0 0.881818L0.874545 0L5.83091 4.99182L0.876364 10Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </i>
            </button>
          </div>
        </div>

        {/* Sidebar with Options */}
        <div ref={sidebarRef} className={styles.vehicleConfigurator_sidebar}>
          {sections.map((section) => (
            <div
              key={section.id}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[section.id] = el;
              }}
              className={styles.section}
            >
              <h2 className={styles.sectionTitle}>{section.title}</h2>

              {section.type === 'group' && section.subsections && (
                <div className={styles.subsections}>
                  {section.subsections.map((subsection) => (
                    <div key={subsection.id} className={styles.subsection}>
                      {/* <h3 className={styles.subsectionTitle}>{subsection.title}</h3> */}
                      <div className={styles.selectContainer}>
                        <select
                          className={styles.select}
                          value={(selections[subsection.id] as string) || ''}
                          onChange={(e) =>
                            handleOptionChange(
                              subsection.id,
                              e.target.value,
                              true
                            )
                          }
                          name={subsection.title}
                          id={subsection.title}
                        >
                          <option value="">{subsection.title}</option>
                          {subsection.options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'select' && (
                <div className={styles.selectContainer}>
                  <select
                    className={styles.select}
                    value={(selections[section.id] as string) || ''}
                    onChange={(e) =>
                      handleOptionChange(section.id, e.target.value, true)
                    }
                  >
                    <option value="">Select an option</option>
                    {section.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {section.type === 'radio' && (
                <div className={styles.vehicleConfigurator_radioGroup}>
                  {section.options.map((option) => (
                    <div
                      key={option.id}
                      className={`radioCustom`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="radio"
                        id={option.id}
                        name={section.id}
                        checked={isOptionSelected(section.id, option.id)}
                        onChange={(e) =>
                          handleOptionChange(
                            section.id,
                            option.id,
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor={option.id}>{option.title}</label>
                    </div>
                    // <div key={option.id} className={styles.vehicleConfigurator_radioGroup_item}>
                    //   <input
                    //     type="radio"
                    //     id={option.id}
                    //     name={section.id}
                    //     checked={isOptionSelected(section.id, option.id)}
                    //     onChange={e => handleOptionChange(section.id, option.id, e.target.checked)}
                    //     className={styles.radioInput}
                    //   />
                    //   <label htmlFor={option.id} className={styles.radioLabel}>{option.title}</label>
                    // </div>
                  ))}
                </div>
              )}

              {section.type === 'checkbox' && (
                <div className={styles.vehicleConfigurator_card_list}>
                  {section.options.map((option) => (
                    <div
                      key={option.id}
                      className={`${styles.vehicleConfigurator_card_wrap} ${expandedCard === option.id ? styles.vehicleConfigurator_card_wrap_expanded : ''}`}
                    >
                      <div
                        className={`${styles.vehicleConfigurator_card}`}
                        onClick={() => handleCardClick(option.id)}
                      >
                        <span>{option.title}</span>
                        <div className={styles.optionControls}>
                          {/* <button
                            className={styles.infoButton}
                            onClick={e => handleInfoClick(e, option.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </button> */}
                          {/* <input
                            type="checkbox"
                            id={option.id}
                            checked={isOptionSelected(section.id, option.id)}
                            onChange={e => handleOptionChange(section.id, option.id, e.target.checked)}
                            onClick={e => e.stopPropagation()}
                            className={styles.checkbox}
                          /> */}
                          <div
                            className={`${styles.vehicleConfigurator_card_checkbox} checkboxCustom`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              id={option.id}
                              checked={isOptionSelected(section.id, option.id)}
                              onChange={(e) =>
                                handleOptionChange(
                                  section.id,
                                  option.id,
                                  e.target.checked
                                )
                              }
                            />
                            <label htmlFor={option.id}></label>
                          </div>
                        </div>
                      </div>

                      {/* Info Popup */}
                      {/* {activeInfoPopup === option.id && (
                        <div className={styles.infoPopup}>
                          <p>{option.info}</p>
                        </div>
                      )} */}

                      {/* Expanded Content */}
                      {expandedCard === option.id && (
                        <div
                          className={styles.vehicleConfigurator_card_content}
                        >
                          <div
                            className={
                              styles.vehicleConfigurator_card_content_img
                            }
                          >
                            <Image
                              src={
                                option.image ||
                                'https://www.alpineco.com/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Fthumbnail_PA_Multi_Siren_System_0c05e10790.jpg&w=640&q=75'
                              }
                              alt={option.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Summary Button */}
      <div className={styles.vehicleConfigurator_bottomBar}>
        <h4 className={styles.vehicleConfigurator_bottomBar_title}>
          Armored Audi Q7
        </h4>

        <button
          className={styles.vehicleConfigurator_bottomBar_button}
          onClick={() => setShowSummary((prev) => !prev)}
        >
          {showSummary ? 'Hide Summary' : 'Summary'}
        </button>

        {showSummary && (
          <div className={styles.summaryContent}>
            <h3 className={styles.summaryTitle}>Your Vehicle Configuration</h3>
            <div className={styles.summaryItems}>
              {sections.map((section) => {
                if (section.type === 'group' && section.subsections) {
                  return (
                    <div key={section.id} className={styles.summaryItem}>
                      <p className={styles.summaryLabel}>{section.title}:</p>
                      <div className={styles.summaryGroup}>
                        {section.subsections.map((subsection) => (
                          <div
                            key={subsection.id}
                            className={styles.summarySubitem}
                          >
                            <p className={styles.summarySubLabel}>
                              {subsection.title}:
                            </p>
                            <p>
                              {selections[subsection.id]
                                ? subsection.options.find(
                                    (o) => o.id === selections[subsection.id]
                                  )?.title
                                : 'None selected'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={section.id} className={styles.summaryItem}>
                      <p className={styles.summaryLabel}>{section.title}:</p>
                      {section.type === 'checkbox' ? (
                        <ul className={styles.summaryList}>
                          {((selections[section.id] as string[]) || []).map(
                            (selectedId) => {
                              const option = section.options.find(
                                (o) => o.id === selectedId
                              );
                              return option ? (
                                <li key={selectedId}>{option.title}</li>
                              ) : null;
                            }
                          )}
                        </ul>
                      ) : (
                        <p>
                          {selections[section.id]
                            ? section.options.find(
                                (o) => o.id === selections[section.id]
                              )?.title
                            : 'None selected'}
                        </p>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleBuilder;
