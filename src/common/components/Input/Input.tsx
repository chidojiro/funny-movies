import { PlaceholderInputProps } from '@/common/types';
import { StringUtils } from '@/common/utils';
import clsx from 'clsx';
import React from 'react';

export type InputProps = Omit<JSX.IntrinsicElements['input'], 'ref' | 'size'> &
  PlaceholderInputProps & {
    error?: boolean;
    size?: 'sm' | 'md';
  };

export const Input = React.forwardRef(
  ({ error, className, placeholderInputRef: _, size = 'md', ...restProps }: InputProps, ref: any) => {
    return (
      <input
        ref={ref}
        className={clsx(
          StringUtils.withProjectClassNamePrefix('input'),
          'shadow-sm focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md text-black outline-none px-2',
          { 'h-7': size === 'sm', 'h-10': size === 'md' },
          { '!border-danger !focus:border-danger': error },
          className
        )}
        {...restProps}
      />
    );
  }
);

Input.displayName = 'Input';
