import React from 'react';
import { IconProps } from 'types';

const XIcon = ({ color, className }: IconProps) => {
  return (
    <svg
      className={className}
      width="28"
      height="30"
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 31C23.7843 31 30.5 24.2843 30.5 16C30.5 7.71573 23.7843 1 15.5 1C7.21573 1 0.5 7.71573 0.5 16C0.5 24.2843 7.21573 31 15.5 31Z"
        stroke="white"
        strokeMiterlimit="10"
        fill={`${color ? color : '#171717'}`}
      />
      <path
        d="M6.71192 7.65601L13.8817 17.2426L6.66674 25.0369H8.29067L14.6075 18.2127L19.7112 25.0369H25.2372L17.6638 14.9112L24.3795 7.65601H22.7556L16.9383 13.9408L12.2379 7.65601H6.71192ZM9.1 8.85207H11.6386L22.8488 23.8408H20.3102L9.1 8.85207Z"
        fill={`${color ? '#101010' : 'white'}`}
      />
    </svg>
  );
};

export default XIcon;
