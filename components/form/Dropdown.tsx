/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect } from 'react';
import styles from './Form.module.scss';
import ChevronIcon from 'components/icons/Chevron';

const Dropdown = ({
  label,
  options,
  selectedOption,
  setSelectedOption,
  isActive,
  setIsActive,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    function handleClickOutside(event) {
      // @ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, setIsActive]);

  return (
    <div
      ref={dropdownRef}
      className={`${styles.form_select} ${styles.form_input} ${
        isActive ? styles.form_select_active : ''
      }`}
      onClick={() => setIsActive(!isActive)}
    >
      <button className={`${styles.form_select_selected}`}>
        <span>
          {selectedOption || (
            <span className={`${styles.form_select_placeholder}`}>{label}</span>
          )}
        </span>
        <ChevronIcon />
      </button>
      <div
        data-lenis-prevent
        className={`${styles.form_select_list} ${
          isActive ? styles.form_select_list_active : ''
        }`}
      >
        {options.map((option, index) => (
          <button
            key={index}
            className={`${styles.form_select_option}`}
            onClick={() => {
              setSelectedOption(option);
              setIsActive(false);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
