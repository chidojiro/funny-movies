import { TimesIcon } from '@/common/icons';
import { Children, ClassName } from '@/common/types';
import { StringUtils } from '@/common/utils';
import clsx from 'clsx';
import { Portal } from '../Portal';

type TitleProps = Children & ClassName & JSX.IntrinsicElements['h2'];

const Title = ({ children, className, ...restProps }: TitleProps) => {
  return (
    <h2
      className={clsx(
        StringUtils.withProjectClassNamePrefix('modal-title'),
        'flex items-center justify-center font-semibold uppercase',
        className
      )}
      {...restProps}>
      {children}
    </h2>
  );
};

const Content = ({ children, className }: Children & ClassName) => {
  return (
    <div className={clsx(StringUtils.withProjectClassNamePrefix('modal-content'), 'mt-6', className)}>{children}</div>
  );
};

export type ModalProps = Children &
  ClassName &
  Omit<JSX.IntrinsicElements['div'], 'ref'> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
    open?: boolean;
    onClose?: () => void;
  };

export const Modal = ({ className, children, size = 'md', open, onClose, ...restProps }: ModalProps) => {
  if (!open) return null;

  return (
    <Portal>
      <div
        className={clsx(
          StringUtils.withProjectClassNamePrefix('modal'),
          'fixed top-0 left-0 w-screen h-screen z-50',
          open ? 'animate-modal-enter' : 'animate-modal-leave'
        )}>
        <div style={{ background: 'rgba(23,36,45,0.1)' }} className={clsx('w-full h-full')} onClick={onClose}></div>
        <div
          className={clsx(
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
            'border border-solid border-gray-100 shadow',
            'opacity-1 max-w-[90vw] rounded-2xl',
            'max-w-[95vw] max-h-[90vh] overflow-auto',
            'bg-white',
            { 'w-[392px] p-6': size === 'sm' },
            { 'w-[552px] py-8 px-10': size === 'md' },
            { 'w-[872px] py-10 px-12': size === 'lg' },
            { 'w-[1130px] py-10 px-12': size === 'xl' },
            className
          )}
          {...restProps}>
          <TimesIcon className='absolute cursor-pointer top-5 right-5' onClick={onClose} />
          {children}
        </div>
      </div>
    </Portal>
  );
};

Modal.Content = Content;
Modal.Title = Title;
