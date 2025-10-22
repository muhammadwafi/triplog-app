import * as React from 'react';

export function RoundedElement({
  pathClassName,
  ...props
}: {
  pathClassName?: string;
} & React.ComponentProps<'div'>) {
  return (
    <div {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <g clipPath="url(#clip0_94_252)">
          <path
            d="M100 -2V2C45.8746 2 2 45.8746 2 100H-2V-2H100Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="4"
            className={pathClassName}
          />
        </g>
        <defs>
          <clipPath id="clip0_94_252">
            <rect width="100" height="100" fill="none" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
