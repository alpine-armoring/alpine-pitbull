'use client';

import { useLenis } from 'lenis/react';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './VehicleBuilder.module.scss';
import Slider from '@/components/slider/Slider';
import ConfiguratorForm from './ConfiguratorForm';

interface Option {
  title: string;
  info?: string;
  image?: string;
}

interface Subsection {
  title: string;
  type: 'select' | 'radio' | 'checkbox';
  options: Option[];
}

interface Section {
  title: string;
  type: 'select' | 'radio' | 'checkbox' | 'group';
  options: Option[];
  subsections?: Subsection[];
}

const slugify = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

const VehicleBuilder = ({ configuratorMedia }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selections, setSelections] = useState<
    Record<string, string | string[]>
  >({});
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Vehicle configuration sections
  const sections: Section[] = [
    {
      title: 'Primary Use',
      type: 'group',
      options: [],
      subsections: [
        {
          title: 'End User',
          type: 'select',
          options: [
            { title: 'Military' },
            { title: 'Government' },
            { title: 'Enterprise' },
            { title: 'Other' },
          ],
        },
        // {
        //   title: 'Application',
        //   type: 'select',
        //   options: [
        //     { title: 'Law Enforcement' },
        //     { title: 'Security' },
        //     { title: 'Other' },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'Fuel Type',
    //   type: 'radio',
    //   options: [{ title: 'Gasoline' }, { title: 'Diesel' }],
    // },
    {
      title: 'Communications & Electronics Options',
      type: 'checkbox',
      options: [
        {
          title: `360-degree LED lighting package<br>(includes front grille, visors, rear lights)`,
        },
        {
          title:
            '360-degree camera package<br>(side mounted, front mounted, and rear backup, with front dash and rear crew monitors)',
        },
        { title: 'Interior LED Red & White lighting' },
        { title: 'Multi-sound public address siren system' },
        { title: 'Red/Blue LED 360-degree police lighting package' },
        { title: 'IR Lights' },
      ],
    },
    {
      title: 'Conversion Options',
      type: 'checkbox',
      options: [
        { title: 'Manual platform lift' },
        { title: 'Rear cabin exhaust system' },
        { title: 'USBc/USB & 110V outlets on rear crew bench seat' },
        { title: 'Secured gun racks' },
        { title: 'Battery Killswitch' },
        { title: 'Heavy-duty brake kit (Rotors & Upgraded Brake Pad)' },
        { title: 'Roof hatch' },
        { title: 'Power winch' },
        { title: 'Jump Seat' },
        { title: '360-degree rotating bearing for roof hatch' },
        { title: 'Front-mounted hydraulic ram system' },
        { title: 'Front driver and passenger power windows' },
        { title: 'Mesh screen protection' },
        { title: 'Fire extinguisher & first aid kit' },
        { title: 'Chemical munitions box' },
      ],
    },
  ];

  // Load selections from URL query parameters
  useEffect(() => {
    const newSelections: Record<string, string | string[]> = {};
    const orderFromURL: string[] = [];

    // Get all parameter names in the order they appear in the URL
    for (const [key] of searchParams.entries()) {
      if (!orderFromURL.includes(key)) {
        orderFromURL.push(key);
      }
    }

    // Process regular sections
    sections.forEach((section) => {
      if (section.type === 'group' && section.subsections) {
        section.subsections.forEach((subsection) => {
          const sectionKey = slugify(subsection.title);
          if (subsection.type === 'checkbox') {
            const queryValues = searchParams.getAll(sectionKey);
            // Convert slugs back to titles
            const titles = queryValues
              .map(
                (slug) =>
                  subsection.options.find((opt) => slugify(opt.title) === slug)
                    ?.title
              )
              .filter(Boolean) as string[];
            newSelections[sectionKey] = titles;
          } else {
            const queryValue = searchParams.get(sectionKey);
            if (queryValue) {
              const title = subsection.options.find(
                (opt) => slugify(opt.title) === queryValue
              )?.title;
              if (title) {
                newSelections[sectionKey] = title;
              }
            }
          }
        });
      } else {
        const sectionKey = slugify(section.title);
        if (section.type === 'checkbox') {
          const queryValues = searchParams.getAll(sectionKey);
          const titles = queryValues
            .map(
              (slug) =>
                section.options.find((opt) => slugify(opt.title) === slug)
                  ?.title
            )
            .filter(Boolean) as string[];
          newSelections[sectionKey] = titles;
        } else {
          const queryValue = searchParams.get(sectionKey);
          if (queryValue) {
            const title = section.options.find(
              (opt) => slugify(opt.title) === queryValue
            )?.title;
            if (title) {
              newSelections[sectionKey] = title;
            }
          }
        }
      }
    });

    setSelections(newSelections);
    setSelectionOrder(orderFromURL);
  }, [searchParams]);

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams();

    selectionOrder.forEach((key) => {
      const value = selections[key];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((title) => {
            if (title) {
              params.append(key, slugify(title));
            }
          });
        } else {
          params.append(key, slugify(value));
        }
      }
    });

    Object.entries(selections).forEach(([key, value]) => {
      if (!selectionOrder.includes(key) && value) {
        if (Array.isArray(value)) {
          value.forEach((title) => {
            if (title) {
              params.append(key, slugify(title));
            }
          });
        } else {
          params.append(key, slugify(value));
        }
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;

    // Use replaceState to update URL without triggering navigation/scroll
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
  }, [selections, selectionOrder, pathname]);

  // Update active section when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const scrollPosition = sidebarRef.current.scrollTop;

      // Find the section that's currently in view
      let currentSection = slugify(sections[0]?.title);

      sections.forEach((section) => {
        const sectionKey = slugify(section.title);
        const element = sectionRefs.current[sectionKey];
        if (element) {
          const offsetTop = element.offsetTop - sidebarRef.current!.offsetTop;
          if (scrollPosition >= offsetTop - 50) {
            currentSection = sectionKey;
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
  const scrollToSection = (sectionKey: string) => {
    const element = sectionRefs.current[sectionKey];
    if (element && sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: element.offsetTop - sidebarRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Handle option changes
  const handleOptionChange = (
    sectionTitle: string,
    optionTitle: string,
    checked: boolean
  ) => {
    const sectionKey = slugify(sectionTitle);

    setSelections((prev) => {
      let sectionType = 'select';

      // Find section type
      sections.forEach((section) => {
        if (section.type === 'group' && section.subsections) {
          const subsection = section.subsections.find(
            (sub) => slugify(sub.title) === sectionKey
          );
          if (subsection) {
            sectionType = subsection.type;
          }
        } else if (slugify(section.title) === sectionKey) {
          sectionType = section.type;
        }
      });

      if (sectionType === 'checkbox') {
        const prevValues = (prev[sectionKey] as string[]) || [];
        let newValues: string[];

        if (checked) {
          newValues = [...prevValues, optionTitle];
        } else {
          newValues = prevValues.filter((title) => title !== optionTitle);
        }

        return { ...prev, [sectionKey]: newValues };
      } else {
        return { ...prev, [sectionKey]: checked ? optionTitle : '' };
      }
    });

    setSelectionOrder((prevOrder) => {
      if (!prevOrder.includes(sectionKey)) {
        return [...prevOrder, sectionKey];
      }
      return prevOrder;
    });
  };

  // Radio button handler
  const handleRadioClick = (sectionTitle: string, optionTitle: string) => {
    const sectionKey = slugify(sectionTitle);

    setSelections((prev) => {
      const currentSelection = prev[sectionKey];

      if (currentSelection === optionTitle) {
        return { ...prev, [sectionKey]: '' };
      } else {
        return { ...prev, [sectionKey]: optionTitle };
      }
    });

    setSelectionOrder((prevOrder) => {
      if (!prevOrder.includes(sectionKey)) {
        return [...prevOrder, sectionKey];
      }
      return prevOrder;
    });
  };

  // Handle card expansion
  const handleCardClick = (optionTitle: string) => {
    const optionKey = slugify(optionTitle);
    setExpandedCard((prev) => (prev === optionKey ? null : optionKey));
  };

  // Check if option is selected
  const isOptionSelected = (
    sectionTitle: string,
    optionTitle: string
  ): boolean => {
    const sectionKey = slugify(sectionTitle);
    const selection = selections[sectionKey];

    if (Array.isArray(selection)) {
      return selection.includes(optionTitle);
    } else {
      return selection === optionTitle;
    }
  };

  useEffect(() => {
    const sidebar = sidebarRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!sidebar) return;

      // Check if the mouse is over the sidebar
      const rect = sidebar.getBoundingClientRect();
      const isMouseOverSidebar =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isMouseOverSidebar) {
        // Stop Lenis from handling this scroll event
        e.preventDefault();
        e.stopPropagation();

        // Temporarily stop Lenis
        if (lenis) {
          lenis.stop();
        }

        // Apply scroll to sidebar
        sidebar.scrollTop += e.deltaY;

        // Re-enable Lenis after a short delay
        setTimeout(() => {
          if (lenis) {
            lenis.start();
          }
        }, 100);
      }
    };

    if (sidebar) {
      // Use capture phase to intercept before Lenis
      document.addEventListener('wheel', handleWheel, {
        passive: false,
        capture: true,
      });

      return () => {
        document.removeEventListener('wheel', handleWheel, { capture: true });
      };
    }
  }, [lenis]);

  return (
    <>
      <div className={`${styles.vehicleConfigurator_heading} c-content`}>
        <h2 className={`${styles.vehicleConfigurator_title} c-title`}>
          Build Your Pit-Bull®
        </h2>
      </div>

      <div className={styles.vehicleConfigurator}>
        {/* Navigation */}
        <nav className={styles.vehicleConfigurator_nav}>
          <ul className={styles.vehicleConfigurator_nav_list}>
            {sections.map((section) => {
              const sectionKey = slugify(section.title);
              return (
                <li key={sectionKey}>
                  <button
                    className={`${styles.vehicleConfigurator_nav_item} ${activeSection === sectionKey ? styles.vehicleConfigurator_nav_item_active : ''}`}
                    onClick={() => scrollToSection(sectionKey)}
                  >
                    {section.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <div className={styles.vehicleConfigurator_mainContent}>
          {/* Slider */}
          <div className={styles.vehicleConfigurator_slider}>
            <Slider
              media={configuratorMedia?.data || []}
              className={styles.vehicleConfigurator_mediaSlider}
            />
          </div>

          {/* Sidebar with Options */}
          <div ref={sidebarRef} className={styles.vehicleConfigurator_sidebar}>
            {sections.map((section) => {
              const sectionKey = slugify(section.title);
              return (
                <div
                  key={sectionKey}
                  ref={(el: HTMLDivElement | null) => {
                    sectionRefs.current[sectionKey] = el;
                  }}
                  className={styles.vehicleConfigurator_section}
                >
                  <h3 className={styles.vehicleConfigurator_section_title}>
                    {section.title}
                    {section.options.length > 2 && (
                      <span>({section.options?.length})</span>
                    )}
                  </h3>

                  {section.type === 'group' && section.subsections && (
                    <div className={styles.subsections}>
                      {section.subsections.map((subsection) => (
                        <div
                          key={slugify(subsection.title)}
                          className={styles.vehicleConfigurator_subsection}
                        >
                          <select
                            className={`${styles.vehicleConfigurator_select} ${
                              selections[slugify(subsection.title)]
                                ? styles.vehicleConfigurator_select_active
                                : ''
                            }`}
                            value={
                              (selections[
                                slugify(subsection.title)
                              ] as string) || ''
                            }
                            onChange={(e) =>
                              handleOptionChange(
                                subsection.title,
                                e.target.value,
                                true
                              )
                            }
                            name={subsection.title}
                            id={subsection.title}
                          >
                            <option value="">{subsection.title}</option>
                            {subsection.options.map((option) => (
                              <option
                                key={slugify(option.title)}
                                value={option.title}
                              >
                                {option.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'radio' && (
                    <div className={styles.vehicleConfigurator_radioGroup}>
                      {section.options.map((option) => (
                        <div
                          key={slugify(option.title)}
                          className={`radioCustom`}
                        >
                          <input
                            type="radio"
                            id={slugify(option.title)}
                            name={slugify(section.title)}
                            checked={isOptionSelected(
                              section.title,
                              option.title
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleRadioClick(section.title, option.title);
                            }}
                          />
                          <label
                            htmlFor={slugify(option.title)}
                            onClick={(e) => {
                              e.preventDefault();
                              handleRadioClick(section.title, option.title);
                            }}
                          >
                            {option.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'checkbox' && (
                    <div className={styles.vehicleConfigurator_card_list}>
                      {section.options.map((option) => {
                        const optionKey = slugify(option.title);
                        return (
                          <div
                            key={optionKey}
                            className={`${styles.vehicleConfigurator_card_wrap} 
                                      ${expandedCard === optionKey ? styles.vehicleConfigurator_card_wrap_expanded : ''} 
                                      ${isOptionSelected(section.title, option.title) ? styles.vehicleConfigurator_card_wrap_active : ''}`}
                          >
                            <div
                              className={`${styles.vehicleConfigurator_card}`}
                              onClick={() => handleCardClick(option.title)}
                            >
                              <div
                                className={`${styles.vehicleConfigurator_card_checkbox} checkboxCustom`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  id={optionKey}
                                  checked={isOptionSelected(
                                    section.title,
                                    option.title
                                  )}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      section.title,
                                      option.title,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label htmlFor={optionKey}></label>
                              </div>

                              <span
                                className={`${styles.vehicleConfigurator_card_title}`}
                                dangerouslySetInnerHTML={{
                                  __html: option.title,
                                }}
                              ></span>

                              <span
                                className={styles.vehicleConfigurator_card_info}
                              >
                                <svg
                                  viewBox="0 0 32 32"
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="100%"
                                  width="100%"
                                  preserveAspectRatio="xMidYMid meet"
                                  focusable="false"
                                >
                                  <path
                                    data-name="Pfad 7209"
                                    d="M14.8 9.65h2.63v2.63H14.8Zm0 5.25h2.63v7.86H14.8Z"
                                  />
                                  <path d="M16 31.85A15.85 15.85 0 1 1 31.85 16 15.86 15.86 0 0 1 16 31.85Zm0-30.59A14.75 14.75 0 1 0 30.76 16 14.76 14.76 0 0 0 16 1.26Z" />
                                </svg>
                              </span>
                            </div>

                            {/* Expanded Content */}
                            {expandedCard === optionKey && (
                              <div
                                className={
                                  styles.vehicleConfigurator_card_content
                                }
                              >
                                <div
                                  className={
                                    styles.vehicleConfigurator_card_content_img
                                  }
                                >
                                  <Image
                                    src={
                                      option.image ||
                                      'https://d102sycao8uwt8.cloudfront.net/Battery_kill_switch_4a364fe17c.jpg'
                                    }
                                    alt={option.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Summary */}
        <div className={styles.vehicleConfigurator_bottomBar}>
          <div className={styles.vehicleConfigurator_bottomBar_heading}>
            <h3 className={styles.vehicleConfigurator_bottomBar_title}>
              Pit-Bull VXT® Armored Tactical SWAT/APC Truck
            </h3>
          </div>

          <div className={styles.vehicleConfigurator_summary}>
            <div className={styles.vehicleConfigurator_summary_items}>
              <h3 className={styles.vehicleConfigurator_summary_title}>
                Your Vehicle Configuration
              </h3>

              {sections.map((section) => {
                const sectionKey = slugify(section.title);

                if (section.type === 'group' && section.subsections) {
                  // Check if any subsection has selections
                  const hasAnySubsectionSelections = section.subsections.some(
                    (subsection) => {
                      const subsectionKey = slugify(subsection.title);
                      const selection = selections[subsectionKey];
                      return (
                        selection &&
                        ((Array.isArray(selection) && selection.length > 0) ||
                          (!Array.isArray(selection) && selection !== ''))
                      );
                    }
                  );

                  if (!hasAnySubsectionSelections) return null;

                  return (
                    <div
                      key={sectionKey}
                      className={styles.vehicleConfigurator_summary_item}
                    >
                      <p className={styles.vehicleConfigurator_summary_label}>
                        {section.title}:
                      </p>
                      <div className={styles.vehicleConfigurator_summary_group}>
                        {section.subsections.map((subsection) => {
                          const subsectionKey = slugify(subsection.title);
                          const selection = selections[subsectionKey];
                          const hasSelection =
                            selection &&
                            ((Array.isArray(selection) &&
                              selection.length > 0) ||
                              (!Array.isArray(selection) && selection !== ''));

                          if (!hasSelection) return null;

                          return (
                            <div
                              key={subsectionKey}
                              className={
                                styles.vehicleConfigurator_summary_subitem
                              }
                            >
                              <span
                                className={
                                  styles.vehicleConfigurator_summary_subLabel
                                }
                              >
                                {subsection.title}: &nbsp;
                              </span>
                              {selection}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  // For regular sections, check if there are selections
                  const selection = selections[sectionKey];
                  const hasSelection =
                    selection &&
                    ((Array.isArray(selection) && selection.length > 0) ||
                      (!Array.isArray(selection) && selection !== ''));

                  if (!hasSelection) return null;

                  return (
                    <div
                      key={sectionKey}
                      className={styles.vehicleConfigurator_summary_item}
                    >
                      <p className={styles.vehicleConfigurator_summary_label}>
                        {section.title}:
                      </p>
                      {section.type === 'checkbox' ? (
                        <ul className={styles.vehicleConfigurator_summary_list}>
                          {((selections[sectionKey] as string[]) || []).map(
                            (selectedTitle, index) => (
                              <li
                                key={`${selectedTitle}-${index}`}
                                dangerouslySetInnerHTML={{
                                  __html: selectedTitle,
                                }}
                              ></li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>{selection}</p>
                      )}
                    </div>
                  );
                }
              })}
            </div>

            <div className={styles.vehicleConfigurator_summary_form}>
              <h4 className={styles.vehicleConfigurator_summary_form_title}>
                Request a Quote
              </h4>
              <ConfiguratorForm
                selectedOptions={selections}
                requestPassword={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleBuilder;
