'use client';

import { useLenis } from 'lenis/react';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './VehicleBuilder.module.scss';

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

const VehicleBuilder: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selections, setSelections] = useState<
    Record<string, string | string[]>
  >({});
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);

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
        {
          title: 'Application',
          type: 'select',
          options: [
            { title: 'Law Enforcement' },
            { title: 'Security' },
            { title: 'Other' },
          ],
        },
      ],
    },
    {
      title: 'Fuel Type',
      type: 'radio',
      options: [{ title: 'Gasoline' }, { title: 'Diesel' }],
    },
    {
      title: 'Conversion Options',
      type: 'checkbox',
      options: [
        {
          title: 'Battery Kill Switch',
          info: 'Allows immediate disconnection of the battery in emergency situations.',
        },
        { title: 'Composite Run-Flat Inserts' },
        { title: 'Detachable Ladder - Exterior' },
        { title: 'Grille Guard/Bull Bar' },
        { title: 'Gun Racks' },
        { title: 'Heavy Duty D-Rings' },
        { title: 'Heavy Duty Hangers' },
        { title: 'Heavy Duty Side Steps' },
        { title: 'Heavy Duty Trailer Hitch Step' },
        { title: 'Heavy-Duty Vinyl Floor' },
        { title: 'Heavy Duty Winch' },
        { title: 'Hidden LED Grille Lights' },
        { title: 'Inconspicuous Reinforced Bumper' },
        { title: 'Interior Fold Down Ladder' },
        { title: 'Mesh Screen Protection' },
        { title: 'Mil-Spec Aircraft Tiedowns' },
        { title: 'Privacy Curtain' },
        { title: 'Ram Bumper' },
        { title: 'Roof Hatch' },
        { title: 'Roof Over-Watch Area' },
        { title: 'Tactical Molle Racks' },
        { title: 'Upgraded Heavy Duty Door Hinges' },
        { title: 'Upgraded Heavy Duty Suspension' },
        { title: 'Weapon Vault Lockbox' },
      ],
    },
    {
      title: 'Communications Options',
      type: 'checkbox',
      options: [
        { title: '360 Degree Monitoring System' },
        { title: 'Golights' },
        { title: 'Interior White/Red Crew Lights' },
        { title: 'IR Lights' },
        { title: 'NV Front Camera & Monitor' },
        { title: 'PA/Multi Siren System' },
        { title: 'Power Inverter & USB Outlets' },
        { title: 'Rear AC Unit' },
        { title: 'Server/Network Cabinet' },
        { title: 'Side Camera' },
      ],
    },
    {
      title: 'Other',
      type: 'checkbox',
      options: [
        { title: 'Bomb Jamming & Detection System' },
        { title: 'Emergency Oxygen System' },
        { title: 'Fire Extinguisher & First Aid Kit' },
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

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selections, selectionOrder, pathname, router]);

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

  const lenis = useLenis();

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
          Configurator
        </h2>
        <h3 className={`${styles.vehicleConfigurator_subtitle} c-description`}>
          Build your Pit-Bull®
        </h3>
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
          {/* Slider with Images */}
          <div className={styles.vehicleConfigurator_slider}>
            <Image
              src="https://d102sycao8uwt8.cloudfront.net/large_armored_swat_truck_apc_tactical_pitbull_vx_a9_01_2e7fc1f92e.png"
              width={1500}
              height={750}
              alt="Alpineco"
              className={styles.vehicleConfigurator_slider_featuredImage}
              style={{ objectFit: 'cover' }}
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
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.876364 10L0.00363632 9.11909L4.09273 5.00091L0 0.881818L0.874545 0L5.83091 4.99182L0.876364 10Z"
                      fill="currentColor"
                    />
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
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.876364 10L0.00363632 9.11909L4.09273 5.00091L0 0.881818L0.874545 0L5.83091 4.99182L0.876364 10Z"
                      fill="currentColor"
                    />
                  </svg>
                </i>
              </button>
            </div>
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
                  <h2 className={styles.vehicleConfigurator_section_title}>
                    {section.title}
                    {section.options.length > 2 && (
                      <span>({section.options?.length})</span>
                    )}
                  </h2>

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
                              >
                                {option.title}
                              </span>

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

        {/* Bottom Summary Button */}
        <div className={styles.vehicleConfigurator_bottomBar}>
          <div className={styles.vehicleConfigurator_bottomBar_heading}>
            <h4 className={styles.vehicleConfigurator_bottomBar_title}>
              Pit-Bull VXT® Armored Tactical SWAT/APC Truck
            </h4>

            <button
              className={styles.vehicleConfigurator_bottomBar_button}
              onClick={() => setShowSummary((prev) => !prev)}
            >
              {showSummary ? 'Hide Summary' : 'Summary'}
            </button>
          </div>

          {showSummary && (
            <div className={styles.vehicleConfigurator_summary}>
              <h3 className={styles.vehicleConfigurator_summary_title}>
                Your Vehicle Configuration
              </h3>
              <div className={styles.vehicleConfigurator_summary_items}>
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
                        <div
                          className={styles.vehicleConfigurator_summary_group}
                        >
                          {section.subsections.map((subsection) => {
                            const subsectionKey = slugify(subsection.title);
                            const selection = selections[subsectionKey];
                            const hasSelection =
                              selection &&
                              ((Array.isArray(selection) &&
                                selection.length > 0) ||
                                (!Array.isArray(selection) &&
                                  selection !== ''));

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
                          <ul
                            className={styles.vehicleConfigurator_summary_list}
                          >
                            {((selections[sectionKey] as string[]) || []).map(
                              (selectedTitle, index) => (
                                <li key={`${selectedTitle}-${index}`}>
                                  {selectedTitle}
                                </li>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleBuilder;
