import React from 'react';
import { IconProps } from 'types';

const FacebookIcon = ({ color, className }: IconProps) => {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 0C6.71019 0 0 6.71019 0 15C0 23.2898 6.71019 30 15 30C23.2898 30 30 23.2898 30 15C30 6.71019 23.2772 0 15 0ZM19.4103 9.09857C19.4103 9.09857 17.9191 9.09857 17.3252 9.09857C16.5923 9.09857 16.4406 9.40185 16.4406 10.1601C16.4406 10.7919 16.4406 11.9924 16.4406 11.9924H19.4103L19.1196 15.2148H16.428V24.8568H12.5737V15.2527H10.5644V11.9798H12.5737C12.5737 11.9798 12.5737 11.5122 12.5737 9.40185C12.5737 6.98821 13.8753 5.72452 16.7313 5.72452C17.1988 5.72452 19.3976 5.72452 19.3976 5.72452L19.4103 9.09857Z"
        fill={`${color ? color : '#171717'}`}
      />
    </svg>
  );
};

export default FacebookIcon;
