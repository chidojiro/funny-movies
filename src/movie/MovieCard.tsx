import { Button } from '@/common/components';
import { ThumbsDownIcon, ThumbsUpIcon } from '@/common/icons';
import clsx from 'clsx';
import { isEqual } from 'lodash-es';
import React from 'react';
import { toast } from 'react-toastify';
import { Movie } from './types';

export type MovieCardProps = {
  movie: Movie;
  userId?: string;
  onLikeToggle: (movie: Movie) => void;
  onDislikeToggle: (movie: Movie) => void;
};

export const MovieCard = React.memo(({ movie, userId, onLikeToggle, onDislikeToggle }: MovieCardProps) => {
  const { dislikedBy, likedBy, sharedBy, embedHtml, title, description } = movie;
  const { email } = sharedBy;

  return (
    <div className='flex gap-10'>
      <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
      <div className='max-w-xl'>
        <h3>{title}</h3>
        <p>
          <span className='font-semibold underline'>Shared by: </span>
          <span>{email}</span>
        </p>
        <div className='flex items-center gap-4 mt-2'>
          <div className='flex gap-1 items-center'>
            {likedBy.length}
            <Button onClick={() => (userId ? onLikeToggle(movie) : toast.info('Please login to perform this action!'))}>
              <ThumbsUpIcon className={clsx({ 'text-primary': likedBy.includes(userId!) })} />
            </Button>
          </div>
          <div className='flex gap-1 items-center'>
            {dislikedBy.length}
            <Button
              onClick={() => (userId ? onDislikeToggle(movie) : toast.info('Please login to perform this action!'))}>
              <ThumbsDownIcon className={clsx({ 'text-danger': dislikedBy.includes(userId!) })} />
            </Button>
          </div>
        </div>
        <p className='font-semibold underline mt-2'>Description:</p>
        <p className='text-sm line-clamp-6 text-gray-600 mt-1'>{description}</p>
      </div>
    </div>
  );
}, isEqual);

MovieCard.displayName = 'MovieCard';
