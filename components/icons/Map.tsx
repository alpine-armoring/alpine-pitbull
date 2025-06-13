import React from 'react';
import { IconProps } from 'types';

const MapIcon = ({ color, className, onMouseOver, onMouseOut }: IconProps) => {
  return (
    <svg
      className={className}
      height="20"
      width="20"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <path
        fill={`${color ? color : '#fff'}`}
        d="M 15 0 C 9.007812 0 4.136719 4.875 4.136719 10.863281 C 4.136719 18.300781 13.859375 29.214844 14.273438 29.675781 C 14.660156 30.109375 15.339844 30.109375 15.726562 29.675781 C 16.140625 29.214844 25.863281 18.300781 25.863281 10.863281 C 25.863281 4.875 20.992188 0 15 0 Z M 15 16.332031 C 11.984375 16.332031 9.535156 13.878906 9.535156 10.863281 C 9.535156 7.851562 11.984375 5.398438 15 5.398438 C 18.015625 5.398438 20.464844 7.851562 20.464844 10.863281 C 20.464844 13.878906 18.015625 16.332031 15 16.332031 Z M 15 16.332031 "
      />
    </svg>
  );
};

export default MapIcon;
